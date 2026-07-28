'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { ClipEditor } from '@/components/clips/clip-editor';
import { ClipTabs } from '@/components/clips/clip-tabs';
import { MOCK_CLIPS, getClipById } from '@/components/clips/mock-data';
import { CLIP_STATUS_CONFIG, MOMENT_CONFIG } from '@/components/clips/types';
import type { MockClip } from '@/components/clips/types';

type DetailTab = 'captions' | 'hashtags' | 'publishing' | 'analytics';

export default function ClipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clipId = params.id as string;

  const clip = getClipById(clipId);
  const [activeTab, setActiveTab] = React.useState<DetailTab>('captions');
  const [clipData, setClipData] = React.useState<MockClip | null>(clip || null);

  if (!clip) {
    return (
      <MotionDiv
        className="flex flex-col items-center justify-center py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Icon name="video" size="xl" color="text-text-tertiary" />
        <h2 className="mt-4 text-lg font-semibold text-text-primary">Clip Not Found</h2>
        <p className="mt-1 text-sm text-text-secondary">This clip may have been deleted or moved.</p>
        <Button className="mt-4" onClick={() => router.push('/clips')}>
          <Icon name="arrow-left" size="sm" color="text-white" className="mr-2" />
          Back to Clips
        </Button>
      </MotionDiv>
    );
  }

  const statusConfig = CLIP_STATUS_CONFIG[clip.status];
  const momentConfig = MOMENT_CONFIG[clip.momentType];

  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title={clip.title}
        description={`From ${clip.sourceStreamName} • ${clip.momentTimestamp}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push('/clips')}>
              <Icon name="arrow-left" size="sm" className="mr-2" />
              Back
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/clips/${clip.id}/edit`)}>
              <Icon name="edit" size="sm" className="mr-2" />
              Edit
            </Button>
          </div>
        }
      />

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 text-text-secondary">
          <Icon name="info" size="sm" />
          Status:
        </span>
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
            statusConfig.variant === 'success' && 'bg-success-subtle text-success border-success/30',
            statusConfig.variant === 'accent' && 'bg-accent-subtle text-accent border-accent/30',
            statusConfig.variant === 'outline' && 'border-border text-text-secondary',
            statusConfig.variant === 'ghost' && 'bg-background-elevated text-text-tertiary',
          )}
        >
          {statusConfig.label}
        </span>

        <span className="text-text-tertiary">•</span>

        <span className="text-text-secondary">
          Format: {clip.format === 'vertical' ? '9:16' : clip.format === 'horizontal' ? '16:9' : '1:1'}
        </span>

        <span className="text-text-tertiary">•</span>

        <span className="text-text-secondary">
          Duration: {clip.duration}s
        </span>

        {clip.views > 0 && (
          <>
            <span className="text-text-tertiary">•</span>
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <Icon name="eye" size="sm" />
              {(clip.views / 1000).toFixed(1)}k views
            </span>
          </>
        )}

        {clip.engagement > 0 && (
          <>
            <span className="text-text-tertiary">•</span>
            <span className="inline-flex items-center gap-1 text-text-secondary">
              <Icon name="heart" size="sm" />
              {(clip.engagement / 1000).toFixed(1)}k engagement
            </span>
          </>
        )}
      </div>

      {/* Editor */}
      <ClipEditor
        clip={clip}
        onSave={(updated) => setClipData(updated)}
      />

      {/* Detail tabs */}
      <div className="space-y-4">
        <ClipTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <MotionDiv
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="rounded-xl border border-border-subtle bg-background-card p-6"
        >
          {activeTab === 'captions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">AI-Generated Captions</h3>
              <div className="rounded-lg bg-background-surface p-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  {clip.caption || 'No caption generated yet. Save the clip to generate captions.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="wand-2" size="sm" className="mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="copy" size="sm" className="mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'hashtags' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Suggested Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {(clip.hashtags || ['#gaming', '#clips', '#highlight']).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-accent-subtle border border-accent/20 px-3 py-1 text-xs font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="wand-2" size="sm" className="mr-2" />
                  Generate More
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="copy" size="sm" className="mr-2" />
                  Copy All
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'publishing' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Publishing Status</h3>
              <div className="space-y-3">
                {[
                  { platform: 'TikTok', icon: 'music', connected: true, status: clip.status === 'published' ? 'Published' : 'Ready' },
                  { platform: 'YouTube Shorts', icon: 'play-circle', connected: true, status: clip.status === 'published' ? 'Published' : 'Ready' },
                  { platform: 'Instagram Reels', icon: 'camera', connected: false, status: 'Not connected' },
                  { platform: 'Twitter/X', icon: 'send', connected: true, status: 'Draft' },
                ].map((p) => (
                  <div
                    key={p.platform}
                    className="flex items-center justify-between rounded-lg bg-background-surface px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={p.icon as any} size="sm" color="text-text-secondary" />
                      <span className="text-sm text-text-primary">{p.platform}</span>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        p.connected
                          ? p.status === 'Published'
                            ? 'bg-success-subtle text-success'
                            : 'bg-accent-subtle text-accent'
                          : 'bg-background-elevated text-text-tertiary',
                      )}
                    >
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Clip Analytics</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Views', value: clip.views > 0 ? `${(clip.views / 1000).toFixed(1)}k` : '—', icon: 'eye' },
                  { label: 'Engagement', value: clip.engagement > 0 ? `${(clip.engagement / 1000).toFixed(1)}k` : '—', icon: 'heart' },
                  { label: 'Watch Time', value: '85%', icon: 'clock' },
                  { label: 'Shares', value: '1.2k', icon: 'share-2' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-background-surface p-4 text-center">
                    <Icon name={stat.icon as any} size="sm" color="text-text-tertiary" className="mx-auto mb-1" />
                    <p className="text-lg font-semibold text-text-primary">{stat.value}</p>
                    <p className="text-2xs text-text-tertiary">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Placeholder chart */}
              <div className="rounded-lg bg-background-surface p-6 flex items-center justify-center h-32">
                <p className="text-sm text-text-tertiary">
                  Detailed analytics will appear here after publishing.
                </p>
              </div>
            </div>
          )}
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}
