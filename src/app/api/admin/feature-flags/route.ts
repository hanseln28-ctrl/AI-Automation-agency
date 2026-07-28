// GET /api/admin/feature-flags — List feature flags (admin only)
// PATCH /api/admin/feature-flags — Toggle/modify feature flags

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { z } from 'zod';

const updateFeatureFlagSchema = z.object({
  id: z.string().uuid(),
  isEnabled: z.boolean().optional(),
  rolloutPct: z.number().int().min(0).max(100).optional(),
  allowedTiers: z.array(z.string()).optional(),
  allowedUserIds: z.array(z.string()).optional(),
  description: z.string().optional(),
});

async function getUserId(clerkId: string): Promise<string | null> {
  const user = await db.user.findUnique({ where: { clerkId } });
  return user?.id ?? null;
}

async function isAdmin(dbUserId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: dbUserId },
    select: { tier: true },
  });
  return user?.tier === 'enterprise';
}

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

    const admin = await isAdmin(dbUserId);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 },
      );
    }

    const flags = await db.featureFlag.findMany({
      orderBy: { flagKey: 'asc' },
    });

    return NextResponse.json({ success: true, data: flags });
  } catch (error) {
    console.error('[Admin Feature Flags API] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const admin = await isAdmin(dbUserId);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const parsed = updateFeatureFlagSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id, ...updateData } = parsed.data;

    const flag = await db.featureFlag.findUnique({ where: { id } });
    if (!flag) {
      return NextResponse.json(
        { success: false, error: 'Feature flag not found', code: 'RESOURCE_NOT_FOUND' },
        { status: 404 },
      );
    }

    const updated = await db.featureFlag.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Admin Feature Flags API] PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
