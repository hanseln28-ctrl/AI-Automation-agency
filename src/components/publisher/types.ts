// ── Publisher Platform Types ──
export type PublisherPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube_shorts'
  | 'facebook'
  | 'threads'
  | 'x'
  | 'linkedin'
  | 'discord';

export type PostStatus = 'scheduled' | 'draft' | 'published' | 'failed' | 'posting';

export interface PostPlatformSettings {
  // TikTok
  allowComments?: boolean;
  allowDuet?: boolean;
  allowStitch?: boolean;
  // YouTube
  category?: string;
  playlist?: string;
  madeForKids?: boolean;
  // Instagram
  shareToFeed?: boolean;
  postToReels?: boolean;
  // X/Twitter
  threadMode?: boolean;
}

export interface PostPlatformEntry {
  platform: PublisherPlatform;
  caption: string;
  hashtags: string[];
  settings: PostPlatformSettings;
}

export interface MockPost {
  id: string;
  clipId: string;
  clipTitle: string;
  thumbnailGradient: string;
  platforms: PublisherPlatform[];
  platformEntries: PostPlatformEntry[];
  primaryCaption: string;
  scheduledTime: string; // ISO string
  status: PostStatus;
  createdAt: string;
  errorMessage?: string;
  retryCount?: number;
}

// ── Platform Config ──
export interface PlatformConfig {
  label: string;
  color: string;
  icon: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  charLimit: number;
}

export const PUBLISHER_PLATFORM_CONFIG: Record<PublisherPlatform, PlatformConfig> = {
  tiktok: {
    label: 'TikTok',
    color: '#000000',
    icon: 'music',
    bgClass: 'bg-[#000000]/20',
    borderClass: 'border-[#FFFFFF]/20',
    textClass: 'text-[#FFFFFF]',
    charLimit: 2200,
  },
  instagram: {
    label: 'Instagram',
    color: '#E4405F',
    icon: 'camera',
    bgClass: 'bg-[#E4405F]/15',
    borderClass: 'border-[#E4405F]/30',
    textClass: 'text-[#E4405F]',
    charLimit: 2200,
  },
  youtube_shorts: {
    label: 'YouTube Shorts',
    color: '#FF0000',
    icon: 'play-circle',
    bgClass: 'bg-[#FF0000]/15',
    borderClass: 'border-[#FF0000]/30',
    textClass: 'text-[#FF0000]',
    charLimit: 5000,
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    icon: 'users',
    bgClass: 'bg-[#1877F2]/15',
    borderClass: 'border-[#1877F2]/30',
    textClass: 'text-[#1877F2]',
    charLimit: 63206,
  },
  threads: {
    label: 'Threads',
    color: '#000000',
    icon: 'message-square',
    bgClass: 'bg-[#000000]/20',
    borderClass: 'border-[#FFFFFF]/20',
    textClass: 'text-[#FFFFFF]',
    charLimit: 500,
  },
  x: {
    label: 'X',
    color: '#1DA1F2',
    icon: 'share-2',
    bgClass: 'bg-[#1DA1F2]/15',
    borderClass: 'border-[#1DA1F2]/30',
    textClass: 'text-[#1DA1F2]',
    charLimit: 280,
  },
  linkedin: {
    label: 'LinkedIn',
    color: '#0A66C2',
    icon: 'link',
    bgClass: 'bg-[#0A66C2]/15',
    borderClass: 'border-[#0A66C2]/30',
    textClass: 'text-[#0A66C2]',
    charLimit: 3000,
  },
  discord: {
    label: 'Discord',
    color: '#5865F2',
    icon: 'message-circle',
    bgClass: 'bg-[#5865F2]/15',
    borderClass: 'border-[#5865F2]/30',
    textClass: 'text-[#5865F2]',
    charLimit: 2000,
  },
};

// ── Post Status Config ──
export const POST_STATUS_CONFIG: Record<
  PostStatus,
  { label: string; variant: 'accent' | 'warning' | 'success' | 'danger' | 'outline' | 'ghost' }
> = {
  scheduled: { label: 'Scheduled', variant: 'accent' },
  draft: { label: 'Draft', variant: 'ghost' },
  published: { label: 'Published', variant: 'success' },
  failed: { label: 'Failed', variant: 'danger' },
  posting: { label: 'Posting...', variant: 'warning' },
};

// ── YouTube Categories ──
export const YOUTUBE_CATEGORIES = [
  'Gaming',
  'Entertainment',
  'Music',
  'Sports',
  'Education',
  'Science & Technology',
  'People & Blogs',
  'Comedy',
  'Film & Animation',
  'Howto & Style',
];

// ── Suggested Hashtags ──
export const SUGGESTED_HASHTAGS = [
  '#gaming', '#streamer', '#twitch', '#youtube', '#tiktok',
  '#creator', '#contentcreator', '#viral', '#fyp', '#foryou',
  '#gamingcommunity', '#streaming', '#livestream', '#gamer',
  '#esports', '#gameplay', '#highlights', '#funny', '#clutch',
];
