// ── Customer Portal Redirect ──
// Creates a Stripe Customer Portal session and returns the URL.
// The portal allows users to manage subscriptions, payment methods, and invoices.
//
// POST /api/billing/portal
// Body: { customerId: "cus_..." }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId } = body as { customerId: string };

    if (!customerId) {
      return NextResponse.json(
        { error: 'Missing required field: customerId' },
        { status: 400 },
      );
    }

    // In production:
    // const stripe = getStripe();
    // const session = await stripe.billingPortal.sessions.create({
    //   customer: customerId,
    //   return_url: `${request.nextUrl.origin}/settings/billing`,
    // });
    // return NextResponse.json({ url: session.url });

    return NextResponse.json({
      url: '/settings/billing',
      message: 'Customer portal not yet configured. Redirecting to billing page.',
    });
  } catch (error) {
    console.error('[Portal] Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 },
    );
  }
}
