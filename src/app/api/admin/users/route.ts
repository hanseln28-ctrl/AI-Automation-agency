// GET /api/admin/users — List/search all users (admin only)

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const adminUsersQuerySchema = z.object({
  q: z.string().optional(),
  tier: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

async function isAdmin(dbUserId: string): Promise<boolean> {
  // Check if user has admin role via team membership or custom logic
  // For now, check if user is in an admin team or has enterprise tier
  const user = await db.user.findUnique({
    where: { id: dbUserId },
    select: { tier: true },
  });
  return user?.tier === 'enterprise';
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

    // Admin check
    const admin = await isAdmin(dbUserId);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 },
      );
    }

    const url = new URL(request.url);
    const query = adminUsersQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { q, tier, cursor, limit } = query.data;

    const where: Record<string, unknown> = { deletedAt: null };
    if (tier) where.tier = tier;
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { displayName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        _count: { select: { streams: true, clips: true } },
        subscriptions: { where: { status: 'active' }, take: 1 },
      },
    });

    const hasMore = users.length > limit;
    const data = hasMore ? users.slice(0, limit) : users;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return NextResponse.json({
      success: true,
      data,
      pagination: { nextCursor, hasMore, limit },
    });
  } catch (error) {
    console.error('[Admin Users API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
