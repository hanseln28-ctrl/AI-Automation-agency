export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

type ClerkEventType = 'user.created' | 'user.updated' | 'user.deleted';

interface ClerkWebhookEvent {
  type: ClerkEventType;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    primary_email_address_id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    created_at: number;
    updated_at: number;
    public_metadata: Record<string, unknown>;
    private_metadata: Record<string, unknown>;
    unsafe_metadata: Record<string, unknown>;
  };
}

async function verifyWebhook(body: string, svixId: string, svixTimestamp: string, svixSignature: string) {
  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not configured');
  }

  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  return wh.verify(body, {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  }) as ClerkWebhookEvent;
}

async function handleUserCreated(evt: ClerkWebhookEvent['data']) {
  const primaryEmail = evt.email_addresses.find(
    (e) => e.id === evt.primary_email_address_id,
  );

  console.log('[webhooks/clerk] user.created:', {
    clerkId: evt.id,
    email: primaryEmail?.email_address ?? null,
    firstName: evt.first_name,
    lastName: evt.last_name,
  });

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: evt.id },
    });

    if (existingUser) {
      console.log('[webhooks/clerk] User already exists, skipping creation:', evt.id);
      return;
    }

    await prisma.user.create({
      data: {
        clerkId: evt.id,
        email: primaryEmail?.email_address ?? null,
        displayName: [evt.first_name, evt.last_name].filter(Boolean).join(' ') || null,
        avatarUrl: evt.image_url ?? null,
      },
    });

    console.log('[webhooks/clerk] Created user in database:', evt.id);
  } catch (error) {
    console.error('[webhooks/clerk] Failed to create user:', evt.id, error);
    throw error;
  }
}

async function handleUserUpdated(evt: ClerkWebhookEvent['data']) {
  const primaryEmail = evt.email_addresses.find(
    (e) => e.id === evt.primary_email_address_id,
  );

  console.log('[webhooks/clerk] user.updated:', {
    clerkId: evt.id,
    email: primaryEmail?.email_address ?? null,
    metadata: evt.public_metadata,
  });

  try {
    await prisma.user.update({
      where: { clerkId: evt.id },
      data: {
        email: primaryEmail?.email_address ?? null,
        displayName: [evt.first_name, evt.last_name].filter(Boolean).join(' ') || null,
        avatarUrl: evt.image_url ?? null,
      },
    });

    console.log('[webhooks/clerk] Updated user in database:', evt.id);
  } catch (error) {
    console.error('[webhooks/clerk] Failed to update user:', evt.id, error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await req.text();

    // Get Svix headers
    const headerList = await headers();
    const svixId = headerList.get('svix-id');
    const svixTimestamp = headerList.get('svix-timestamp');
    const svixSignature = headerList.get('svix-signature');

    // Validate presence of required headers
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('[webhooks/clerk] Missing Svix headers');
      return NextResponse.json(
        { error: 'Missing Svix signature headers' },
        { status: 400 },
      );
    }

    // Verify webhook signature
    let evt: ClerkWebhookEvent;
    try {
      evt = await verifyWebhook(body, svixId, svixTimestamp, svixSignature);
    } catch (err) {
      console.error('[webhooks/clerk] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 },
      );
    }

    // Route to event handler
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        console.log('[webhooks/clerk] user.deleted:', evt.data.id);
        break;
      default:
        console.log('[webhooks/clerk] Unhandled event type:', (evt as { type: string }).type);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[webhooks/clerk] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
