import type {
  AnalyticsKPI,
  ViewsOverTime,
  TopClip,
  PlatformPerformance,
  ContentTypeData,
  BestPostingTime,
  FollowerGrowth,
  Demographic,
  Geography,
  PlatformDetail,
} from './types';

// ── KPI Data ──

export const MOCK_KPIS: AnalyticsKPI[] = [
  {
    label: 'Total Views',
    value: '2,847,391',
    trend: 14.3,
    trendLabel: 'vs last period',
    icon: 'eye',
    variant: 'default',
  },
  {
    label: 'Watch Time',
    value: '48,320 hrs',
    trend: 8.7,
    trendLabel: 'vs last period',
    icon: 'clock',
    variant: 'success',
  },
  {
    label: 'CTR',
    value: '4.8%',
    trend: -0.3,
    trendLabel: 'vs last period',
    icon: 'target',
    variant: 'warning',
  },
  {
    label: 'Engagement Rate',
    value: '6.2%',
    trend: 1.1,
    trendLabel: 'vs last period',
    icon: 'heart',
    variant: 'success',
  },
  {
    label: 'Followers Gained',
    value: '12,483',
    trend: 22.4,
    trendLabel: 'this month',
    icon: 'users',
    variant: 'success',
  },
  {
    label: 'Growth %',
    value: '18.5%',
    trend: 18.5,
    trendLabel: 'monthly',
    icon: 'trending-up',
    variant: 'default',
  },
];

// ── Views Over Time (30 data points) ──

export const MOCK_VIEWS_OVER_TIME: ViewsOverTime[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const baseViews = 80000 + Math.floor(Math.random() * 40000);
  const baseWatchTime = 1200 + Math.floor(Math.random() * 800);
  const weekendBoost = day % 7 === 0 || day % 7 === 6 ? 1.3 : 1;
  return {
    date: `Jul ${day}`,
    views: Math.floor(baseViews * weekendBoost),
    watchTime: Math.floor(baseWatchTime * weekendBoost),
  };
});

// ── Top Performing Clips ──

export const MOCK_TOP_CLIPS: TopClip[] = [
  {
    id: '1',
    title: 'INSANE 1v5 Clutch in Finals',
    thumbnail: '',
    views: 342000,
    engagement: 28500,
    platform: 'tiktok',
    gradient: 'from-[#6C5CE7] to-[#8B7CF7]',
  },
  {
    id: '2',
    title: 'When Chat Predicts My Death...',
    thumbnail: '',
    views: 287000,
    engagement: 22300,
    platform: 'youtube',
    gradient: 'from-[#EF4444] to-[#F97316]',
  },
  {
    id: '3',
    title: 'Best Donation Reaction Ever',
    thumbnail: '',
    views: 234000,
    engagement: 19800,
    platform: 'instagram',
    gradient: 'from-[#10B981] to-[#06B6D4]',
  },
  {
    id: '4',
    title: 'Speedrun WR by 0.01 seconds',
    thumbnail: '',
    views: 189000,
    engagement: 15400,
    platform: 'twitch',
    gradient: 'from-[#9146FF] to-[#6C5CE7]',
  },
  {
    id: '5',
    title: 'Funniest Rage Compilation',
    thumbnail: '',
    views: 156000,
    engagement: 12100,
    platform: 'kick',
    gradient: 'from-[#53FC18] to-[#10B981]',
  },
  {
    id: '6',
    title: 'Pro Player Reacts to My Plays',
    thumbnail: '',
    views: 142000,
    engagement: 9800,
    platform: 'tiktok',
    gradient: 'from-[#FF0050] to-[#EF4444]',
  },
  {
    id: '7',
    title: 'Emotional Farewell Stream',
    thumbnail: '',
    views: 128000,
    engagement: 8700,
    platform: 'youtube',
    gradient: 'from-[#EC4899] to-[#6C5CE7]',
  },
  {
    id: '8',
    title: 'Chat Makes Me Lose It',
    thumbnail: '',
    views: 115000,
    engagement: 7600,
    platform: 'instagram',
    gradient: 'from-[#F59E0B] to-[#EF4444]',
  },
];

// ── Platform Performance ──

export const MOCK_PLATFORM_PERFORMANCE: PlatformPerformance[] = [
  { platform: 'tiktok', views: 1240000, engagement: 98000, followers: 450000, color: '#FF0050' },
  { platform: 'youtube', views: 890000, engagement: 72000, followers: 320000, color: '#EF4444' },
  { platform: 'instagram', views: 320000, engagement: 45000, followers: 210000, color: '#EC4899' },
  { platform: 'twitch', views: 280000, engagement: 38000, followers: 180000, color: '#9146FF' },
  { platform: 'kick', views: 117000, engagement: 14200, followers: 65000, color: '#53FC18' },
];

