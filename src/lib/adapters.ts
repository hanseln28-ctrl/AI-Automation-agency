// ── Adapters: API Types → Component Mock Types ──
// These map the real API/Prisma shapes to the shapes the existing UI components expect.
// Once all components are refactored to use API types directly, these can be removed.

import type { StreamSummary, ClipSummary } from '@/lib/types/api';
import type { MockStream, Platform, StreamStatus } from '@/components/streams/types';
import type { MockClip, ClipFormat, ClipStatus, MomentType } from '@/components/clips/types';

// ── Platform Gradients ──

const PLATFORM_GRADIENTS: Record<string, string> = {
  twitch: 'from-[#9146FF] via-[#6C5CE7] to-[#0A0A0F]',
  kick: 'from-[#53FC18] via-[#3AAD12] to-[#0A0A0F]',
  youtube: 'from-[#FF0000] via-[#CC0000] to-[#0A0A0F]',
  tiktok: 'from-[#333333] via-[#1A1A1A] to-[#0A0A0F]',
  manual_upload: 'from-[#6B7280] via-[#4B5563] to-[#0A0A0F]',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  clutch: 'from-[#9146FF] via-[#6C5CE7] to-[#0A0A0F]',
  funny: 'from-[#EF4444] via-[#F97316] to-[#0A0A0F]',
  rage: 'from-[#EF4444] via-[#6C5CE7] to-[#0A0A0F]',
  emotional: 'from-[#EC4899] via-[#F97316] to-[#0A0A0F]',
  fail: 'from-[#F97316] via-[#EF4444] to-[#0A0A0F]',
  victory: 'from-[#6C5CE7] via-[#EC4899] to-[#0A0A0F]',
  donation: 'from-[#06B6D4] via-[#3B82F6] to-[#0A0A0F]',
  chat_reaction: 'from-[#3B82F6] via-[#6C5CE7] to-[#0A0A0F]',
  highlight: 'from-[#9146FF] via-[#6C5CE7] to-[#0A0A0F]',
};

// ── Helpers ──

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return dateStr.slice(0, 10); // "2026-07-21T..." → "2026-07-21"
}

function formatTimestamp(offsetSeconds: number): string {
  const h = Math.floor(offsetSeconds / 3600);
  const m = Math.floor((offsetSeconds % 3600) / 60);
  const s = offsetSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function parseAiMetadata(metadata: unknown): Record<string, unknown> {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

function mapSourceToPlatform(source: string): Platform {
  const map: Record<string, Platform> = {
    twitch: 'twitch',
    kick: 'kick',
    youtube: 'youtube',
    tiktok: 'tiktok',
    manual_upload: 'upload',
  };
  return map[source] || 'upload';
}

function mapStreamStatus(status: string): StreamStatus {
  const valid: StreamStatus[] = [
    'importing',
    'transcribing',
    'analyzing',
    'generating_clips',
    'completed',
    'failed',
  ];
  return valid.includes(status as StreamStatus) ? (status as StreamStatus) : 'importing';
}

function mapClipStatus(status: string): ClipStatus {
  const valid: ClipStatus[] = ['queued', 'rendering', 'ready', 'published', 'archived'];
  // Map API statuses to clip statuses
  const map: Record<string, ClipStatus> = {
    queued: 'queued',
    rendering: 'rendering',
    rendered: 'ready',
    reviewing: 'ready',
    approved: 'ready',
    published: 'published',
    failed: 'queued',
    archived: 'archived',
  };
  return map[status] || 'queued';
}

function mapCategoryToMomentType(category: string | null | undefined): MomentType {
  const valid: MomentType[] = [
    'funny',
    'clutch',
    'rage',
    'emotional',
    'fail',
    'victory',
    'donation',
    'chat_reaction',
  ];
  if (category && valid.includes(category as MomentType)) {
    return category as MomentType;
  }
  return 'chat_reaction';
}

function mapCategoryToClipFormat(category: string | null | undefined): ClipFormat {
  // Most clips should be vertical by default
  return 'vertical';
}

// ── Adapters ──

export function streamToMock(api: StreamSummary): MockStream {
  const meta = parseAiMetadata(api.aiMetadata);

  return {
    id: api.id,
    title: api.title || 'Untitled Stream',
    platform: mapSourceToPlatform(api.source),
    duration: formatDuration(api.durationSeconds),
    importDate: formatDate(api.createdAt),
    status: mapStreamStatus(api.status),
    progress: api.progressPct ?? 0,
    thumbnailGradient:
      PLATFORM_GRADIENTS[api.source] || PLATFORM_GRADIENTS.manual_upload,
    views: typeof api.totalViews === 'bigint' ? Number(api.totalViews) : (api.totalViews as number),
    peakViewers: (meta.peakViewers as number) ?? undefined,
    chatMessages: (meta.chatMessages as number) ?? undefined,
    aiSummary: (meta.summary as string) ?? undefined,
  };
}

export function clipToMock(api: ClipSummary): MockClip {
  const meta = parseAiMetadata(api.aiMetadata);
  const category = api.category || 'highlight';

  return {
    id: api.id,
    title: api.title || 'Untitled Clip',
    sourceStreamId: api.streamId,
    sourceStreamName: api.stream?.title || 'Unknown Stream',
    thumbnailGradient: CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.highlight,
    duration: Math.min(Math.max(api.endOffset - api.startOffset, 15), 60) as 15 | 30 | 60,
    format: mapCategoryToClipFormat(api.category),
    momentType: mapCategoryToMomentType(api.category),
    momentConfidence: Math.round((api.aiScore ?? 0) * 100),
    momentTimestamp: formatTimestamp(api.startOffset),
    aiReasoning: (meta.reasoning as string) || 'AI analysis pending',
    status: mapClipStatus(api.status),
    views: typeof api.totalViews === 'bigint' ? Number(api.totalViews) : (api.totalViews as number),
    engagement: typeof api.totalLikes === 'bigint' ? Number(api.totalLikes) : (api.totalLikes as number),
    caption: (meta.caption as string) ?? undefined,
    hashtags: api.tags?.map((t) => (t.startsWith('#') ? t : `#${t}`)) || [],
  };
}
