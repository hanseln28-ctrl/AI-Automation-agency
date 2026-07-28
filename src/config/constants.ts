// IRON Creator OS — Application configuration constants

export const APP_CONFIG = {
  name: 'IRON Creator OS',
  description: 'AI-Powered Content Engine for Livestream Creators',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

export const TIER_LIMITS = {
  free: {
    clipsPerMonth: 5,
    platforms: 1,
    analyticsDays: 7,
    captionStyles: ['kinetic'],
    hookVariants: 1,
  },
  starter: {
    clipsPerMonth: 50,
    platforms: 3,
    analyticsDays: 7,
    captionStyles: ['kinetic', 'minimal', 'bold'],
    hookVariants: 2,
  },
  pro: {
    clipsPerMonth: 200,
    platforms: Infinity,
    analyticsDays: 90,
    captionStyles: ['kinetic', 'minimal', 'bold', 'emoji'],
    hookVariants: 3,
  },
  agency: {
    clipsPerMonth: 500,
    platforms: Infinity,
    analyticsDays: Infinity,
    captionStyles: ['kinetic', 'minimal', 'bold', 'emoji', 'custom'],
    hookVariants: 5,
  },
  enterprise: {
    clipsPerMonth: Infinity,
    platforms: Infinity,
    analyticsDays: Infinity,
    captionStyles: ['kinetic', 'minimal', 'bold', 'emoji', 'custom'],
    hookVariants: Infinity,
  },
} as const;

export const SUPPORTED_PLATFORMS = ['twitch', 'kick', 'youtube', 'tiktok'] as const;

export const CLIP_CATEGORIES = [
  'highlight',
  'funny',
  'clutch',
  'rage',
  'educational',
  'wholesome',
  'fails',
] as const;

export const DEFAULT_CLIP_DURATION_RANGE = [30, 60] as [number, number];
