// ── Stripe Server-Side Helpers ──

import Stripe from 'stripe';

// ── Plan Configuration ──

export type BillingTier = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';

export interface PlanTierConfig {
  tier: BillingTier;
  label: string;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  clipsPerMonth: number | 'unlimited';
  platforms: number | 'all';
  postsScheduled: number;
  creators: number | 'unlimited';
  features: string[];
  highlighted: boolean;
  popular: boolean;
}

export const PLAN_CONFIG: Record<BillingTier, PlanTierConfig> = {
  free: {
    tier: 'free',
    label: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    currency: 'USD',
    clipsPerMonth: 5,
    platforms: 3,
    postsScheduled: 10,
    creators: 1,
    features: [
      '5 clips per month',
      '3 platform connections',
      'Basic publishing',
      'Standard captions',
      'Community features',
    ],
    highlighted: false,
    popular: false,
  },
  starter: {
    tier: 'starter',
    label: 'Starter',
    priceMonthly: 19,
    priceAnnual: 182,
    currency: 'USD',
    clipsPerMonth: 30,
    platforms: 5,
    postsScheduled: 50,
    creators: 1,
    features: [
      '30 clips per month',
      '5 platform connections',
      'Auto captions',
      'Basic publishing',
      'Email support',
      'Community features',
    ],
    highlighted: false,
    popular: false,
  },
  pro: {
    tier: 'pro',
    label: 'Pro',
    priceMonthly: 49,
    priceAnnual: 470,
    currency: 'USD',
    clipsPerMonth: 'unlimited',
    platforms: 'all',
    postsScheduled: 200,
    creators: 3,
    features: [
      'Unlimited clips',
      'All platforms',
      'AI-powered hooks',
      'Advanced analytics',
      'Sponsorship reports',
      'Revenue dashboards',
      'Priority support',
      'Custom captions',
    ],
    highlighted: true,
    popular: true,
  },
  agency: {
    tier: 'agency',
    label: 'Agency',
    priceMonthly: 149,
    priceAnnual: 1430,
    currency: 'USD',
    clipsPerMonth: 'unlimited',
    platforms: 'all',
    postsScheduled: 1000,
    creators: 10,
    features: [
      'Unlimited clips',
      'All platforms',
      '10 creator accounts',
      'White-label reports',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
    ],
    highlighted: false,
    popular: false,
  },
  enterprise: {
    tier: 'enterprise',
    label: 'Enterprise',
    priceMonthly: 499,
    priceAnnual: 4790,
    currency: 'USD',
    clipsPerMonth: 'unlimited',
    platforms: 'all',
    postsScheduled: 5000,
    creators: 'unlimited',
    features: [
      'Unlimited clips',
      'All platforms',
      'Unlimited creators',
      'White-label reports',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Onboarding & training',
      'SSO / SAML',
    ],
    highlighted: false,
    popular: false,
  },
};

// ── Subscription Types ──

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing' | 'incomplete';

export interface BillingSubscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  planTier: BillingTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingInvoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  invoiceUrl: string;
  invoicePdf: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface UsageStats {
  clipsUsed: number;
  clipsLimit: number | 'unlimited';
  postsUsed: number;
  postsLimit: number;
  platformsUsed: number;
  platformsLimit: number | 'all';
}

// ── Stripe Client ──

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }

  stripeClient = new Stripe(key, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  });

  return stripeClient;
}

// ── Helpers ──

/**
 * Get plan configuration for a given tier.
 */
export function getPlanFeatures(tier: BillingTier): PlanTierConfig {
  return PLAN_CONFIG[tier] || PLAN_CONFIG.free;
}

/**
 * Get the active subscription for a user (placeholder — pings DB).
 */
export async function getActiveSubscription(
  userId: string,
): Promise<BillingSubscription | null> {
  // Placeholder: in production this queries your DB
  // const { prisma } = await import('@/lib/db/prisma');
  // return prisma.subscription.findFirst({ where: { userId, status: 'active' } });
  return null;
}

/**
 * Get the Stripe price ID for a given tier and billing period.
 * In production these come from the Stripe Dashboard or env vars.
 */
export function getStripePriceId(
  tier: BillingTier,
  period: 'monthly' | 'annual',
): string | null {
  const priceMap: Record<BillingTier, { monthly: string; annual: string }> = {
    free: {
      monthly: '',
      annual: '',
    },
    starter: {
      monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_STARTER_ANNUAL || '',
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
    },
    agency: {
      monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL || '',
    },
    enterprise: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
      annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || '',
    },
  };

  return priceMap[tier][period] || null;
}

/**
 * Format a currency amount for display.
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get or create a Stripe customer for a user.
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string,
): Promise<string> {
  const stripe = getStripe();

  // In production: query your DB for existing stripeCustomerId first
  // const { prisma } = await import('@/lib/db/prisma');
  // const sub = await prisma.subscription.findFirst({ where: { userId } });
  // if (sub?.stripeCustomerId) return sub.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId },
  });

  return customer.id;
}

/**
 * Validate a Stripe webhook signature.
 */
export async function validateWebhookSignature(
  payload: string,
  signature: string,
): Promise<Stripe.Event> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Calculate annual price with 20% discount from monthly.
 */
export function calculateAnnualPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.8);
}

/**
 * Derive annual savings from monthly.
 */
export function getAnnualSavings(monthlyPrice: number): number {
  return monthlyPrice * 12 - calculateAnnualPrice(monthlyPrice);
}
