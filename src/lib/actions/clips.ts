'use server';

// ── Clip Server Actions ──

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/prisma';
import { getAuthUserId } from '@/lib/auth/server';

export async function generateClips(data: {
  streamId: string;
  clipCount?: number;
  durationRange?: [number, number];
  captionStyle?: string;
  hookVariants?: number;
  platformTargets?: string[];
  categoryFilter?: string[];
}) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const { streamId, clipCount = 10 } = data;

  // Verify stream ownership
  const stream = await db.stream.findFirst({
    where: { id: streamId, userId, deletedAt: null },
  });
  if (!stream) throw new Error('Stream not found');

  // Check limits
  const user = await db.user.findUnique({ where: { id: userId } });
  if (user && user.clipsUsedThisMonth + clipCount > user.clipsLimit) {
    throw new Error(
      `Clip limit exceeded. ${user.clipsLimit - user.clipsUsedThisMonth} remaining.`,
    );
  }

  // Update stream status
  await db.stream.update({
    where: { id: streamId },
    data: { status: 'generating_clips', progressPct: 0 },
  });

  // Create placeholder clips
  const clips = [];
  const count = Math.min(clipCount, 5); // Limit for safety
  for (let i = 0; i < count; i++) {
    const clip = await db.clip.create({
      data: {
        userId,
        streamId,
        title: `Clip ${i + 1} from ${stream.title || 'Untitled'}`,
        startOffset: i * 60,
        endOffset: (i + 1) * 60,
        status: 'queued',
        category: data.categoryFilter?.[0] || 'highlight',
      },
    });
    clips.push(clip);
  }

  revalidatePath('/clips');
  revalidatePath(`/streams/${streamId}`);

  return { clips, streamId, status: 'generating_clips', estimatedClips: clipCount };
}

export async function deleteClip(clipId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const clip = await db.clip.findFirst({
    where: { id: clipId, userId, deletedAt: null },
  });

  if (!clip) throw new Error('Clip not found');

  await db.clip.update({
    where: { id: clipId },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/clips');
  revalidatePath(`/clips/${clipId}`);
}

export async function updateClip(
  clipId: string,
  data: {
    title?: string;
    description?: string;
    tags?: string[];
    category?: string;
    status?: string;
  },
) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const clip = await db.clip.findFirst({
    where: { id: clipId, userId, deletedAt: null },
  });

  if (!clip) throw new Error('Clip not found');

  const updated = await db.clip.update({
    where: { id: clipId },
    data,
  });

  revalidatePath(`/clips/${clipId}`);
  return updated;
}

export async function approveClip(clipId: string) {
  return updateClip(clipId, { status: 'approved' });
}

export async function archiveClip(clipId: string) {
  return updateClip(clipId, { status: 'archived' });
}

export async function getClip(clipId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  return db.clip.findFirst({
    where: { id: clipId, userId, deletedAt: null },
    include: {
      stream: { select: { id: true, title: true } },
      captions: true,
      hooks: { orderBy: { aiScore: 'desc' } },
      scheduledPosts: {
        include: {
          socialAccount: { select: { platform: true, platformUsername: true } },
        },
      },
    },
  });
}
