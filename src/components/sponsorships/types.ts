// ── Sponsorship Types ──

export type CampaignStatus = 'active' | 'completed' | 'draft' | 'cancelled';
export type DeliverableStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';
export type DeliverableType = 'video' | 'story' | 'post' | 'stream' | 'banner';

export interface Deliverable {
  id: string;
  campaignId: string;
  title: string;
  type: DeliverableType;
  status: DeliverableStatus;
  dueDate: string;
  completedAt?: string;
  platform: string;
  notes?: string;
}

export interface Campaign {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetUsed: number;
  status: CampaignStatus;
  deliverables: Deliverable[];
  totalDeliverables: number;
  completedDeliverables: number;
  clicks: number;
  conversions: number;
  revenueGenerated: number;
  notes?: string;
}

export interface CampaignPerformance {
  deliverableId: string;
  deliverableTitle: string;
  views: number;
  ctr: number;
  conversions: number;
  revenue: number;
}

export interface CampaignAudience {
  ageGroup: string;
  male: number;
  female: number;
  other: number;
}

export const DELIVERABLE_TYPE_CONFIG: Record<DeliverableType, { label: string; icon: string }> = {
  video: { label: 'Video', icon: 'video' },
  story: { label: 'Story', icon: 'camera' },
  post: { label: 'Post', icon: 'image' },
  stream: { label: 'Stream', icon: 'radio' },
  banner: { label: 'Banner', icon: 'image' },
};

export const DELIVERABLE_STATUS_CONFIG: Record<
  DeliverableStatus,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' }
> = {
  pending: { label: 'Pending', variant: 'ghost' },
  in_progress: { label: 'In Progress', variant: 'accent' },
  completed: { label: 'Completed', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
};

export const CAMPAIGN_STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' }
> = {
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'outline' },
  draft: { label: 'Draft', variant: 'ghost' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
};
