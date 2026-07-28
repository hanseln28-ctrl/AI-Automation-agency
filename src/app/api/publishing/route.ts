// GET /api/publishing — List scheduled posts
// POST /api/publishing — Schedule a post

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const listPublishingQuerySchema = z.object({
  status: z.string().optional(),
  platform: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const schedulePostSchema = z.object({
  clipId: z.string().uuid(),
  socialAccountId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(2200).optional(),
  hookId: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().url().optional(),
  scheduledFor: z.string().datetime().optional(),
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
    const query = listPublishingQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!query.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', code: 'VALIDATION_ERROR', details: query.error.flatten() },
        { status: 400 },
      );
    }

    const { status, platform, cursor, limit } = query.data;

    const where: Record<string, unknown> = { userId: dbUserId };
    if (status) where.status = status;
    if (platform) where.platform = platform;

    const posts = await db.scheduledPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        clip: { select: { id: true, title: true, thumbnailUrl: true } },
        socialAccount: { select: { id: true, platform: true, platformUsername: true } },
      },
    });

    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1]?.id : undefined;

    return NextResponse.json({
      success: true,
      data,
      pagination: { nextCursor, hasMore, limit },
    });
  } catch (error) {
    console.error('[Publishing API] GET error:', error);
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
    const parsed = schedulePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Verify clip ownership
    const clip = await db.clip.findFirst({
      where: { id: parsed.data.clipId, userId: dbUserId, deletedAt: null },
    });
    if (!clip) {
      return NextResponse.json(
        { success: false, error: 'Clip not found', code: 'CLIP_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Verify social account ownership
    const socialAccount = await db.socialAccount.findFirst({
      where: { id: parsed.data.socialAccountId, userId: dbUserId },
    });
    if (!socialAccount) {
      return NextResponse.json(
        { success: false, error: 'Social account not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Verify hook belongs to clip if provided
    if (parsed.data.hookId) {
      const hook = await db.clipHook.findFirst({
        where: { id: parsed.data.hookId, clipId: parsed.data.clipId },
      });
      if (!hook) {
        return NextResponse.json(
          { success: false, error: 'Hook not found for this clip', code: 'VALIDATION_ERROR' },
          { status: 400 },
        );
      }
    }

    const post = await db.scheduledPost.create({
      data: {
        userId: dbUserId,
        clipId: parsed.data.clipId,
        socialAccountId: parsed.data.socialAccountId,
        platform: socialAccount.platform,
        title: parsed.data.title,
        description: parsed.data.description,
        hookId: parsed.data.hookId,
        tags: parsed.data.tags,
        thumbnailUrl: parsed.data.thumbnailUrl,
        status: parsed.data.scheduledFor ? 'scheduled' : 'queued',
        scheduledFor: parsed.data.scheduledFor ? new Date(parsed.data.scheduledFor) : null,
      },
    });

    return NextResponse.json(
      { success: true, data: post },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Publishing API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
