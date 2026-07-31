export const dynamic = 'force-dynamic';

// POST /api/upload — Upload a video file to Cloudflare R2
// Accepts multipart/form-data with a "file" field and optional "title" field.

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db/prisma';
import { uploadFile } from '@/lib/storage/r2';

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10 GB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

function generateKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/${timestamp}-${sanitized}`;
}

export async function POST(request: NextRequest) {
  let userId: string | null = null;

  // ── 1. Auth (graceful) ──
  try {
    const session = await auth();
    userId = session.userId ?? null;
  } catch (err) {
    console.error('[Upload API] Auth error:', err);
    // Continue — we'll require auth below
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

  // ── 2. Parse multipart ──
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid form data. Expected multipart/form-data.',
        code: 'INVALID_FORMAT',
      },
      { status: 400 },
    );
  }

  const file = formData.get('file');
  const title = formData.get('title');

  // ── 3. Validate file ──
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      {
        success: false,
        error: 'No file provided. Include a "file" field in the form data.',
        code: 'FILE_REQUIRED',
      },
      { status: 400 },
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'File is empty.',
        code: 'FILE_EMPTY',
      },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        success: false,
        error: `File too large. Maximum size is 10 GB (${(MAX_FILE_SIZE / (1024**3)).toFixed(0)} GB).`,
        code: 'FILE_TOO_LARGE',
      },
      { status: 413 },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      {
        success: false,
        error: `Unsupported file type "${file.type}". Allowed: MP4, MOV, WEBM.`,
        code: 'INVALID_FILE_TYPE',
      },
      { status: 415 },
    );
  }

  // ── 4. Lookup user ──
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

  // ── 5. Generate key & upload to R2 ──
  const streamTitle =
    typeof title === 'string' && title.trim()
      ? title.trim()
      : file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  const key = generateKey(userId, file.name);

  let r2Result: { key: string; url: string };
  try {
    r2Result = await uploadFile(file, key);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown R2 error';
    console.error('[Upload API] R2 upload error:', message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload file to storage. Please try again.',
        code: 'STORAGE_UPLOAD_FAILED',
      },
      { status: 502 },
    );
  }

  // ── 6. Create Stream record ──
  try {
    const stream = await db.stream.create({
      data: {
        userId: user.id,
        title: streamTitle,
        source: 'upload',
        sourceUrl: r2Result.url,
        rawVodUrl: r2Result.url,
        status: 'uploaded',
        fileSizeBytes: BigInt(file.size),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: stream,
      },
      { status: 201 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown DB error';
    console.error('[Upload API] DB create error:', message);

    // Don't delete the R2 file on DB failure — it's better to have an orphan
    // than to lose the upload. A background job can clean up later.

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
