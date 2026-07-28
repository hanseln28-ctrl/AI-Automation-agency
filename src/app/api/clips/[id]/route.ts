// GET /api/clips/[id] — Get clip details
// PATCH /api/clips/[id] — Update clip metadata
// DELETE /api/clips/[id] — Soft-delete clip

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

// ── Validation ──

const updateClipSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  status: z
    .enum([
      'queued',
      'rendering',
      'rendered',
      'reviewing',
      'approved',
      'published',
      'failed',
      'archived',
    ])
    .optional(),
  aiScore: z.number().min(0).max(1).optional(),
});

// ── Helper ──

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

// ── GET /api/clips/[id] ──

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
    const clip = await db.clip.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
      include: {
        stream: { select: { id: true, title: true } },
        captions: true,
        hooks: { orderBy: { aiScore: 'desc' } },
        scheduledPosts: {
          include: { socialAccount: { select: { platform: true, platformUsername: true } } },
        },
      },
    });

    if (!clip) {
      return NextResponse.json(
        { success: false, error: 'Clip not found', code: 'CLIP_NOT_FOUND' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: clip });
  } catch (error) {
    console.error('[Clip API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── PATCH /api/clips/[id] ──

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
    const body = await request.json();
    const parsed = updateClipSchema.safeParse(body);

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

    const clip = await db.clip.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!clip) {
      return NextResponse.json(
        { success: false, error: 'Clip not found', code: 'CLIP_NOT_FOUND' },
        { status: 404 },
      );
    }

    const updated = await db.clip.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Clip API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── DELETE /api/clips/[id] ──

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
    const clip = await db.clip.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!clip) {
      return NextResponse.json(
        { success: false, error: 'Clip not found', code: 'CLIP_NOT_FOUND' },
        { status: 404 },
      );
    }

    await db.clip.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[Clip API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
