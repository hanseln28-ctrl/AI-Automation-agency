// GET /api/streams — List user's streams
// POST /api/streams — Create/import a new stream

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

// ── Validation Schemas ──

const createStreamSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  source: z.enum(['twitch', 'kick', 'youtube', 'manual_upload']),
  sourceUrl: z.string().url().optional(),
  sourceId: z.string().optional(),
  gameOrCategory: z.string().max(100).optional(),
  durationSeconds: z.number().int().positive().optional(),
});

const listStreamsQuerySchema = z.object({
  status: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ── GET /api/streams ──

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const query = listStreamsQuerySchema.safeParse(
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

    const { status, cursor, limit } = query.data;

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const where: Record<string, unknown> = {
      userId: user.id,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    const streams = await db.stream.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        _count: { select: { clips: true } },
      },
    });

    const hasMore = streams.length > limit;
    const data = hasMore ? streams.slice(0, limit) : streams;
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
    console.error('[Streams API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── POST /api/streams ──

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required', code: 'AUTHENTICATION_REQUIRED' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createStreamSchema.safeParse(body);

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

    const user = await db.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Check clip limits
    if (user.clipsUsedThisMonth >= user.clipsLimit) {
      return NextResponse.json(
        {
          success: false,
          error: 'Monthly clip generation limit reached. Upgrade your plan.',
          code: 'CLIP_LIMIT_EXCEEDED',
        },
        { status: 403 },
      );
    }

    const stream = await db.stream.create({
      data: {
        userId: user.id,
        title: parsed.data.title || 'Untitled Stream',
        source: parsed.data.source,
        sourceUrl: parsed.data.sourceUrl,
        sourceId: parsed.data.sourceId,
        gameOrCategory: parsed.data.gameOrCategory,
        durationSeconds: parsed.data.durationSeconds,
        status: 'importing',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: stream,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Streams API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
