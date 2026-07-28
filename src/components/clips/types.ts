// ── Clip Engine Types & Config ──

export type ClipFormat = 'vertical' | 'horizontal' | 'square';
export type ClipDuration = 15 | 30 | 60;
export type ClipStatus = 'queued' | 'rendering' | 'ready' | 'published' | 'archived';
export type MomentType =
  | 'funny'
  | 'clutch'
  | 'rage'
  | 'emotional'
  | 'fail'
  | 'victory'
  | 'donation'
  | 'chat_reaction';
export type Platform = 'twitch' | 'kick' | 'youtube' | 'tiktok' | 'upload';

export interface MockClip {
  id: string;
  title: string;
  sourceStreamId: string;
  sourceStreamName: string;
  thumbnailGradient: string;
  duration: ClipDuration;
  format: ClipFormat;
  momentType: MomentType;
  momentConfidence: number;
  momentTimestamp: string;
  aiReasoning: string;
  status: ClipStatus;
  views: number;
  engagement: number; // likes + shares
  caption?: string;
  hashtags?: string[];
  streamId?: string;
}

export interface MockMoment {
  id: string;
  streamId: string;
  streamTitle: string;
  momentType: MomentType;
  confidence: number;
  timestamp: string;
  durationSuggestion: ClipDuration;
  thumbnailGradient: string;
  aiReasoning: string;
  selected: boolean;
}

export interface GeneratePipelineStage {
  label: string;
  key: 'analyzing' | 'detecting' | 'generating' | 'rendering' | 'completed';
  description: string;
  progress: number;
}

// ── Moment Type Config ──

export const MOMENT_CONFIG: Record<
  MomentType,
  { label: string; color: string; icon: string; bgClass: string; badgeClass: string }
> = {
  funny: {
    label: 'Funny',
    color: '#F59E0B',
    icon: 'smile',
    bgClass: 'bg-[#F59E0B]/15',
    badgeClass: 'bg-[#F59E0B]/15 text-[#FCD34D] border-[#F59E0B]/30',
  },
  clutch: {
    label: 'Clutch',
    color: '#10B981',
    icon: 'zap',
    bgClass: 'bg-[#10B981]/15',
    badgeClass: 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/30',
  },
  rage: {
    label: 'Rage',
    color: '#EF4444',
    icon: 'flame',
    bgClass: 'bg-[#EF4444]/15',
    badgeClass: 'bg-[#EF4444]/15 text-[#FCA5A5] border-[#EF4444]/30',
  },
  emotional: {
    label: 'Emotional',
    color: '#EC4899',
    icon: 'heart',
    bgClass: 'bg-[#EC4899]/15',
    badgeClass: 'bg-[#EC4899]/15 text-[#F9A8D4] border-[#EC4899]/30',
  },
  fail: {
    label: 'Fail',
    color: '#F97316',
    icon: 'alert-triangle',
    bgClass: 'bg-[#F97316]/15',
    badgeClass: 'bg-[#F97316]/15 text-[#FDBA74] border-[#F97316]/30',
  },
  victory: {
    label: 'Victory',
    color: '#6C5CE7',
    icon: 'trophy',
    bgClass: 'bg-accent-subtle',
    badgeClass: 'bg-accent-subtle text-[#A78BFA] border-[#6C5CE7]/30',
  },
  donation: {
    label: 'Donation',
    color: '#06B6D4',
    icon: 'sparkles',
    bgClass: 'bg-[#06B6D4]/15',
    badgeClass: 'bg-[#06B6D4]/15 text-[#67E8F9] border-[#06B6D4]/30',
  },
  chat_reaction: {
    label: 'Chat Reaction',
    color: '#3B82F6',
    icon: 'message-circle',
    bgClass: 'bg-[#3B82F6]/15',
    badgeClass: 'bg-[#3B82F6]/15 text-[#93C5FD] border-[#3B82F6]/30',
  },
};

// ── Clip Status Config ──

export const CLIP_STATUS_CONFIG: Record<
  ClipStatus,
  { label: string; variant: 'accent' | 'warning' | 'success' | 'danger' | 'outline' | 'ghost' }
> = {
  queued: { label: 'Queued', variant: 'ghost' },
  rendering: { label: 'Rendering', variant: 'accent' },
  ready: { label: 'Ready', variant: 'success' },
  published: { label: 'Published', variant: 'outline' },
  archived: { label: 'Archived', variant: 'ghost' },
};

// ── Format Config ──

export const FORMAT_CONFIG: Record<
  ClipFormat,
  { label: string; aspectRatio: string; icon: string; shortLabel: string }
> = {
  vertical: {
    label: 'Vertical (9:16)',
    aspectRatio: 'aspect-[9/16]',
    icon: 'maximize-2',
    shortLabel: '9:16',
  },
  horizontal: {
    label: 'Horizontal (16:9)',
    aspectRatio: 'aspect-video',
    icon: 'minimize-2',
    shortLabel: '16:9',
  },
  square: {
    label: 'Square (1:1)',
    aspectRatio: 'aspect-square',
    icon: 'grid',
    shortLabel: '1:1',
  },
};

// ── Duration Config ──

export const DURATION_OPTIONS: { value: 15 | 30 | 60; label: string }[] = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
];

// ── Generate Pipeline Config ──

export const GENERATE_STAGES: GeneratePipelineStage[] = [
  { label: 'Analyzing Stream', key: 'analyzing', description: 'Scanning audio and chat for peak moments', progress: 0 },
  { label: 'Detecting Moments', key: 'detecting', description: 'Identifying viral-worthy highlights', progress: 0 },
  { label: 'Generating Clips', key: 'generating', description: 'Creating short-form clips with captions', progress: 0 },
  { label: 'Rendering', key: 'rendering', description: 'Encoding final video formats', progress: 0 },
  { label: 'Completed', key: 'completed', description: 'Clips ready for review', progress: 0 },
];
