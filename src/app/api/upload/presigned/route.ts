export const dynamic = 'force-dynamic';

// POST /api/upload/presigned — Generate a presigned URL for direct R2 upload
// Accepts JSON body: { fileName: string, contentType: string, title?: string }

import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserId } from '@/lib/auth/api-auth';
import { db } from '@/lib/db/prisma';
import { getPresignedUploadUrl, getPublicUrl } from '@/lib/storage/r2';

const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

function generateKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/${timestamp}-${sanitized}`;
}

export async function POST(request: NextRequest) {
  // ── 1. Auth ──
  const userId = await getAuthUserId(request);

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
  let body: { fileName?: string; contentType?: string; title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid JSON body. Expected { fileName, contentType, title? }',
        code: 'INVALID_FORMAT',
      },
      { status: 400 },
    );
  }

  const { fileName, contentType, title } = body;

  if (!fileName || typeof fileName !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing or invalid "fileName" field.',
        code: 'FILE_NAME_REQUIRED',
      },
      { status: 400 },
    );
  }

  if (!contentType || typeof contentType !== 'string') {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing or invalid "contentType" field.',
        code: 'CONTENT_TYPE_REQUIRED',
      },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      {
        success: false,
        error: `Unsupported file type "${contentType}". Allowed: MP4, MOV, WEBM.`,
        code: 'INVALID_FILE_TYPE',
      },
      { status: 415 },
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

  // ── 4. Generate presigned URL ──
  const key = generateKey(userId, fileName);

  try {
    const presignedUrl = await getPresignedUploadUrl(key, contentType);
    const publicUrl = getPublicUrl(key);

    return NextResponse.json(
      {
        success: true,
        data: {
          presignedUrl,
          key,
          publicUrl,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown R2 error';
    console.error('[Presigned API] R2 presigned URL error:', message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate upload URL. Please try again.',
        code: 'PRESIGNED_URL_FAILED',
      },
      { status: 502 },
    );
  }
}
