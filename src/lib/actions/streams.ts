'use server';

// ── Stream Server Actions ──

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/prisma';
import { getAuthUserId } from '@/lib/auth/server';

export async function createStream(data: {
  title?: string;
  source: string;
  sourceUrl?: string;
  gameOrCategory?: string;
  durationSeconds?: number;
}) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  if (user.clipsUsedThisMonth >= user.clipsLimit) {
    throw new Error('Monthly clip limit reached. Upgrade your plan.');
  }

  const stream = await db.stream.create({
    data: {
      userId,
      title: data.title || 'Untitled Stream',
      source: data.source,
      sourceUrl: data.sourceUrl,
      gameOrCategory: data.gameOrCategory,
      durationSeconds: data.durationSeconds,
      status: 'importing',
    },
  });

  revalidatePath('/streams');
  return stream;
}

export async function deleteStream(streamId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const stream = await db.stream.findFirst({
    where: { id: streamId, userId, deletedAt: null },
  });

  if (!stream) throw new Error('Stream not found');

  await db.stream.update({
    where: { id: streamId },
    data: { deletedAt: new Date() },
  });

  revalidatePath('/streams');
  revalidatePath(`/streams/${streamId}`);
}

export async function reprocessStream(streamId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const stream = await db.stream.findFirst({
    where: { id: streamId, userId, deletedAt: null },
  });

  if (!stream) throw new Error('Stream not found');

  await db.stream.update({
    where: { id: streamId },
    data: { status: 'importing', progressPct: 0, errorMessage: null },
  });

  revalidatePath(`/streams/${streamId}`);
}

export async function getStream(streamId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  return db.stream.findFirst({
    where: { id: streamId, userId, deletedAt: null },
    include: {
      clips: {
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}
