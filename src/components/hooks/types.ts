// ── Hook Generator Types & Config ──

export type HookPlatform = 'tiktok' | 'youtube' | 'instagram' | 'twitter' | 'linkedin';
export type HookTone = 'professional' | 'casual' | 'humorous' | 'edgy' | 'inspirational';
export type HookType = 'curiosity_gap' | 'question' | 'bold_statement' | 'controversial' | 'emotional';

export interface HookTitleVariation {
  id: string;
  text: string;
  platform: HookPlatform;
  score: number; // 0-100 predicted engagement
  impressions: number; // predicted
}

export interface HookVariation {
  id: string;
  text: string;
  type: HookType;
  platform: HookPlatform;
  predictedRetention: number; // percentage
}

export interface HookDescription {
  id: string;
  text: string;
  length: 'short' | 'medium' | 'long';
}

export interface HookHashtag {
  text: string;
  category: 'trending' | 'niche' | 'broad';
  volume: 'high' | 'medium' | 'low';
}

export interface HookSEOKeyword {
  keyword: string;
  searchVolume: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
}

export interface HookGenerationResult {
  id: string;
  clipId: string;
  clipTitle: string;
  titles: HookTitleVariation[];
  hooks: HookVariation[];
  descriptions: HookDescription[];
  hashtags: HookHashtag[];
  seoKeywords: HookSEOKeyword[];
  generatedAt: string;
}

// ── Configs ──

export const HOOK_PLATFORM_CONFIG: Record<HookPlatform, { label: string; icon: string; color: string }> = {
  tiktok: { label: 'TikTok', icon: 'music', color: '#FF0050' },
  youtube: { label: 'YouTube', icon: 'play-circle', color: '#FF0000' },
  instagram: { label: 'Instagram', icon: 'camera', color: '#E1306C' },
  twitter: { label: 'Twitter/X', icon: 'send', color: '#1DA1F2' },
  linkedin: { label: 'LinkedIn', icon: 'link', color: '#0A66C2' },
};

export const HOOK_TONE_CONFIG: Record<HookTone, { label: string; description: string; icon: string }> = {
  professional: { label: 'Professional', description: 'Polished and authoritative', icon: 'briefcase' },
  casual: { label: 'Casual', description: 'Relaxed and conversational', icon: 'coffee' },
  humorous: { label: 'Humorous', description: 'Funny and entertaining', icon: 'smile' },
  edgy: { label: 'Edgy', description: 'Bold and provocative', icon: 'flame' },
  inspirational: { label: 'Inspirational', description: 'Motivating and uplifting', icon: 'trophy' },
};

export const HOOK_TYPE_CONFIG: Record<HookType, { label: string; color: string; bgClass: string }> = {
  curiosity_gap: {
    label: 'Curiosity Gap',
    color: '#6C5CE7',
    bgClass: 'bg-[#6C5CE7]/15 text-[#A78BFA] border-[#6C5CE7]/30',
  },
  question: {
    label: 'Question',
    color: '#3B82F6',
    bgClass: 'bg-[#3B82F6]/15 text-[#93C5FD] border-[#3B82F6]/30',
  },
  bold_statement: {
    label: 'Bold Statement',
    color: '#F59E0B',
    bgClass: 'bg-[#F59E0B]/15 text-[#FCD34D] border-[#F59E0B]/30',
  },
  controversial: {
    label: 'Controversial',
    color: '#EF4444',
    bgClass: 'bg-[#EF4444]/15 text-[#FCA5A5] border-[#EF4444]/30',
  },
  emotional: {
    label: 'Emotional',
    color: '#EC4899',
    bgClass: 'bg-[#EC4899]/15 text-[#F9A8D4] border-[#EC4899]/30',
  },
};

export const PLATFORM_OPTIONS: HookPlatform[] = ['tiktok', 'youtube', 'instagram', 'twitter', 'linkedin'];
export const TONE_OPTIONS: HookTone[] = ['professional', 'casual', 'humorous', 'edgy', 'inspirational'];
