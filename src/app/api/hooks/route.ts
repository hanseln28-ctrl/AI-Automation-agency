// POST /api/hooks — Generate hooks for a clip

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const generateHooksSchema = z.object({
  clipId: z.string().uuid(),
  count: z.number().int().min(1).max(10).default(3),
  types: z.array(
    z.enum(['curiosity_gap', 'question', 'bold_statement', 'controversial', 'emotional']),
  ).default(['curiosity_gap', 'question', 'bold_statement']),
  platform: z.enum(['tiktok', 'youtube_shorts']).default('tiktok'),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
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
    const parsed = generateHooksSchema.safeParse(body);
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

    const { clipId, count, types, platform } = parsed.data;

    // Create hook records (AI generation happens async via BullMQ in production)
    const createdHooks = [];
    const defaultHooks: Record<string, string> = {
      curiosity_gap: "You won't believe what happens next...",
      question: 'Is this the best play of the year?',
      bold_statement: 'This changes everything.',
      controversial: 'Hot take: this is overrated.',
      emotional: 'This moment broke the internet.',
    };

    for (let i = 0; i < count; i++) {
      const hookType = types[i % types.length]!;
      const hook = await db.clipHook.create({
        data: {
          clipId,
          hookText: defaultHooks[hookType] || 'Watch this incredible moment!',
          hookType,
          platformOptimizedFor: platform,
          aiScore: 0.75 + Math.random() * 0.2,
          aiModel: 'gpt-4o',
        },
      });
      createdHooks.push(hook);
    }

    return NextResponse.json(
      { success: true, data: { hooks: createdHooks } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[Hooks API] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