// ── Content Type Breakdown ──

export const MOCK_CONTENT_TYPES: ContentTypeData[] = [
  { type: 'Gaming Clips', percentage: 45, color: '#6C5CE7', icon: 'gamepad' },
  { type: 'Reactions', percentage: 20, color: '#10B981', icon: 'smile' },
  { type: 'Tutorials', percentage: 15, color: '#F59E0B', icon: 'lightbulb' },
  { type: 'Highlights', percentage: 12, color: '#EF4444', icon: 'trophy' },
  { type: 'Behind Scenes', percentage: 8, color: '#3B82F6', icon: 'camera' },
];

// ── Best Posting Times (7×24 heatmap) ──

export const MOCK_BEST_POSTING_TIMES: BestPostingTime[] = [];
for (let day = 0; day < 7; day++) {
  for (let hour = 0; hour < 24; hour++) {
    // Engagement peaks: evenings (17-22), lower early morning (2-6)
    let baseValue = 30;
    if (hour >= 17 && hour <= 22) baseValue = 70;
    else if (hour >= 12 && hour <= 16) baseValue = 55;
    else if (hour >= 23 || hour <= 1) baseValue = 15;
    else if (hour >= 2 && hour <= 6) baseValue = 5;

    // Weekend boost
    if (day === 5 || day === 6) baseValue += 15;

    // Add jitter
    const jitter = Math.floor(Math.random() * 20) - 10;
    MOCK_BEST_POSTING_TIMES.push({
      day,
      hour,
      value: Math.max(0, Math.min(100, baseValue + jitter)),
    });
  }
}

// ── Follower Growth ──

export const MOCK_FOLLOWER_GROWTH: FollowerGrowth[] = Array.from({ length: 30 }, (_, i) => ({
  date: `Jul ${i + 1}`,
  followers: 120000 + i * 380 + Math.floor(Math.random() * 200),
}));

// ── Demographics ──

export const MOCK_DEMOGRAPHICS: Demographic[] = [
  { ageGroup: '13-17', male: 12, female: 8, other: 2 },
  { ageGroup: '18-24', male: 28, female: 15, other: 5 },
  { ageGroup: '25-34', male: 18, female: 6, other: 3 },
  { ageGroup: '35-44', male: 4, female: 2, other: 1 },
  { ageGroup: '45+', male: 1, female: 1, other: 0 },
];

// ── Geography ──

export const MOCK_GEOGRAPHY: Geography[] = [
  { country: 'United States', code: 'US', percentage: 42 },
  { country: 'United Kingdom', code: 'GB', percentage: 12 },
  { country: 'Germany', code: 'DE', percentage: 8 },
  { country: 'Canada', code: 'CA', percentage: 7 },
  { country: 'Brazil', code: 'BR', percentage: 6 },
  { country: 'France', code: 'FR', percentage: 5 },
  { country: 'Australia', code: 'AU', percentage: 4 },
  { country: 'Japan', code: 'JP', percentage: 3 },
  { country: 'Other', code: 'OTHER', percentage: 13 },
];

// ── Platform Details ──

export const MOCK_PLATFORM_DETAILS: PlatformDetail[] = [
  {
    platform: 'tiktok',
    label: 'TikTok',
    icon: 'music',
    color: '#FF0050',
    followers: 450000,
    views: 1240000,
    engagement: 98000,
    topClip: MOCK_TOP_CLIPS[0]!,
  },
  {
    platform: 'youtube',
    label: 'YouTube',
    icon: 'play-circle',
    color: '#EF4444',
    followers: 320000,
    views: 890000,
    engagement: 72000,
    topClip: MOCK_TOP_CLIPS[1]!,
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    icon: 'camera',
    color: '#EC4899',
    followers: 210000,
    views: 320000,
    engagement: 45000,
    topClip: MOCK_TOP_CLIPS[2]!,
  },
  {
    platform: 'twitch',
    label: 'Twitch',
    icon: 'tv-2',
    color: '#9146FF',
    followers: 180000,
    views: 280000,
    engagement: 38000,
    topClip: MOCK_TOP_CLIPS[3]!,
  },
  {
    platform: 'kick',
    label: 'Kick',
    icon: 'zap',
    color: '#53FC18',
    followers: 65000,
    views: 117000,
    engagement: 14200,
    topClip: MOCK_TOP_CLIPS[4]!,
  },
];
