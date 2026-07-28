// ── Billing Mock Data ──

import type { CurrentSubscription, BillingHistoryItem, PaymentMethodInfo } from './types';
import type { UsageStats } from '@/lib/stripe/helpers';
import type { BillingTier } from '@/lib/stripe/helpers';

export const MOCK_CURRENT_SUBSCRIPTION: CurrentSubscription = {
  tier: 'pro',
  status: 'active',
  currentPeriodEnd: '2026-08-22T00:00:00Z',
  cancelAtPeriodEnd: false,
  priceMonthly: 49,
  priceAnnual: 470,
  billingPeriod: 'monthly',
};

export const MOCK_USAGE: Record<BillingTier, UsageStats> = {
  free: {
    clipsUsed: 3,
    clipsLimit: 5,
    postsUsed: 4,
    postsLimit: 10,
    platformsUsed: 2,
    platformsLimit: 3,
  },
  starter: {
    clipsUsed: 22,
    clipsLimit: 30,
    postsUsed: 31,
    postsLimit: 50,
    platformsUsed: 4,
    platformsLimit: 5,
  },
  pro: {
    clipsUsed: 87,
    clipsLimit: 'unlimited',
    postsUsed: 134,
    postsLimit: 200,
    platformsUsed: 6,
    platformsLimit: 'all',
  },
  agency: {
    clipsUsed: 412,
    clipsLimit: 'unlimited',
    postsUsed: 688,
    postsLimit: 1000,
    platformsUsed: 8,
    platformsLimit: 'all',
  },
  enterprise: {
    clipsUsed: 1247,
    clipsLimit: 'unlimited',
    postsUsed: 3201,
    postsLimit: 5000,
    platformsUsed: 12,
    platformsLimit: 'all',
  },
};

export const MOCK_BILLING_HISTORY: BillingHistoryItem[] = [
  {
    id: 'in_1',
    date: '2026-07-22T00:00:00Z',
    description: 'Pro Plan — Monthly',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'in_2',
    date: '2026-06-22T00:00:00Z',
    description: 'Pro Plan — Monthly',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'in_3',
    date: '2026-05-22T00:00:00Z',
    description: 'Pro Plan — Monthly',
    amount: 49.00,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'in_4',
    date: '2026-04-22T00:00:00Z',
    description: 'Starter Plan — Monthly',
    amount: 19.00,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'in_5',
    date: '2026-03-22T00:00:00Z',
    description: 'Starter Plan — Monthly',
    amount: 19.00,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
  {
    id: 'in_6',
    date: '2026-02-22T00:00:00Z',
    description: 'Starter Plan — Monthly (Prorated)',
    amount: 12.35,
    currency: 'USD',
    status: 'paid',
    invoiceUrl: '#',
  },
];

export const MOCK_PAYMENT_METHOD: PaymentMethodInfo = {
  brand: 'visa',
  last4: '4242',
  expMonth: 12,
  expYear: 2028,
};
