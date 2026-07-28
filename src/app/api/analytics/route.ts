// GET /api/analytics — Aggregate analytics data

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const analyticsQuerySchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  platform: z.string().optional(),
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
    const query = analyticsQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { period, platform } = query.data;

    // Calculate date range
    const now = new Date();
    const daysMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const daysAgo = new Date(now);
    daysAgo.setDate(daysAgo.getDate() - daysMap[period]);

    // Clip stats aggregation
    const clipWhere: Record<string, unknown> = {
      userId: dbUserId,
      deletedAt: null,
      createdAt: { gte: daysAgo },
    };

    const clipsAgg = await db.clip.aggregate({
      where: clipWhere,
      _sum: {
        totalViews: true,
        totalLikes: true,
        totalComments: true,
        totalShares: true,
      },
      _count: { id: true },
    });

    const totalViews = Number(clipsAgg._sum.totalViews || 0);
    const totalLikes = Number(clipsAgg._sum.totalLikes || 0);
    const totalComments = Number(clipsAgg._sum.totalComments || 0);
    const totalShares = Number(clipsAgg._sum.totalShares || 0);
    const totalClips = clipsAgg._count.id;

    const totalEngagements = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalViews > 0 ? totalEngagements / totalViews : 0;

    // Top clips
    const topClips = await db.clip.findMany({
      where: { userId: dbUserId, deletedAt: null, createdAt: { gte: daysAgo } },
      orderBy: { totalViews: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        totalViews: true,
        engagementRate: true,
        category: true,
        thumbnailUrl: true,
      },
    });

    // Revenue summary
    const revenueAgg = await db.revenueSource.aggregate({
      where: { userId: dbUserId, earnedAt: { gte: daysAgo } },
      _sum: { amountCents: true },
    });

    const totalRevenueCents = Number(revenueAgg._sum.amountCents || 0);

    // Stream count
    const streamCount = await db.stream.count({
      where: { userId: dbUserId, deletedAt: null, createdAt: { gte: daysAgo } },
    });

    // Platform breakdown
    const platformBreakdown: Record<string, { views: number; engagementRate: number }> = {};
    if (platform) {
      const platformClips = await db.clip.findMany({
        where: { ...clipWhere, category: { not: null } },
        select: { totalViews: true, engagementRate: true, scheduledPosts: { select: { platform: true } } },
      });
      // simplified platform breakdown from scheduled posts
      for (const clip of platformClips) {
        for (const post of clip.scheduledPosts) {
          if (!platformBreakdown[post.platform]) {
            platformBreakdown[post.platform] = { views: 0, engagementRate: 0 };
          }
          platformBreakdown[post.platform].views += Number(clip.totalViews);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        period,
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        totalClips,
        totalStreams: streamCount,
        totalRevenueCents,
        avgEngagementRate: Math.round(avgEngagementRate * 10000) / 10000,
        topClips,
        platformBreakdown,
      },
    });
  } catch (error) {
    console.error('[Analytics API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
