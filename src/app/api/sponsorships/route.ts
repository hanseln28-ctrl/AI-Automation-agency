// GET /api/sponsorships — List sponsorship campaigns
// POST /api/sponsorships — Create sponsorship campaign

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const listSponsorshipsQuerySchema = z.object({
  status: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const createSponsorshipSchema = z.object({
  name: z.string().min(1).max(255),
  brandName: z.string().min(1).max(255),
  budgetCents: z.number().int().min(0).default(0),
  costPerClipCents: z.number().int().min(0).optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  requiredClips: z.number().int().min(0).optional(),
  requiredPlatforms: z.array(z.string()).optional(),
  brief: z.string().max(5000).optional(),
  guidelines: z.string().max(5000).optional(),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

export async function GET(request: NextRequest) {
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

    const url = new URL(request.url);
    const query = listSponsorshipsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { status, cursor, limit } = query.data;

    const where: Record<string, unknown> = { userId: dbUserId, deletedAt: null };
    if (status) where.status = status;

    const campaigns = await db.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        _count: { select: { sponsorships: true, deliverables: true } },
      },
    });

    const hasMore = campaigns.length > limit;
    const data = hasMore ? campaigns.slice(0, limit) : campaigns;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return NextResponse.json({
      success: true,
      data,
      pagination: { nextCursor, hasMore, limit },
    });
  } catch (error) {
    console.error('[Sponsorships API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const parsed = createSponsorshipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const campaign = await db.campaign.create({
      data: {
        userId: dbUserId,
        name: parsed.data.name,
        brandName: parsed.data.brandName,
        budgetCents: parsed.data.budgetCents,
        costPerClipCents: parsed.data.costPerClipCents,
        startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
        requiredClips: parsed.data.requiredClips,
        requiredPlatforms: parsed.data.requiredPlatforms || [],
        brief: parsed.data.brief,
        guidelines: parsed.data.guidelines,
        status: 'draft',
      },
    });

    return NextResponse.json(
      { success: true, data: campaign },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Sponsorships API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
