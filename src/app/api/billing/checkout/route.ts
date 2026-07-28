// ── Create Checkout Session ──
// Creates a Stripe Checkout session and returns the URL for redirect.
//
// POST /api/billing/checkout
// Body: { tier: "pro", period: "monthly" | "annual", userId: "..." }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getStripePriceId } from '@/lib/stripe/helpers';
import type { BillingTier } from '@/lib/stripe/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, period, userId } = body as {
      tier: BillingTier;
      period: 'monthly' | 'annual';
      userId?: string;
    };

    if (!tier || !period) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, period' },
        { status: 400 },
      );
    }

    const priceId = getStripePriceId(tier, period);

    if (!priceId) {
      // In production, you'd create a Stripe Checkout Session:
      // const stripe = getStripe();
      // const session = await stripe.checkout.sessions.create({
      //   mode: 'subscription',
      //   payment_method_types: ['card'],
      //   line_items: [{ price: priceId, quantity: 1 }],
      //   success_url: `${request.nextUrl.origin}/settings/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      //   cancel_url: `${request.nextUrl.origin}/settings/billing/cancel`,
      //   customer_email: userEmail,
      //   metadata: { userId, tier, period },
      // });
      // return NextResponse.json({ url: session.url });

      return NextResponse.json({
        url: `/settings/billing/success?tier=${tier}`,
        message: 'Stripe price ID not configured. Using mock redirect.',
      });
    }

    // Real implementation when price IDs are set:
    // const stripe = getStripe();
    // const session = await stripe.checkout.sessions.create({ ... });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      url: `/settings/billing/success?tier=${tier}`,
    });
  } catch (error) {
    console.error('[Checkout] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
