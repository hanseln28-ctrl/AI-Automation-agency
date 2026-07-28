'use server';

// ── Publishing Server Actions ──

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/prisma';
import { getAuthUserId } from '@/lib/auth/server';

export async function schedulePost(data: {
  clipId: string;
  socialAccountId: string;
  title: string;
  description?: string;
  hookId?: string;
  tags?: string[];
  thumbnailUrl?: string;
  scheduledFor?: string;
}) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  // Verify clip ownership
  const clip = await db.clip.findFirst({
    where: { id: data.clipId, userId, deletedAt: null },
  });
  if (!clip) throw new Error('Clip not found');

  // Verify social account ownership
  const socialAccount = await db.socialAccount.findFirst({
    where: { id: data.socialAccountId, userId },
  });
  if (!socialAccount) throw new Error('Social account not found');

  // Verify hook if provided
  if (data.hookId) {
    const hook = await db.clipHook.findFirst({
      where: { id: data.hookId, clipId: data.clipId },
    });
    if (!hook) throw new Error('Hook not found for this clip');
  }

  const post = await db.scheduledPost.create({
    data: {
      userId,
      clipId: data.clipId,
      socialAccountId: data.socialAccountId,
      platform: socialAccount.platform,
      title: data.title,
      description: data.description,
      hookId: data.hookId,
      tags: data.tags || [],
      thumbnailUrl: data.thumbnailUrl,
      status: data.scheduledFor ? 'scheduled' : 'queued',
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
    },
  });

  revalidatePath('/publishing');
  return post;
}

export async function deletePost(postId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const post = await db.scheduledPost.findFirst({
    where: { id: postId, userId },
  });

  if (!post) throw new Error('Post not found');

  await db.scheduledPost.update({
    where: { id: postId },
    data: { status: 'cancelled' },
  });

  revalidatePath('/publishing');
}

export async function retryPost(postId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const post = await db.scheduledPost.findFirst({
    where: { id: postId, userId },
  });

  if (!post) throw new Error('Post not found');
  if (post.status !== 'failed') throw new Error('Only failed posts can be retried');

  const updated = await db.scheduledPost.update({
    where: { id: postId },
    data: { status: 'queued', errorMessage: null },
  });

  revalidatePath('/publishing');
  return updated;
}

export async function publishNow(postId: string) {
  const userId = await getAuthUserId();
  if (!userId) throw new Error('Authentication required');

  const post = await db.scheduledPost.findFirst({
    where: { id: postId, userId },
  });

  if (!post) throw new Error('Post not found');

  const updated = await db.scheduledPost.update({
    where: { id: postId },
    data: { status: 'queued', scheduledFor: null },
  });

  revalidatePath('/publishing');
  return updated;
}
