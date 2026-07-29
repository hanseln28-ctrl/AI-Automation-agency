export const dynamic = "force-dynamic";

// ── Stripe Webhook Handler ──
// Receives Stripe events for subscription lifecycle management.
//
// In production:
// 1. Verify the webhook signature using validateWebhookSignature()
// 2. Handle relevant event types and sync to your DB
//
// Stripe CLI for local testing:
//   stripe listen --forward-to localhost:3000/api/webhooks/stripe

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Supported Stripe webhook events to handle:
 *
 * - customer.subscription.created   → Create subscription record in DB
 * - customer.subscription.updated   → Update subscription status/plan in DB
 * - customer.subscription.deleted   → Mark subscription as cancelled in DB
 * - invoice.paid                    → Record successful payment
 * - invoice.payment_failed          → Notify user of failed payment
 * - checkout.session.completed      → Provision access after checkout
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    // ── Signature Verification (placeholder) ──
    // In production:
    //   import { validateWebhookSignature } from '@/lib/stripe/helpers';
    //   const event = await validateWebhookSignature(body, signature);
    //
    // For now, parse the raw body as JSON:
    const event = JSON.parse(body);

    // ── Event Routing ──
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('[Stripe] Checkout completed:', session.id);
        // Provision subscription access in DB
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('[Stripe] Subscription created:', subscription.id);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('[Stripe] Subscription updated:', subscription.id);
        // Sync plan, status, billing period
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('[Stripe] Subscription deleted:', subscription.id);
        // Revoke access or downgrade to free
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        console.log('[Stripe] Invoice paid:', invoice.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('[Stripe] Payment failed:', invoice.id);
        // Notify user, update subscription to past_due
        break;
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 400 },
    );
  }
}

/**
 * Stripe sends GET requests for webhook verification — not needed in production.
 */
export async function GET() {
  return NextResponse.json({ status: 'Stripe webhook endpoint is active' });
}
