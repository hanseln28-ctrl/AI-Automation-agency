// Shared auth utility for server-side use
// Extracts the internal DB user ID from the Clerk session

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';

/**
 * Resolves the current authenticated user's internal database ID.
 * Returns null if not authenticated or user not found.
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolves the current authenticated user (full record).
 * Returns null if not authenticated or user not found.
 */
export async function getAuthUser() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    return db.user.findUnique({ where: { clerkId } });
  } catch {
    return null;
  }
}
