export const dynamic = "force-dynamic";

// GET /api/clips — List user's clips (paginated, filterable)
// POST /api/clips — Generate clips from a stream

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

// ── Validation ──

const listClipsQuerySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  streamId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  q: z.string().optional(),
});

const generateClipsSchema = z.object({
  streamId: z.string().uuid(),
  clipCount: z.number().int().min(1).max(50).default(10),
  durationRange: z
    .tuple([z.number().int().min(15), z.number().int().max(180)])
    .optional(),
  captionStyle: z.string().default('kinetic'),
  hookVariants: z.number().int().min(1).max(5).default(3),
  platformTargets: z.array(z.string()).default(['tiktok']),
  categoryFilter: z.array(z.string()).optional(),
});

// ── Helper ──

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

// ── GET /api/clips ──

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
    const query = listClipsQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );

    if (!query.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          code: 'VALIDATION_ERROR',
          details: query.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { status, category, streamId, cursor, limit, sort, q } = query.data;

    const where: Record<string, unknown> = {
      userId: dbUserId,
      deletedAt: null,
    };

    if (status) where.status = status;
    if (category) where.category = category;
    if (streamId) where.streamId = streamId;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Determine sort order
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    if (sort) {
      const isDesc = sort.startsWith('-');
      const field = isDesc ? sort.slice(1) : sort;
      const validFields = ['createdAt', 'totalViews', 'engagementRate', 'title'];
      if (validFields.includes(field)) {
        orderBy = { [field]: isDesc ? 'desc' : 'asc' };
      }
    }

    const clips = await db.clip.findMany({
      where,
      orderBy,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        stream: {
          select: { id: true, title: true },
        },
        _count: {
          select: { captions: true, hooks: true, scheduledPosts: true },
        },
      },
    });

    const hasMore = clips.length > limit;
    const data = hasMore ? clips.slice(0, limit) : clips;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        nextCursor,
        hasMore,
        limit,
      },
    });
  } catch (error) {
    console.error('[Clips API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── POST /api/clips ──

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
    const parsed = generateClipsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { streamId, clipCount } = parsed.data;

    // Verify stream ownership
    const stream = await db.stream.findFirst({
      where: { id: streamId, userId: dbUserId, deletedAt: null },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: 'Stream not found', code: 'STREAM_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Check clip limits
    const user = await db.user.findUnique({ where: { id: dbUserId } });
    if (user && user.clipsUsedThisMonth + clipCount > user.clipsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: `Clip limit exceeded. You have ${user.clipsLimit - user.clipsUsedThisMonth} clips remaining this month.`,
          code: 'CLIP_LIMIT_EXCEEDED',
        },
        { status: 403 },
      );
    }

    // Update stream status
    await db.stream.update({
      where: { id: streamId },
      data: { status: 'generating_clips', progressPct: 0 },
    });

    // Note: In production, this would enqueue a BullMQ job for AI processing.
    // For now, we create placeholder clip records.
    const placeholderClips = [];
    for (let i = 0; i < Math.min(clipCount, 5); i++) {
      const clip = await db.clip.create({
        data: {
          userId: dbUserId,
          streamId,
          title: `Clip ${i + 1} from ${stream.title || 'Untitled'}`,
          startOffset: i * 60,
          endOffset: (i + 1) * 60,
          status: 'queued',
          category: parsed.data.categoryFilter?.[0] || 'highlight',
        },
      });
      placeholderClips.push(clip);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          clips: placeholderClips,
          streamId,
          status: 'generating_clips',
          estimatedClips: clipCount,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    console.error('[Clips API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
