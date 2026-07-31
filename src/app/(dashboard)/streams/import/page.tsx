'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, MotionP, AnimatePresence } from '@/components/shared/motion';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { slideRight, slideLeft } from '@/lib/utils/animations';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlatformConnectCard } from '@/components/streams/platform-connect-card';
import { UploadDropzone, type UploadResult } from '@/components/streams/upload-dropzone';
import { UploadProgress, type UploadStage } from '@/components/streams/upload-progress';
import { MOCK_PLATFORM_CONNECTIONS } from '@/components/streams/mock-data';
import { PLATFORM_CONFIG } from '@/components/streams/types';
import type { Platform, PlatformConnection } from '@/components/streams/types';
import { toast } from 'sonner';

type ImportTab = 'connect' | 'upload';

export default function ImportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<ImportTab>('connect');

  // Platform connection state (mock)
  const [connections, setConnections] = React.useState<PlatformConnection[]>(MOCK_PLATFORM_CONNECTIONS);
  const [connectingPlatform, setConnectingPlatform] = React.useState<Platform | null>(null);
  const [showOAuthModal, setShowOAuthModal] = React.useState(false);

  // Upload state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [streamTitle, setStreamTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [platformSource, setPlatformSource] = React.useState<Platform>('twitch');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [uploadStage, setUploadStage] = React.useState<UploadStage>('uploading');
  const [uploadProgress, setUploadProgress] = React.useState(0);

  // ── Platform Connect Handlers ──

  const handleConnect = (platform: Platform) => {
    setConnectingPlatform(platform);
    setShowOAuthModal(true);
  };

  const handleOAuthContinue = () => {
    if (!connectingPlatform) return;
    setShowOAuthModal(false);

    setTimeout(() => {
      setConnections((prev) =>
        prev.map((c) =>
          c.platform === connectingPlatform
            ? {
                ...c,
                connected: true,
                accountName: `DemoUser_${connectingPlatform}`,
                handle: `@demouser_${connectingPlatform}`,
              }
            : c,
        ),
      );
      toast.success(`Connected to ${PLATFORM_CONFIG[connectingPlatform].label}`);
      setConnectingPlatform(null);
    }, 500);
  };

  const handleDisconnect = (platform: Platform) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.platform === platform
          ? { ...c, connected: false, accountName: undefined, handle: undefined }
          : c,
      ),
    );
    toast.success(`Disconnected from ${PLATFORM_CONFIG[platform].label}`);
  };

  const handleImportFromPlatform = (platform: Platform) => {
    toast.success(`Importing latest stream from ${PLATFORM_CONFIG[platform].label}...`);
    setTimeout(() => {
      router.push('/streams');
    }, 1500);
  };

  // ── Upload Handlers ──

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    setStreamTitle(name);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setStreamTitle('');
    setDescription('');
  };

  const handleUploadSuccess = (result: UploadResult) => {
    // Show post-upload processing
    setIsProcessing(true);
    setUploadStage('processing');

    // Simulate quick post-processing stages then redirect
    const stages: { stage: UploadStage; delay: number }[] = [
      { stage: 'processing', delay: 1500 },
      { stage: 'analyzing', delay: 1000 },
      { stage: 'generating', delay: 1000 },
    ];

    let currentIdx = 0;
    const runStage = () => {
      if (currentIdx >= stages.length) {
        toast.success('Video uploaded successfully!', { description: result.title });
        router.push(`/streams/${result.id}`);
        return;
      }

      const stage = stages[currentIdx]!;
      setUploadStage(stage.stage);

      // Animate progress for this stage
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(Math.round((elapsed / stage.delay) * 100), 100);
        setUploadProgress(pct);
        if (elapsed >= stage.delay) {
          clearInterval(interval);
          setUploadProgress(100);
          currentIdx++;
          setTimeout(runStage, 200);
        }
      }, 60);
    };

    setTimeout(runStage, 500);
  };

  const handleUploadError = (error: string) => {
    toast.error('Upload failed', { description: error });
  };

  // ── Legacy upload handler for the case where UploadDropzone has onUpload ──
  // This is unused since UploadDropzone now handles upload internally via XHR,
  // but we provide it for the case where the dropzone is used in a larger form.
  const uploadHandler = React.useCallback(
    async ({ file, title }: { file: File; title: string }): Promise<UploadResult> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const json = JSON.parse(xhr.responseText);
              if (json.success && json.data) {
                resolve({ id: json.data.id, title: json.data.title });
              } else {
                reject(new Error(json.error || 'Upload failed'));
              }
            } catch {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const json = JSON.parse(xhr.responseText);
              reject(new Error(json.error || `Upload failed (${xhr.status})`));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload.'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });
    },
    [],
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <PageHeader
        title="Import Stream"
        description="Connect a streaming platform or upload a video file to get started."
        actions={
          <Button variant="ghost" size="sm" onClick={() => router.push('/streams')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Streams
          </Button>
        }
      />

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit">
        <button
          onClick={() => setActiveTab('connect')}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
            activeTab === 'connect'
              ? 'bg-background-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          🔌 Connect Platform
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
            activeTab === 'upload'
              ? 'bg-background-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          📤 Upload MP4
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'connect' ? (
          <MotionDiv
            key="connect"
            variants={slideRight}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connections.map((conn) => (
                <PlatformConnectCard
                  key={conn.platform}
                  connection={conn}
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                  onImport={handleImportFromPlatform}
                />
              ))}
            </div>
          </MotionDiv>
        ) : (
          <MotionDiv
            key="upload"
            variants={slideLeft}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {!isProcessing ? (
              <>
                <UploadDropzone
                  onFileSelected={handleFileSelected}
                  selectedFile={selectedFile}
                  onClear={handleClearFile}
                  onUpload={uploadHandler}
                  uploadTitle={streamTitle}
                  onUploadSuccess={handleUploadSuccess}
                  onUploadError={handleUploadError}
                />

                {selectedFile && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-border-subtle bg-background-card p-6 space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-text-primary">
                      Stream Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Stream Title
                        </label>
                        <Input
                          value={streamTitle}
                          onChange={(e) => setStreamTitle(e.target.value)}
                          placeholder="Enter stream title..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Description (optional)
                        </label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Add a description..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-text-secondary mb-1.5">
                          Platform Source
                        </label>
                        <Select
                          value={platformSource}
                          onValueChange={(v) => setPlatformSource(v as Platform)}
                        >
                          <SelectTrigger className="w-full max-w-[240px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(['twitch', 'youtube', 'kick', 'tiktok', 'upload'] as Platform[]).map(
                              (p) => (
                                <SelectItem key={p} value={p}>
                                  {PLATFORM_CONFIG[p].label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <p className="text-2xs text-text-tertiary">
                      Click &ldquo;Start Upload&rdquo; in the dropzone above to upload your video.
                      The title and platform source will be saved with your stream.
                    </p>
                  </MotionDiv>
                )}
              </>
            ) : (
              <UploadProgress currentStage={uploadStage} progress={uploadProgress} />
            )}
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* OAuth Modal */}
      <Dialog open={showOAuthModal} onOpenChange={setShowOAuthModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Connect to {connectingPlatform ? PLATFORM_CONFIG[connectingPlatform].label : 'Platform'}
            </DialogTitle>
            <DialogDescription>
              You&apos;ll be redirected to{' '}
              {connectingPlatform ? PLATFORM_CONFIG[connectingPlatform].label : 'the platform'} to
              authorize IRON Creator OS. This allows us to import your streams automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-background-surface p-4 space-y-3 text-sm text-text-secondary">
            <p>IRON Creator OS will be able to:</p>
            <ul className="list-disc pl-5 space-y-1 text-text-tertiary">
              <li>View your stream metadata and VODs</li>
              <li>Download past broadcasts for processing</li>
              <li>Access stream titles and descriptions</li>
            </ul>
            <p className="text-2xs text-text-tertiary">
              This is a demo — no actual OAuth flow is configured yet.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOAuthModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleOAuthContinue}>
              Continue to {connectingPlatform ? PLATFORM_CONFIG[connectingPlatform].label : 'Platform'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
