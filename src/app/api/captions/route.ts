export const dynamic = "force-dynamic";

// GET /api/captions — List captions for a clip
// POST /api/captions — Generate captions for a clip

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

// ── Validation ──

const listCaptionsQuerySchema = z.object({
  clipId: z.string().uuid(),
});

const generateCaptionsSchema = z.object({
  clipId: z.string().uuid(),
  language: z.string().default('en'),
  format: z.enum(['srt', 'vtt', 'ass', 'burned_in']).default('srt'),
  style: z.enum(['kinetic', 'minimal', 'bold', 'emoji', 'custom']).default('kinetic'),
  burnIn: z.boolean().default(false),
});

// ── Helper ──

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

// ── GET /api/captions ──

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
    const query = listCaptionsQuerySchema.safeParse(
      Object.fromEntries(url.searchParams),
    );

    if (!query.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'clipId is required',
          code: 'VALIDATION_ERROR',
          details: query.error.flatten(),
        },
        { status: 400 },
      );
    }

    // Verify clip ownership
    const clip = await db.clip.findFirst({
      where: { id: query.data.clipId, userId: dbUserId, deletedAt: null },
    });

    if (!clip) {
      return NextResponse.json(
        { success: false, error: 'Clip not found', code: 'CLIP_NOT_FOUND' },
        { status: 404 },
      );
    }

    const captions = await db.caption.findMany({
      where: { clipId: query.data.clipId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: captions });
  } catch (error) {
    console.error('[Captions API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

// ── POST /api/captions ──

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
    const parsed = generateCaptionsSchema.safeParse(body);

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

    // Create caption record (AI generation would happen async via BullMQ)
    const caption = await db.caption.create({
      data: {
        clipId: parsed.data.clipId,
        language: parsed.data.language,
        format: parsed.data.format,
        style: parsed.data.style,
        isBurnedIn: parsed.data.burnIn,
        status: 'queued',
        aiModel: 'gpt-4o',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: caption,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Captions API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
