export const dynamic = "force-dynamic";

// GET /api/revenue — List revenue sources
// POST /api/revenue — Record manual revenue

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const listRevenueQuerySchema = z.object({
  sourceType: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const createRevenueSchema = z.object({
  sourceType: z.enum(['sponsorship', 'platform_ad_revenue', 'subscription', 'donation', 'affiliate', 'merchandise', 'other']),
  sourceName: z.string().min(1).max(255),
  amountCents: z.number().int().min(0),
  currency: z.string().default('USD'),
  earnedAt: z.string(),
  notes: z.string().max(1000).optional(),
  campaignId: z.string().uuid().optional(),
  clipId: z.string().uuid().optional(),
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
    const query = listRevenueQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { sourceType, dateFrom, dateTo, cursor, limit } = query.data;

    const where: Record<string, unknown> = { userId: dbUserId };
    if (sourceType) where.sourceType = sourceType;
    if (dateFrom || dateTo) {
      where.earnedAt = {};
      if (dateFrom) (where.earnedAt as Record<string, unknown>).gte = new Date(dateFrom);
      if (dateTo) (where.earnedAt as Record<string, unknown>).lte = new Date(dateTo);
    }

    const [revenue, summary] = await Promise.all([
      db.revenueSource.findMany({
        where,
        orderBy: { earnedAt: 'desc' },
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.revenueSource.groupBy({
        by: ['sourceType'],
        where,
        _sum: { amountCents: true },
      }),
    ]);

    const hasMore = revenue.length > limit;
    const data = hasMore ? revenue.slice(0, limit) : revenue;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    const breakdown: Record<string, number> = {};
    let totalRevenueCents = 0;
    for (const group of summary) {
      const amount = Number(group._sum.amountCents || 0);
      breakdown[group.sourceType] = amount;
      totalRevenueCents += amount;
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions: data,
        totalRevenueCents,
        breakdown,
        pagination: { nextCursor, hasMore, limit },
      },
    });
  } catch (error) {
    console.error('[Revenue API] GET error:', error);
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
    const parsed = createRevenueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const revenue = await db.revenueSource.create({
      data: {
        userId: dbUserId,
        sourceType: parsed.data.sourceType,
        sourceName: parsed.data.sourceName,
        amountCents: parsed.data.amountCents,
        currency: parsed.data.currency,
        earnedAt: new Date(parsed.data.earnedAt),
        notes: parsed.data.notes,
        campaignId: parsed.data.campaignId,
        clipId: parsed.data.clipId,
      },
    });

    return NextResponse.json(
      { success: true, data: revenue },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Revenue API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
