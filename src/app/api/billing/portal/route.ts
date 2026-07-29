export const dynamic = "force-dynamic";

// POST /api/billing/portal — Redirect to Stripe Customer Portal
// Authenticated endpoint — uses Clerk session to identify user

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { getStripe } from '@/lib/stripe/helpers';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Find Stripe customer
    const subscription = await db.subscription.findFirst({
      where: { userId: user.id, status: { not: 'incomplete' } },
      orderBy: { createdAt: 'desc' },
    });

    const customerId = subscription?.stripeCustomerId;
    if (!customerId) {
      return NextResponse.json(
        { success: false, error: 'No Stripe customer found. Please subscribe first.', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Create Stripe Customer Portal session
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.nextUrl.origin}/settings/billing`,
    });

    return NextResponse.json({
      success: true,
      data: { url: session.url },
    });
  } catch (error) {
    console.error('[Billing Portal] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portal session', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
