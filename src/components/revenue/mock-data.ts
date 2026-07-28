import type {
  RevenueSourceCard,
  RevenueOverTime,
  MonthlyComparison,
  Transaction,
} from './types';
import { REVENUE_SOURCE_CONFIG } from './types';

// ── Revenue Source Cards ──

export const MOCK_REVENUE_SOURCES: RevenueSourceCard[] = [
  { source: 'twitch_subs', label: 'Twitch Subs', category: 'twitch', icon: 'star', amount: 2840, trend: 12.3, color: '#9146FF' },
  { source: 'twitch_bits', label: 'Twitch Bits', category: 'twitch', icon: 'zap', amount: 450, trend: 5.1, color: '#9146FF' },
  { source: 'twitch_ads', label: 'Twitch Ads', category: 'twitch', icon: 'play-circle', amount: 1280, trend: 8.7, color: '#9146FF' },
  { source: 'kick_subs', label: 'Kick Subs', category: 'kick', icon: 'star', amount: 620, trend: 18.2, color: '#53FC18' },
  { source: 'kick_donations', label: 'Kick Donations', category: 'kick', icon: 'heart', amount: 340, trend: -2.5, color: '#53FC18' },
  { source: 'youtube_superchat', label: 'Super Chat', category: 'youtube', icon: 'message-square', amount: 890, trend: 15.3, color: '#EF4444' },
  { source: 'youtube_memberships', label: 'Memberships', category: 'youtube', icon: 'users', amount: 1560, trend: 10.1, color: '#EF4444' },
  { source: 'youtube_ads', label: 'Ad Revenue', category: 'youtube', icon: 'play-circle', amount: 2340, trend: 6.8, color: '#EF4444' },
  { source: 'tiktok_gifts', label: 'TikTok Gifts', category: 'tiktok', icon: 'sparkles', amount: 320, trend: 25.4, color: '#FF0050' },
  { source: 'tiktok_creator_fund', label: 'Creator Fund', category: 'tiktok', icon: 'dollar-sign', amount: 580, trend: -1.8, color: '#FF0050' },
  { source: 'merch', label: 'Store Sales', category: 'merch', icon: 'shopping-cart', amount: 1750, trend: 22.0, color: '#F59E0B' },
  { source: 'donations', label: 'Direct Tips', category: 'donations', icon: 'heart', amount: 480, trend: -4.2, color: '#10B981' },
  { source: 'affiliate', label: 'Commission', category: 'affiliate', icon: 'link', amount: 920, trend: 7.5, color: '#3B82F6' },
  { source: 'sponsorship', label: 'Campaigns', category: 'sponsorship', icon: 'briefcase', amount: 4250, trend: 32.1, color: '#6C5CE7' },
];

// ── Total Revenue (all sources) ──

export const MOCK_TOTAL_REVENUE = MOCK_REVENUE_SOURCES.reduce((sum, s) => sum + s.amount, 0);

// ── Revenue Over Time (12 months) ──

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MOCK_REVENUE_OVER_TIME: RevenueOverTime[] = MONTHS.map((month, i) => ({
  month,
  twitch: 3000 + i * 200 + Math.floor(Math.random() * 500),
  kick: 400 + i * 80 + Math.floor(Math.random() * 150),
  youtube: 2500 + i * 300 + Math.floor(Math.random() * 400),
  tiktok: 300 + i * 100 + Math.floor(Math.random() * 200),
  merch: 800 + i * 100 + Math.floor(Math.random() * 300),
  donations: 300 + Math.floor(Math.random() * 200),
  affiliate: 400 + i * 60 + Math.floor(Math.random() * 150),
  sponsorship: 1500 + i * 400 + Math.floor(Math.random() * 800),
}));

// ── Monthly Comparison (This Year vs Last Year) ──

export const MOCK_MONTHLY_COMPARISON: MonthlyComparison[] = MONTHS.map((month, i) => ({
  month,
  thisYear: 10000 + i * 800 + Math.floor(Math.random() * 2000),
  lastYear: 6500 + i * 500 + Math.floor(Math.random() * 1500),
}));

// ── Transactions ──

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'txn_001', date: '2026-07-22', source: 'twitch_subs', description: 'Monthly subscription payout', amount: 2840.00, status: 'completed', currency: 'USD' },
  { id: 'txn_002', date: '2026-07-21', source: 'sponsorship', description: 'Razer — Milestone 2 payment', amount: 5000.00, status: 'completed', currency: 'USD' },
  { id: 'txn_003', date: '2026-07-20', source: 'youtube_ads', description: 'YouTube AdSense — June 2026', amount: 2340.00, status: 'completed', currency: 'USD' },
  { id: 'txn_004', date: '2026-07-19', source: 'merch', description: 'Store sales — Weekly payout', amount: 420.00, status: 'completed', currency: 'USD' },
  { id: 'txn_005', date: '2026-07-18', source: 'donations', description: 'Streamlabs donations', amount: 185.50, status: 'completed', currency: 'USD' },
  { id: 'txn_006', date: '2026-07-17', source: 'youtube_memberships', description: 'Channel memberships — July', amount: 1560.00, status: 'completed', currency: 'USD' },
  { id: 'txn_007', date: '2026-07-16', source: 'twitch_ads', description: 'Twitch Ad Incentive Program', amount: 1280.00, status: 'completed', currency: 'USD' },
  { id: 'txn_008', date: '2026-07-15', source: 'affiliate', description: 'Amazon Associates — June', amount: 920.00, status: 'completed', currency: 'USD' },
  { id: 'txn_009', date: '2026-07-14', source: 'tiktok_creator_fund', description: 'Creator Fund payout', amount: 580.00, status: 'completed', currency: 'USD' },
  { id: 'txn_010', date: '2026-07-13', source: 'kick_subs', description: 'Kick subscription revenue', amount: 620.00, status: 'completed', currency: 'USD' },
  { id: 'txn_011', date: '2026-07-12', source: 'twitch_bits', description: 'Bits revenue — July', amount: 450.00, status: 'completed', currency: 'USD' },
  { id: 'txn_012', date: '2026-07-10', source: 'sponsorship', description: 'GFuel — Final payment', amount: 3000.00, status: 'completed', currency: 'USD' },
  { id: 'txn_013', date: '2026-07-08', source: 'youtube_superchat', description: 'Super Chat + Super Stickers', amount: 890.00, status: 'completed', currency: 'USD' },
  { id: 'txn_014', date: '2026-07-05', source: 'tiktok_gifts', description: 'TikTok LIVE gifts', amount: 320.00, status: 'completed', currency: 'USD' },
  { id: 'txn_015', date: '2026-07-01', source: 'merch', description: 'Store sale — Limited drop', amount: 1330.00, status: 'completed', currency: 'USD' },
];
