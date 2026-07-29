export const dynamic = "force-dynamic";

// PATCH /api/publishing/[id] — Update scheduled post
// DELETE /api/publishing/[id] — Cancel scheduled post

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2200).optional(),
  tags: z.array(z.string()).optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
  status: z.enum(['scheduled', 'queued', 'uploading', 'processing', 'published', 'failed', 'cancelled']).optional(),
  platformPostId: z.string().optional(),
  platformPostUrl: z.string().url().optional(),
  errorMessage: z.string().optional(),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
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
    const post = await db.scheduledPost.findFirst({
      where: { id, userId: dbUserId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = updatePostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.scheduledFor !== undefined) {
      updateData.scheduledFor = parsed.data.scheduledFor
        ? new Date(parsed.data.scheduledFor)
        : null;
    }

    const updated = await db.scheduledPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Publishing API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

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
    const post = await db.scheduledPost.findFirst({
      where: { id, userId: dbUserId },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    // Cancel the post (don't hard-delete)
    await db.scheduledPost.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[Publishing API] DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
