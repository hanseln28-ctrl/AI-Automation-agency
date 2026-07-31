'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '@clerk/nextjs';
import { cn } from '@/lib/utils/cn';
import { UploadCloud, FileVideo, X, Check, Loader2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface UploadProgressInfo {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadResult {
  id: string;
  title: string;
}

interface UploadDropzoneProps {
  onFileSelected?: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  /** When provided, the dropzone handles the upload via presigned R2 URLs (3-step flow) */
  onUploadSuccess?: (result: UploadResult) => void;
  /** Called on upload error */
  onUploadError?: (error: string) => void;
  /** Optional title for the upload */
  uploadTitle?: string;
  /** Callback for upload progress */
  onUploadProgress?: (progress: UploadProgressInfo) => void;
  /** External upload handler (overrides built-in XHR when provided) */
  onUpload?: (params: { file: File; title: string }) => Promise<UploadResult>;
}

const MAX_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

/**
 * Uploads a file to a URL using fetch with a TransformStream to track progress.
 * This bypasses XHR and works with presigned URLs for direct-to-R2 uploads.
 */
async function uploadWithProgress(
  url: string,
  file: File,
  onProgress: (percent: number, loaded: number, total: number) => void,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Create a ReadableStream from the file that reports progress
    const fileStream = file.stream();
    const total = file.size;
    let loaded = 0;

    const progressStream = new ReadableStream({
      async start(controller) {
        const reader = fileStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            loaded += value.byteLength;
            const pct = Math.round((loaded / total) * 100);
            onProgress(pct, loaded, total);
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    fetch(url, {
      method: 'PUT',
      body: progressStream,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
      // Don't follow redirects — presigned URLs are direct
      redirect: 'follow',
    })
      .then((response) => {
        if (response.ok) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${response.status}`));
        }
      })
      .catch((err) => {
        // Check if it's a network error
        const message =
          err instanceof TypeError && err.message === 'Failed to fetch'
            ? 'Network error — please check your connection and try again.'
            : err instanceof Error
              ? err.message
              : 'Upload failed';
        reject(new Error(message));
      });
  });
}

export function UploadDropzone({
  onFileSelected,
  selectedFile,
  onClear,
  onUpload,
  onUploadSuccess,
  onUploadError,
  uploadTitle,
  onUploadProgress,
}: UploadDropzoneProps) {
  const [uploadState, setUploadState] = React.useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { getToken } = useAuth();

  const isUploadMode = !!(onUpload || onUploadSuccess);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]!;
        onFileSelected?.(file);
        setUploadState('idle');
        setUploadProgress(0);
        setErrorMessage('');
      }
    },
    [onFileSelected],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/webm': ['.webm'],
    },
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: !!selectedFile && uploadState !== 'idle',
  });

  const handleClear = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setErrorMessage('');
    onClear();
  };

  const handleUpload = React.useCallback(async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMessage('');

    const token = await getToken();

    if (!token) {
      setUploadState('error');
      setErrorMessage('Authentication failed. Please sign out and sign in again.');
      onUploadError?.('Authentication failed. Please sign out and sign in again.');
      return;
    }

    try {
      const title =
        uploadTitle?.trim() ||
        selectedFile.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

      let result: UploadResult;

      if (onUpload) {
        // ── External handler (backward compatibility) ──
        result = await onUpload({ file: selectedFile, title });
      } else {
        // ── Presigned URL flow: presigned → PUT to R2 → confirm ──

        // Step 1: Get presigned URL from our API
        const presignedResponse = await fetch('/api/upload/presigned', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            contentType: selectedFile.type,
            title,
          }),
        });

        if (!presignedResponse.ok) {
          let errorMsg = `Failed to prepare upload (${presignedResponse.status})`;
          try {
            const errJson = await presignedResponse.json();
            errorMsg = errJson.error || errorMsg;
          } catch {
            // use default
          }
          throw new Error(errorMsg);
        }

        const presignedData = await presignedResponse.json();
        if (!presignedData.success || !presignedData.data) {
          throw new Error(presignedData.error || 'Failed to get upload URL');
        }

        const { presignedUrl, key } = presignedData.data;

        // Step 2: Upload directly to R2 via presigned URL with progress tracking
        await uploadWithProgress(presignedUrl, selectedFile, (pct, loaded, total) => {
          setUploadProgress(pct);
          onUploadProgress?.({ loaded, total, percent: pct });
        });

        // Step 3: Confirm the upload with our API to create the DB record
        const confirmResponse = await fetch('/api/upload/confirm', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            key,
            title,
            fileSizeBytes: selectedFile.size,
          }),
        });

        if (!confirmResponse.ok) {
          let errorMsg = `Failed to confirm upload (${confirmResponse.status})`;
          try {
            const errJson = await confirmResponse.json();
            errorMsg = errJson.error || errorMsg;
          } catch {
            // use default
          }
          throw new Error(errorMsg);
        }

        const confirmData = await confirmResponse.json();
        if (!confirmData.success || !confirmData.data) {
          throw new Error(confirmData.error || 'Upload confirmation failed');
        }

        result = { id: confirmData.data.id, title: confirmData.data.title };
      }

      setUploadState('success');
      setUploadProgress(100);
      onUploadSuccess?.(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setUploadState('error');
      setErrorMessage(message);
      onUploadError?.(message);
    }
  }, [selectedFile, onUpload, uploadTitle, onUploadSuccess, onUploadError, onUploadProgress]);

  if (selectedFile && isUploadMode) {
    return (
      <div className="rounded-xl border border-border-subtle bg-background-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              uploadState === 'success'
                ? 'bg-success-subtle'
                : uploadState === 'error'
                  ? 'bg-danger-subtle'
                  : 'bg-accent-subtle',
            )}
          >
            {uploadState === 'uploading' ? (
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            ) : uploadState === 'error' ? (
              <AlertTriangle className="h-6 w-6 text-danger" />
            ) : uploadState === 'success' ? (
              <Check className="h-6 w-6 text-success" />
            ) : (
              <FileVideo className="h-6 w-6 text-accent" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-text-primary truncate">
                {selectedFile.name}
              </p>
              {uploadState === 'idle' && (
                <button
                  onClick={handleClear}
                  className="shrink-0 rounded-md p-1 text-text-tertiary hover:text-text-primary hover:bg-background-surface transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
              <span>{formatBytes(selectedFile.size)}</span>
              <span className="text-text-tertiary">•</span>
              <span>{selectedFile.type.split('/')[1]?.toUpperCase() ?? 'MP4'}</span>
            </div>
          </div>
        </div>

        {uploadState === 'uploading' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Uploading to cloud storage...</span>
              <span className="tabular-nums text-text-secondary">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {uploadState === 'success' && (
          <div className="flex items-center gap-1.5 text-xs text-success">
            <Check className="h-3 w-3" />
            <span>Upload complete! Processing will continue on the stream page.</span>
          </div>
        )}

        {uploadState === 'error' && (
          <div className="space-y-3">
            <div className="flex items-start gap-1.5 text-xs text-danger">
              <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={handleClear} className="text-xs text-accent hover:underline">
              Try a different file
            </button>
          </div>
        )}

        {uploadState === 'idle' && (
          <button
            onClick={handleUpload}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover active:scale-[0.98] transition-all"
          >
            Start Upload
          </button>
        )}
      </div>
    );
  }

  if (selectedFile && !isUploadMode) {
    return (
      <div className="rounded-xl border border-border-subtle bg-background-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success-subtle">
            <FileVideo className="h-6 w-6 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-text-primary truncate">
                {selectedFile.name}
              </p>
              <button
                onClick={handleClear}
                className="shrink-0 rounded-md p-1 text-text-tertiary hover:text-text-primary hover:bg-background-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
              <span>{formatBytes(selectedFile.size)}</span>
              <span className="text-text-tertiary">•</span>
              <span>{selectedFile.type.split('/')[1]?.toUpperCase() ?? 'MP4'}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-success">
              <Check className="h-3 w-3" />
              <span>File ready for import</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 cursor-pointer',
        isDragActive && !isDragReject
          ? 'border-accent bg-accent-subtle scale-[1.01]'
          : isDragReject
            ? 'border-danger bg-danger-subtle'
            : 'border-border hover:border-border hover:bg-background-surface/50',
      )}
    >
      <input {...getInputProps()} />
      {isDragActive && !isDragReject && (
        <div className="absolute inset-0 rounded-xl bg-accent/5 blur-xl" />
      )}
      <div className="relative flex flex-col items-center gap-3">
        <div
          className={cn(
            'flex h-16 w-16 items-center justify-center rounded-2xl transition-colors',
            isDragActive && !isDragReject
              ? 'bg-accent-subtle text-accent'
              : 'bg-background-surface text-text-tertiary',
          )}
        >
          <UploadCloud className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {isDragActive && !isDragReject
              ? 'Drop your file here'
              : 'Drag & drop your video file here'}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">or click to browse</p>
        </div>
        <p className="text-2xs text-text-tertiary">
          Supported formats: MP4, MOV, WEBM (up to 10GB)
        </p>
      </div>
    </div>
  );
}
