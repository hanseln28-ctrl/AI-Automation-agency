// ── Analytics Types ──

export type DateRange = '7d' | '30d' | '90d' | 'custom';
export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitch' | 'kick';

export interface AnalyticsKPI {
  label: string;
  value: string | number;
  trend: number;
  trendLabel: string;
  icon: string;
  variant: 'default' | 'success' | 'warning' | 'danger';
}

export interface ViewsOverTime {
  date: string;
  views: number;
  watchTime: number;
}

export interface TopClip {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  engagement: number;
  platform: Platform;
  gradient: string;
}

export interface PlatformPerformance {
  platform: Platform;
  views: number;
  engagement: number;
  followers: number;
  color: string;
}

export interface ContentTypeData {
  type: string;
  percentage: number;
  color: string;
  icon: string;
}

export interface BestPostingTime {
  day: number;
  hour: number;
  value: number;
}

export interface FollowerGrowth {
  date: string;
  followers: number;
}

export interface Demographic {
  ageGroup: string;
  male: number;
  female: number;
  other: number;
}

export interface Geography {
  country: string;
  code: string;
  percentage: number;
}

export interface PlatformDetail {
  platform: Platform;
  label: string;
  icon: string;
  color: string;
  followers: number;
  views: number;
  engagement: number;
  topClip: TopClip;
}
