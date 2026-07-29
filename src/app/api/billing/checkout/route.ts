export const dynamic = "force-dynamic";

// POST /api/billing/checkout — Create Stripe checkout session
// Authenticated endpoint — uses Clerk session to identify user

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { getStripe, getStripePriceId, PLAN_CONFIG } from '@/lib/stripe/helpers';
import { z } from 'zod';
import type { BillingTier } from '@/lib/stripe/helpers';

const checkoutSchema = z.object({
  tier: z.enum(['free', 'starter', 'pro', 'agency', 'enterprise']),
  period: z.enum(['monthly', 'annual']),
  successUrl: z.string().optional(),
  cancelUrl: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { tier, period, successUrl, cancelUrl } = parsed.data;

    if (tier === 'free') {
      return NextResponse.json(
        { success: false, error: 'Cannot checkout free tier', code: 'VALIDATION_ERROR' },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const priceId = getStripePriceId(tier as BillingTier, period);

    if (!priceId) {
      // Return mock redirect when Stripe isn't fully configured
      const plan = PLAN_CONFIG[tier as BillingTier];
      return NextResponse.json({
        success: true,
        data: {
          url: `${successUrl || '/settings/billing/success'}?tier=${tier}&period=${period}&plan=${encodeURIComponent(plan.label)}`,
          mock: true,
        },
      });
    }

    // Create real Stripe checkout session
    const stripe = getStripe();

    // Get or create Stripe customer
    let customerId: string | undefined;
    const subscription = await db.subscription.findFirst({
      where: { userId: user.id },
    });

    if (subscription?.stripeCustomerId) {
      customerId = subscription.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        name: user.displayName || undefined,
        metadata: { userId: user.id, clerkId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || `${request.nextUrl.origin}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/settings/billing/cancel`,
      customer: customerId,
      metadata: {
        userId: user.id,
        clerkId,
        tier,
        period,
      },
    });

    return NextResponse.json({
      success: true,
      data: { url: session.url },
    });
  } catch (error) {
    console.error('[Billing Checkout] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
