// Shared types for stream components (mock data only — no API schema)

export type Platform = 'twitch' | 'kick' | 'youtube' | 'tiktok' | 'upload';

export type StreamStatus =
  | 'importing'
  | 'transcribing'
  | 'analyzing'
  | 'generating_clips'
  | 'completed'
  | 'failed';

export interface MockStream {
  id: string;
  title: string;
  platform: Platform;
  duration: string; // e.g. "2h 34m"
  importDate: string;
  status: StreamStatus;
  progress: number; // 0–100
  thumbnailGradient: string; // CSS gradient for placeholder
  views?: number;
  peakViewers?: number;
  chatMessages?: number;
  aiSummary?: string;
}

export interface PlatformConnection {
  platform: Platform;
  connected: boolean;
  accountName?: string;
  accountAvatar?: string;
  handle?: string;
}

export interface ProcessingStage {
  label: string;
  key: StreamStatus;
  description: string;
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; iconBgClass: string; badgeClass: string }
> = {
  twitch: {
    label: 'Twitch',
    color: '#9146FF',
    iconBgClass: 'bg-[#9146FF]/15',
    badgeClass: 'bg-[#9146FF]/15 text-[#C49EFF] border-[#9146FF]/30',
  },
  kick: {
    label: 'Kick',
    color: '#53FC18',
    iconBgClass: 'bg-[#53FC18]/15',
    badgeClass: 'bg-[#53FC18]/15 text-[#53FC18] border-[#53FC18]/30',
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    iconBgClass: 'bg-[#FF0000]/15',
    badgeClass: 'bg-[#FF0000]/15 text-[#FF6B6B] border-[#FF0000]/30',
  },
  tiktok: {
    label: 'TikTok',
    color: '#000000',
    iconBgClass: 'bg-white/10',
    badgeClass: 'bg-white/10 text-[#CCCCCC] border-white/20',
  },
  upload: {
    label: 'Upload',
    color: '#6B7280',
    iconBgClass: 'bg-[#6B7280]/15',
    badgeClass: 'bg-[#6B7280]/15 text-[#9CA3AF] border-[#6B7280]/30',
  },
};

export const STATUS_CONFIG: Record<
  StreamStatus,
  { label: string; variant: 'accent' | 'warning' | 'success' | 'danger' }
> = {
  importing: { label: 'Importing', variant: 'accent' },
  transcribing: { label: 'Transcribing', variant: 'accent' },
  analyzing: { label: 'Analyzing', variant: 'accent' },
  generating_clips: { label: 'Generating Clips', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
};

export const PROCESSING_STAGES: ProcessingStage[] = [
  { label: 'Importing', key: 'importing', description: 'Downloading stream from platform' },
  { label: 'Transcribing', key: 'transcribing', description: 'Converting speech to text' },
  { label: 'Analyzing', key: 'analyzing', description: 'Detecting viral moments and highlights' },
  {
    label: 'Generating Clips',
    key: 'generating_clips',
    description: 'Creating short-form content with captions',
  },
  { label: 'Completed', key: 'completed', description: 'Ready for review and publishing' },
];
