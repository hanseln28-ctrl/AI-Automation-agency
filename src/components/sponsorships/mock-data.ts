import type {
  Campaign,
  CampaignPerformance,
  CampaignAudience,
} from './types';

// ── Mock Campaigns ──

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_001',
    brandName: 'Razer',
    brandLogo: '',
    campaignName: 'Kraken V4 Launch',
    startDate: '2026-07-01',
    endDate: '2026-08-15',
    budget: 15000,
    budgetUsed: 9500,
    status: 'active',
    clicks: 45000,
    conversions: 2300,
    revenueGenerated: 18750,
    totalDeliverables: 5,
    completedDeliverables: 3,
    deliverables: [
      {
        id: 'del_001',
        campaignId: 'camp_001',
        title: 'Unboxing & First Impressions',
        type: 'video',
        status: 'completed',
        dueDate: '2026-07-10',
        completedAt: '2026-07-08',
        platform: 'youtube',
      },
      {
        id: 'del_002',
        campaignId: 'camp_001',
        title: 'Live Stream Demo',
        type: 'stream',
        status: 'completed',
        dueDate: '2026-07-18',
        completedAt: '2026-07-17',
        platform: 'twitch',
      },
      {
        id: 'del_003',
        campaignId: 'camp_001',
        title: 'TikTok Short Clip',
        type: 'video',
        status: 'completed',
        dueDate: '2026-07-25',
        completedAt: '2026-07-24',
        platform: 'tiktok',
      },
      {
        id: 'del_004',
        campaignId: 'camp_001',
        title: 'Instagram Story Series',
        type: 'story',
        status: 'in_progress',
        dueDate: '2026-08-05',
        platform: 'instagram',
      },
      {
        id: 'del_005',
        campaignId: 'camp_001',
        title: 'Review & Comparison Video',
        type: 'video',
        status: 'pending',
        dueDate: '2026-08-15',
        platform: 'youtube',
      },
    ],
  },
  {
    id: 'camp_002',
    brandName: 'GFuel',
    brandLogo: '',
    campaignName: 'Summer Collection 2026',
    startDate: '2026-06-15',
    endDate: '2026-07-30',
    budget: 8000,
    budgetUsed: 8000,
    status: 'active',
    clicks: 32000,
    conversions: 1800,
    revenueGenerated: 11200,
    totalDeliverables: 4,
    completedDeliverables: 4,
    deliverables: [
      {
        id: 'del_006',
        campaignId: 'camp_002',
        title: 'Taste Test Video',
        type: 'video',
        status: 'completed',
        dueDate: '2026-06-22',
        completedAt: '2026-06-20',
        platform: 'youtube',
      },
      {
        id: 'del_007',
        campaignId: 'camp_002',
        title: 'Stream Sponsorship Overlay',
        type: 'banner',
        status: 'completed',
        dueDate: '2026-06-30',
        completedAt: '2026-06-28',
        platform: 'twitch',
      },
      {
        id: 'del_008',
        campaignId: 'camp_002',
        title: 'Instagram Post',
        type: 'post',
        status: 'completed',
        dueDate: '2026-07-10',
        completedAt: '2026-07-08',
        platform: 'instagram',
      },
      {
        id: 'del_009',
        campaignId: 'camp_002',
        title: 'TikTok Challenge',
        type: 'video',
        status: 'completed',
        dueDate: '2026-07-25',
        completedAt: '2026-07-22',
        platform: 'tiktok',
      },
    ],
  },
  {
    id: 'camp_003',
    brandName: 'Elgato',
    brandLogo: '',
    campaignName: 'Stream Deck+ Integration',
    startDate: '2026-08-01',
    endDate: '2026-09-15',
    budget: 12000,
    budgetUsed: 0,
    status: 'draft',
    clicks: 0,
    conversions: 0,
    revenueGenerated: 0,
    totalDeliverables: 6,
    completedDeliverables: 0,
    deliverables: [
      { id: 'del_010', campaignId: 'camp_003', title: 'Setup Tutorial', type: 'video', status: 'pending', dueDate: '2026-08-10', platform: 'youtube' },
      { id: 'del_011', campaignId: 'camp_003', title: 'Live Demo Stream', type: 'stream', status: 'pending', dueDate: '2026-08-20', platform: 'twitch' },
      { id: 'del_012', campaignId: 'camp_003', title: 'Productivity Tips Video', type: 'video', status: 'pending', dueDate: '2026-08-30', platform: 'youtube' },
      { id: 'del_013', campaignId: 'camp_003', title: 'Instagram Reel', type: 'video', status: 'pending', dueDate: '2026-09-05', platform: 'instagram' },
      { id: 'del_014', campaignId: 'camp_003', title: 'TikTok Short', type: 'video', status: 'pending', dueDate: '2026-09-10', platform: 'tiktok' },
      { id: 'del_015', campaignId: 'camp_003', title: 'Banner Overlay', type: 'banner', status: 'pending', dueDate: '2026-09-15', platform: 'twitch' },
    ],
  },
  {
    id: 'camp_004',
    brandName: 'Corsair',
    brandLogo: '',
    campaignName: 'RGB Everything Campaign',
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    budget: 10000,
    budgetUsed: 10000,
    status: 'completed',
    clicks: 28000,
    conversions: 1400,
    revenueGenerated: 14200,
    totalDeliverables: 4,
    completedDeliverables: 4,
    deliverables: [],
  },
];

// ── Campaign Performance ──

export function getCampaignPerformance(campaignId: string): CampaignPerformance[] {
  if (campaignId === 'camp_001') {
    return [
      { deliverableId: 'del_001', deliverableTitle: 'Unboxing & First Impressions', views: 125000, ctr: 4.2, conversions: 720, revenue: 5800 },
      { deliverableId: 'del_002', deliverableTitle: 'Live Stream Demo', views: 89000, ctr: 3.8, conversions: 540, revenue: 4200 },
      { deliverableId: 'del_003', deliverableTitle: 'TikTok Short Clip', views: 342000, ctr: 5.1, conversions: 1040, revenue: 8750 },
    ];
  }
  return [
    { deliverableId: 'del_006', deliverableTitle: 'Taste Test Video', views: 98000, ctr: 4.5, conversions: 620, revenue: 4800 },
    { deliverableId: 'del_007', deliverableTitle: 'Stream Sponsorship Overlay', views: 45000, ctr: 2.1, conversions: 310, revenue: 1800 },
    { deliverableId: 'del_008', deliverableTitle: 'Instagram Post', views: 72000, ctr: 3.2, conversions: 450, revenue: 2600 },
    { deliverableId: 'del_009', deliverableTitle: 'TikTok Challenge', views: 210000, ctr: 4.8, conversions: 420, revenue: 2000 },
  ];
}

// ── Campaign Audience ──

export const MOCK_CAMPAIGN_AUDIENCE: CampaignAudience[] = [
  { ageGroup: '13-17', male: 10, female: 6, other: 2 },
  { ageGroup: '18-24', male: 30, female: 14, other: 4 },
  { ageGroup: '25-34', male: 20, female: 7, other: 3 },
  { ageGroup: '35-44', male: 3, female: 2, other: 1 },
  { ageGroup: '45+', male: 1, female: 1, other: 0 },
];

// ── Helpers ──

export function getCampaignById(id: string): Campaign | undefined {
  return MOCK_CAMPAIGNS.find((c) => c.id === id);
}
