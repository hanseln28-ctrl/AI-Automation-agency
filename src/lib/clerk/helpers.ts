// Clerk auth helper utilities

import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db/prisma';
import type { SubscriptionTier } from '@/types';
import type { ClerkSessionClaims } from '@/types';

/** Tier priority map: higher index = more access */
const TIER_PRIORITY: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  agency: 3,
  enterprise: 4,
};

/**
 * Get the current user from Clerk session and match to database record.
 * Returns null if not authenticated or no matching database record.
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  return user;
}

/**
 * Ensure a database user record exists for the current Clerk session.
 * Creates one if it doesn't exist (synced from Clerk webhook or on first visit).
 */
export async function ensureUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId },
    });
  }

  return user;
}

/**
 * Check if the current user has the admin role.
 * Reads from Clerk session claims (unsafe metadata).
 */
export async function isAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims | null;
  const role = claims?.metadata?.role;
  return role === 'admin';
}

/**
 * Get the current user's subscription tier.
 * Reads from Clerk session claims metadata. Defaults to 'free'.
 */
export async function getUserTier(): Promise<SubscriptionTier> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as ClerkSessionClaims | null;
  const tier = claims?.metadata?.tier;
  return (tier as SubscriptionTier) ?? 'free';
}

/**
 * Check if current user's tier meets or exceeds the required tier.
 *
 * @example
 * if (await canAccess('pro')) {
 *   // user has pro, agency, or enterprise access
 * }
 */
export async function canAccess(requiredTier: SubscriptionTier): Promise<boolean> {
  const userTier = await getUserTier();
  const requiredPriority = TIER_PRIORITY[requiredTier];
  const userPriority = TIER_PRIORITY[userTier];
  return userPriority >= requiredPriority;
}
