export const dynamic = "force-dynamic";

// GET /api/community — List community messages

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const communityQuerySchema = z.object({
  status: z.enum(['unread', 'read', 'archived', 'all']).default('all'),
  sentiment: z.enum(['positive', 'neutral', 'negative', 'spam']).optional(),
  priority: z.coerce.number().int().min(0).max(2).optional(),
  platform: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
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
    const query = communityQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { status, sentiment, priority, platform, cursor, limit } = query.data;

    const where: Record<string, unknown> = { userId: dbUserId };
    if (status === 'unread') where.isRead = false;
    else if (status === 'read') where.isRead = true;
    else if (status === 'archived') where.isArchived = true;
    else {
      where.isArchived = false;
    }
    if (sentiment) where.sentiment = sentiment;
    if (priority !== undefined) where.priority = { gte: priority };
    if (platform) where.source = platform;

    const [messages, unreadCount] = await Promise.all([
      db.communityMessage.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
      db.communityMessage.count({
        where: { userId: dbUserId, isRead: false, isArchived: false },
      }),
    ]);

    const hasMore = messages.length > limit;
    const data = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return NextResponse.json({
      success: true,
      data,
      unreadCount,
      pagination: { nextCursor, hasMore, limit },
    });
  } catch (error) {
    console.error('[Community API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
