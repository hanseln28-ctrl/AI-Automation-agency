export const dynamic = "force-dynamic";

// GET /api/captions/[id] — Get caption details
// PATCH /api/captions/[id] — Update caption style

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const updateCaptionSchema = z.object({
  style: z.enum(['kinetic', 'minimal', 'bold', 'emoji', 'custom']).optional(),
  language: z.string().min(2).max(5).optional(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']).optional(),
  captionUrl: z.string().url().optional(),
  content: z.string().optional(),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

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
    const caption = await db.caption.findUnique({
      where: { id },
      include: { clip: { select: { userId: true } } },
    });

    if (!caption || caption.clip.userId !== dbUserId) {
      return NextResponse.json(
        { success: false, error: 'Caption not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: caption });
  } catch (error) {
    console.error('[Caption API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

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
    const caption = await db.caption.findUnique({
      where: { id },
      include: { clip: { select: { userId: true } } },
    });

    if (!caption || caption.clip.userId !== dbUserId) {
      return NextResponse.json(
        { success: false, error: 'Caption not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updateCaptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await db.caption.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Caption API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
