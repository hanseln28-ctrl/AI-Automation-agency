// ── Admin Panel Types & Config ──

export type AdminUserStatus = 'active' | 'suspended' | 'trial' | 'cancelled';
export type AdminUserPlan = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';
export type FeatureFlagScope = 'global' | 'per_user' | 'percentage';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: AdminUserPlan;
  status: AdminUserStatus;
  joinedDate: string;
  lastActive: string;
  clipsGenerated: number;
  streamsImported: number;
  postsScheduled: number;
  totalSpend: number;
}

export interface AdminBillingRecord {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  plan: AdminUserPlan;
  status: SubscriptionStatus;
  startDate: string;
  nextBilling: string;
  paymentMethod: string;
}

export interface AdminActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  date: string;
  ip?: string;
}

export interface AdminAIUsageRecord {
  id: string;
  userId: string;
  userName: string;
  openaiCalls: number;
  tokensUsed: number;
  cost: number;
  period: string;
}

export interface AdminFeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  scope: FeatureFlagScope;
  lastModified: string;
}

export interface AdminSystemSettings {
  rateLimitPerMinute: number;
  maxFileSizeMB: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowNewSignups: boolean;
  oauthProviders: {
    twitch: boolean;
    youtube: boolean;
    tiktok: boolean;
    kick: boolean;
  };
}

// ── Config Constants ──

export const PLAN_CONFIG: Record<
  AdminUserPlan,
  { label: string; badgeClass: string; price: string }
> = {
  free: {
    label: 'Free',
    badgeClass: 'bg-background-elevated text-text-secondary border-border',
    price: '$0/mo',
  },
  starter: {
    label: 'Starter',
    badgeClass: 'bg-accent-subtle/50 text-accent border-accent/30',
    price: '$19/mo',
  },
  pro: {
    label: 'Pro',
    badgeClass: 'bg-accent-subtle text-accent border-accent/50',
    price: '$49/mo',
  },
  agency: {
    label: 'Agency',
    badgeClass: 'bg-success-subtle text-success border-success/30',
    price: '$149/mo',
  },
  enterprise: {
    label: 'Enterprise',
    badgeClass: 'bg-[#6C5CE7]/15 text-[#A78BFA] border-[#6C5CE7]/40',
    price: 'Custom',
  },
};

export const STATUS_CONFIG: Record<
  AdminUserStatus,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'ghost' }
> = {
  active: { label: 'Active', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'danger' },
  trial: { label: 'Trial', variant: 'accent' },
  cancelled: { label: 'Cancelled', variant: 'ghost' },
};

export const SUBSCRIPTION_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'ghost' }
> = {
  active: { label: 'Active', variant: 'success' },
  past_due: { label: 'Past Due', variant: 'danger' },
  cancelled: { label: 'Cancelled', variant: 'ghost' },
  trialing: { label: 'Trialing', variant: 'accent' },
};
