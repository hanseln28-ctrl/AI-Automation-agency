'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import {
  Eye,
  Users,
  MessageSquare,
  Search,
  Sparkles,
  RotateCcw,
  Trash2,
  Edit,
  Play,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { fadeIn } from '@/lib/utils/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatCard } from '@/components/shared/stat-card';
import {
  StreamDetailHeader,
  StatusPipeline,
  StreamTabs,
  PLATFORM_CONFIG,
  STATUS_CONFIG,
} from '@/components/streams';
import { useStream } from '@/lib/hooks/use-streams';
import { streamToMock, clipToMock } from '@/lib/adapters';

type DetailTab = 'overview' | 'clips' | 'transcript' | 'settings';

// ── Transcript types ──

interface TranscriptLine {
  time: string;
  speaker: string;
  text: string;
}

function parseTranscript(json: unknown): TranscriptLine[] {
  if (!json) return [];
  if (Array.isArray(json)) return json as TranscriptLine[];
  if (typeof json === 'object' && json !== null) {
    const obj = json as Record<string, unknown>;
    if (Array.isArray(obj.lines)) return obj.lines as TranscriptLine[];
    if (Array.isArray(obj.segments)) return obj.segments as TranscriptLine[];
  }
  return [];
}

// ── Loading Skeleton ──

function StreamDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-background-elevated" />
      <div className="rounded-xl border border-border-subtle bg-background-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-64 h-36 md:h-auto bg-background-elevated" />
          <div className="flex-1 p-6 space-y-4">
            <div className="h-7 w-3/4 rounded bg-background-elevated" />
            <div className="flex gap-3">
              <div className="h-6 w-20 rounded-full bg-background-elevated" />
              <div className="h-6 w-16 rounded bg-background-elevated" />
              <div className="h-6 w-24 rounded bg-background-elevated" />
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 rounded-lg bg-background-elevated w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-background-elevated" />
        ))}
      </div>
    </div>
  );
}

export default function StreamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const streamId = params.id as string;
  const [activeTab, setActiveTab] = React.useState<DetailTab>('overview');
  const [transcriptSearch, setTranscriptSearch] = React.useState('');

  const { data: apiStream, isLoading, error } = useStream(streamId);

  // Adapt API data to component shapes
  const stream = React.useMemo(
    () => (apiStream ? streamToMock(apiStream) : null),
    [apiStream],
  );

  const apiClips = React.useMemo(
    () => (apiStream?.clips ? apiStream.clips.map(clipToMock) : []),
    [apiStream],
  );

  const transcriptLines = React.useMemo(
    () => parseTranscript(apiStream?.transcriptJson),
    [apiStream],
  );

  // ── Loading State ──

  if (isLoading) {
    return <StreamDetailSkeleton />;
  }

  // ── Error State ──

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-text-primary">Failed to load stream</p>
        <p className="mt-1 text-sm text-text-secondary">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <Button variant="default" className="mt-4" onClick={() => router.push('/streams')}>
          Back to Streams
        </Button>
      </div>
    );
  }

  // ── Not Found State ──

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-text-primary">Stream not found</p>
        <p className="mt-1 text-sm text-text-secondary">
          The stream you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button variant="default" className="mt-4" onClick={() => router.push('/streams')}>
          Back to Streams
        </Button>
      </div>
    );
  }

  const filteredTranscript = transcriptSearch
    ? transcriptLines.filter(
        (line) =>
          line.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
          line.speaker.toLowerCase().includes(transcriptSearch.toLowerCase()),
      )
    : transcriptLines;

  return (
    <div className="space-y-6 animate-fade-in">
      <StreamDetailHeader stream={stream} />

      {/* Status Pipeline */}
      <StatusPipeline currentStatus={stream.status} />

      {/* Detail Tabs */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit">
        {(['overview', 'clips', 'transcript', 'settings'] as DetailTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-all duration-150',
              activeTab === tab
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeTab}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  label="Total Views"
                  value={(stream.views ?? 0).toLocaleString()}
                  icon={Eye}
                />
                <StatCard
                  label="Peak Viewers"
                  value={(stream.peakViewers ?? 0).toLocaleString()}
                  icon={Users}
                />
                <StatCard
                  label="Chat Messages"
                  value={(stream.chatMessages ?? 0).toLocaleString()}
                  icon={MessageSquare}
                />
                <StatCard
                  label="Duration"
                  value={stream.duration}
                  icon={Clock}
                />
              </div>

              {/* AI Summary */}
              {stream.aiSummary && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-subtle">
                      <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary">AI Summary</h3>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {stream.aiSummary}
                  </p>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5">
                  <p className="text-xs text-text-tertiary uppercase tracking-wider">Platform</p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">
                    {PLATFORM_CONFIG[stream.platform].label}
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-xs text-text-tertiary uppercase tracking-wider">Status</p>
                  <Badge variant={STATUS_CONFIG[stream.status].variant} className="mt-1">
                    {STATUS_CONFIG[stream.status].label}
                  </Badge>
                </Card>
                <Card className="p-5">
                  <p className="text-xs text-text-tertiary uppercase tracking-wider">Import Date</p>
                  <p className="mt-1 text-lg font-semibold text-text-primary">
                    {stream.importDate}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* ── Clips Tab ── */}
          {activeTab === 'clips' && (
            <div>
              {apiClips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {apiClips.map((clip, idx) => (
                    <MotionDiv
                      key={clip.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group cursor-pointer rounded-xl border border-border-subtle bg-background-card overflow-hidden hover:border-border hover:shadow-glass transition-all"
                    >
                      {/* Clip thumbnail */}
                      <div
                        className={cn(
                          'h-36 bg-gradient-to-br relative flex items-center justify-center',
                          clip.thumbnailGradient,
                        )}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <Play className="h-10 w-10 text-white" />
                        </div>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-2xs text-white">
                          {clip.duration}s
                        </span>
                      </div>

                      <div className="p-4">
                        <p className="text-sm font-medium text-text-primary line-clamp-2 mb-2">
                          {clip.title}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-2xs">
                            {PLATFORM_CONFIG[stream.platform].label}
                          </Badge>
                          <span className="text-2xs text-text-tertiary flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {clip.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle bg-background-card p-12 text-center">
                  <p className="text-text-secondary text-sm">
                    Clips will appear here once processing is complete.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Transcript Tab ── */}
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <Input
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  placeholder="Search transcript..."
                  className="pl-9"
                />
              </div>

              {/* Transcript Lines */}
              <div className="rounded-xl border border-border-subtle bg-background-card overflow-hidden">
                {transcriptLines.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-text-secondary text-sm">
                      Transcript will appear here once processing is complete.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle max-h-[500px] overflow-y-auto">
                    {filteredTranscript.length === 0 ? (
                      <div className="p-8 text-center text-sm text-text-tertiary">
                        No transcript lines match your search.
                      </div>
                    ) : (
                      filteredTranscript.map((line, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 p-4 hover:bg-background-surface/30 transition-colors"
                        >
                          <span className="shrink-0 text-xs font-mono text-accent pt-0.5">
                            {line.time}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-text-tertiary">
                              {line.speaker}
                            </span>
                            <p className="text-sm text-text-primary mt-0.5">{line.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-semibold text-text-primary">Stream Settings</h3>

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Stream Title
                  </label>
                  <Input defaultValue={stream.title} />
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Change Title
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reprocess Stream
                  </Button>
                </div>

                <Separator />

                <div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-danger hover:text-danger border-danger/30 hover:border-danger/50"
                    size="sm"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Stream
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  Export Options
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Export Transcript (.txt)
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Export Clips Metadata (.csv)
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
