'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
import { UploadDropzone } from '@/components/streams/upload-dropzone';
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

    // Simulate OAuth success
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
    // Auto-fill title from filename
    const name = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    setStreamTitle(name);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setStreamTitle('');
    setDescription('');
  };

  const handleStartImport = () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    // Simulate processing stages
    const stages: { stage: UploadStage; progress: number; delay: number }[] = [
      { stage: 'uploading', progress: 100, delay: 2000 },
      { stage: 'processing', progress: 100, delay: 3000 },
      { stage: 'analyzing', progress: 100, delay: 3500 },
      { stage: 'generating', progress: 100, delay: 4000 },
    ];

    let currentIdx = 0;
    const runStage = () => {
      if (currentIdx >= stages.length) {
        toast.success('Import complete! Redirecting...');
        setTimeout(() => router.push('/streams'), 1000);
        return;
      }

      const stage = stages[currentIdx]!;
      setUploadStage(stage.stage);
      setUploadProgress(0);

      // Animate progress
      const totalSteps = 20;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        const pct = Math.min(Math.round((step / totalSteps) * 100), stage.progress);
        setUploadProgress(pct);
        if (step >= totalSteps) {
          clearInterval(interval);
          currentIdx++;
          setTimeout(runStage, 500);
        }
      }, stage.delay / totalSteps);
    };

    setTimeout(runStage, 300);
  };

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

                    <div className="pt-2">
                      <Button
                        onClick={handleStartImport}
                        disabled={!streamTitle.trim()}
                        className="w-full sm:w-auto"
                      >
                        Start Import
                      </Button>
                    </div>
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
