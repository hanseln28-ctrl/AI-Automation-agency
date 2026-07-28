'use client';

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils/cn';
import { UploadCloud, FileVideo, X, Check } from 'lucide-react';

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024 * 1024; // 10GB

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function UploadDropzone({ onFileSelected, selectedFile, onClear }: UploadDropzoneProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]!);
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
    disabled: !!selectedFile,
  });

  if (selectedFile) {
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
                onClick={onClear}
                className="shrink-0 rounded-md p-1 text-text-tertiary hover:text-text-primary hover:bg-background-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
              <span>{formatBytes(selectedFile.size)}</span>
              <span className="text-text-tertiary">•</span>
              <span>
                {selectedFile.type.split('/')[1]?.toUpperCase() ?? 'MP4'}
              </span>
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

      {/* Glow effect on drag */}
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
          <p className="mt-1 text-xs text-text-tertiary">
            or click to browse
          </p>
        </div>
        <p className="text-2xs text-text-tertiary">
          Supported formats: MP4, MOV, WEBM (up to 10GB)
        </p>
      </div>
    </div>
  );
}
