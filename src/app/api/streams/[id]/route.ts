export const dynamic = "force-dynamic";

// GET /api/streams/[id] — Get stream details
// PATCH /api/streams/[id] — Update stream metadata
// DELETE /api/streams/[id] — Soft-delete stream

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

// ── Validation ──

const updateStreamSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  gameOrCategory: z.string().max(100).optional(),
  status: z
    .enum([
      'importing',
      'imported',
      'transcribing',
      'analyzing',
      'generating_clips',
      'completed',
      'failed',
    ])
    .optional(),
  progressPct: z.number().int().min(0).max(100).optional(),
  errorMessage: z.string().optional(),
});

// ── Helper: get user by clerkId ──

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

// ── GET /api/streams/[id] ──

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
    const stream = await db.stream.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
      include: {
        clips: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { clips: true } },
      },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: 'Stream not found', code: 'STREAM_NOT_FOUND' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: stream });
  } catch (error) {
    console.error('[Stream API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── PATCH /api/streams/[id] ──

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
    const parsed = updateStreamSchema.safeParse(body);

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

    const stream = await db.stream.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: 'Stream not found', code: 'STREAM_NOT_FOUND' },
        { status: 404 },
      );
    }

    const updated = await db.stream.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Stream API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── DELETE /api/streams/[id] ──

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
    const stream = await db.stream.findFirst({
      where: { id, userId: dbUserId, deletedAt: null },
    });

    if (!stream) {
      return NextResponse.json(
        { success: false, error: 'Stream not found', code: 'STREAM_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Soft delete
    await db.stream.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[Stream API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
