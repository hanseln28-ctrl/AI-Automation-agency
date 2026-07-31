export const dynamic = 'force-dynamic';

// POST /api/upload/confirm — Confirm a completed R2 upload and create the Stream DB record
// Accepts JSON body: { key: string, title: string, fileSizeBytes: number }

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { objectExists, getPublicUrl } from '@/lib/storage/r2';

export async function POST(request: NextRequest) {
  // ── 1. Auth ──
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId ?? null;
  } catch (err) {
    console.error('[Confirm API] Auth error:', err);
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
      },
      { status: 401 },
    );
  }

  // ── 2. Parse JSON body ──
  let body: { key?: string; title?: string; fileSizeBytes?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON body. Expected { key, title, fileSizeBytes }',
        code: 'INVALID_FORMAT',
      },
      { status: 400 },
    );
  }

  const { key, title, fileSizeBytes } = body;

  if (!key || typeof key !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing or invalid "key" field.',
        code: 'KEY_REQUIRED',
      },
      { status: 400 },
    );
  }

  if (!title || typeof title !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing or invalid "title" field.',
        code: 'TITLE_REQUIRED',
      },
      { status: 400 },
    );
  }

  if (typeof fileSizeBytes !== 'number' || fileSizeBytes <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing or invalid "fileSizeBytes" field.',
        code: 'FILE_SIZE_REQUIRED',
      },
      { status: 400 },
    );
  }

  // ── 3. Lookup user ──
  const user = await db.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'User not found in database.',
        code: 'RESOURCE_NOT_FOUND',
      },
      { status: 404 },
    );
  }

  // ── 4. Verify the file exists in R2 ──
  try {
    const exists = await objectExists(key);
    if (!exists) {
      return NextResponse.json(
        {
          success: false,
          error: 'File not found in storage. The upload may not have completed successfully.',
          code: 'FILE_NOT_FOUND',
        },
        { status: 404 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown R2 error';
    console.error('[Confirm API] R2 objectExists error:', message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify file in storage. Please try again.',
        code: 'STORAGE_VERIFY_FAILED',
      },
      { status: 502 },
    );
  }

  // ── 5. Build public URL & create Stream record ──
  const publicUrl = getPublicUrl(key);

  try {
    const stream = await db.stream.create({
      data: {
        userId: user.id,
        title: title,
        source: 'upload',
        sourceUrl: publicUrl,
        rawVodUrl: publicUrl,
        status: 'uploaded',
        fileSizeBytes: BigInt(fileSizeBytes),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: stream.id,
          title: stream.title,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown DB error';
    console.error('[Confirm API] DB create error:', message);

    return NextResponse.json(
      {
        success: false,
        error: 'File uploaded but failed to create stream record. Please contact support.',
        code: 'DB_CREATE_FAILED',
      },
      { status: 500 },
    );
  }
}
