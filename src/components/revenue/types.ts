// ── Revenue Types ──

export type RevenueSource =
  | 'twitch_subs'
  | 'twitch_bits'
  | 'twitch_ads'
  | 'kick_subs'
  | 'kick_donations'
  | 'youtube_superchat'
  | 'youtube_memberships'
  | 'youtube_ads'
  | 'tiktok_gifts'
  | 'tiktok_creator_fund'
  | 'merch'
  | 'donations'
  | 'affiliate'
  | 'sponsorship';

export type RevenueSourceCategory = 'twitch' | 'kick' | 'youtube' | 'tiktok' | 'merch' | 'donations' | 'affiliate' | 'sponsorship';

export interface RevenueSourceCard {
  source: RevenueSource;
  label: string;
  category: RevenueSourceCategory;
  icon: string;
  amount: number;
  trend: number;
  color: string;
}

export interface RevenueOverTime {
  month: string;
  twitch: number;
  kick: number;
  youtube: number;
  tiktok: number;
  merch: number;
  donations: number;
  affiliate: number;
  sponsorship: number;
}

export interface MonthlyComparison {
  month: string;
  thisYear: number;
  lastYear: number;
}

export interface Transaction {
  id: string;
  date: string;
  source: RevenueSource;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  currency: string;
}

export const REVENUE_SOURCE_CONFIG: Record<RevenueSource, { label: string; category: RevenueSourceCategory; icon: string; color: string }> = {
  twitch_subs: { label: 'Subscriptions', category: 'twitch', icon: 'star', color: '#9146FF' },
  twitch_bits: { label: 'Bits', category: 'twitch', icon: 'zap', color: '#9146FF' },
  twitch_ads: { label: 'Ads', category: 'twitch', icon: 'play-circle', color: '#9146FF' },
  kick_subs: { label: 'Subscriptions', category: 'kick', icon: 'star', color: '#53FC18' },
  kick_donations: { label: 'Donations', category: 'kick', icon: 'heart', color: '#53FC18' },
  youtube_superchat: { label: 'Super Chat', category: 'youtube', icon: 'message-square', color: '#EF4444' },
  youtube_memberships: { label: 'Memberships', category: 'youtube', icon: 'users', color: '#EF4444' },
  youtube_ads: { label: 'Ad Revenue', category: 'youtube', icon: 'play-circle', color: '#EF4444' },
  tiktok_gifts: { label: 'Gifts', category: 'tiktok', icon: 'sparkles', color: '#FF0050' },
  tiktok_creator_fund: { label: 'Creator Fund', category: 'tiktok', icon: 'dollar-sign', color: '#FF0050' },
  merch: { label: 'Store Sales', category: 'merch', icon: 'shopping-cart', color: '#F59E0B' },
  donations: { label: 'Direct Tips', category: 'donations', icon: 'heart', color: '#10B981' },
  affiliate: { label: 'Commission', category: 'affiliate', icon: 'link', color: '#3B82F6' },
  sponsorship: { label: 'Campaigns', category: 'sponsorship', icon: 'credit-card', color: '#6C5CE7' },
};

export const CATEGORY_COLORS: Record<RevenueSourceCategory, string> = {
  twitch: '#9146FF',
  kick: '#53FC18',
  youtube: '#EF4444',
  tiktok: '#FF0050',
  merch: '#F59E0B',
  donations: '#10B981',
  affiliate: '#3B82F6',
  sponsorship: '#6C5CE7',
};
