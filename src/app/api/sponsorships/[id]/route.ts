export const dynamic = "force-dynamic";

// GET /api/sponsorships/[id] — Get campaign details
// PATCH /api/sponsorships/[id] — Update campaign
// DELETE /api/sponsorships/[id] — Soft-delete campaign

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const updateSponsorshipSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  brandName: z.string().min(1).max(255).optional(),
  budgetCents: z.number().int().min(0).optional(),
  costPerClipCents: z.number().int().min(0).optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']).optional(),
  startsAt: z.string().datetime().nullable().optional(),
  endsAt: z.string().datetime().nullable().optional(),
  requiredClips: z.number().int().min(0).optional(),
  requiredPlatforms: z.array(z.string()).optional(),
  brief: z.string().max(5000).optional(),
  guidelines: z.string().max(5000).optional(),
  notes: z.string().max(2000).optional(),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const dbUserId = await getUserId(userId);
    if (!dbUserId) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const { id } = await params;
    const campaign = await db.campaign.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
      include: {
        sponsorships: {
          include: { clip: { select: { id: true, title: true, totalViews: true } } },
        },
        deliverables: true,
        _count: { select: { sponsorships: true, deliverables: true } },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: campaign });
  } catch (error) {
    console.error('[Sponsorship API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const dbUserId = await getUserId(userId);
    if (!dbUserId) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const { id } = await params;
    const campaign = await db.campaign.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateSponsorshipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined) {
        if ((key === 'startsAt' || key === 'endsAt') && value !== null) {
          updateData[key] = new Date(value as string);
        } else {
          updateData[key] = value;
        }
      }
    }

    const updated = await db.campaign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Sponsorship API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const dbUserId = await getUserId(userId);
    if (!dbUserId) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const { id } = await params;
    const campaign = await db.campaign.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: 'Campaign not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    await db.campaign.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'cancelled' },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[Sponsorship API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
