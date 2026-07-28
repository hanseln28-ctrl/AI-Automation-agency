// ── Billing Component Types ──

import type { BillingTier, SubscriptionStatus, UsageStats } from '@/lib/stripe/helpers';

export type { BillingTier, SubscriptionStatus, UsageStats };

export interface CurrentSubscription {
  tier: BillingTier;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  priceMonthly: number;
  priceAnnual: number;
  billingPeriod: 'monthly' | 'annual';
}

export interface BillingHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  invoiceUrl: string;
}

export interface PaymentMethodInfo {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Active',
  past_due: 'Past Due',
  cancelled: 'Cancelled',
  trialing: 'Trial',
  incomplete: 'Incomplete',
};

export const SUBSCRIPTION_STATUS_VARIANTS: Record<
  SubscriptionStatus,
  'success' | 'warning' | 'danger' | 'accent' | 'ghost'
> = {
  active: 'success',
  past_due: 'warning',
  cancelled: 'ghost',
  trialing: 'accent',
  incomplete: 'danger',
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  open: 'Pending',
  void: 'Void',
  uncollectible: 'Failed',
};

export const INVOICE_STATUS_VARIANTS: Record<string, 'success' | 'warning' | 'danger' | 'ghost'> = {
  paid: 'success',
  open: 'warning',
  void: 'ghost',
  uncollectible: 'danger',
};

export const PAYMENT_BRAND_LABELS: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
};

export const PAYMENT_BRAND_COLORS: Record<string, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#2E77BC',
  discover: '#FF6000',
};
