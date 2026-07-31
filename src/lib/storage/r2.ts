import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ── Configuration ──

function getR2Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      'Missing R2 configuration. Ensure CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, ' +
        'CLOUDFLARE_R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME are set.',
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

let _client: S3Client | null = null;
let _config: ReturnType<typeof getR2Config> | null = null;

function getClient(): S3Client {
  const config = getR2Config();

  // Recreate client if config changed (e.g. env reload)
  if (_client && _config && _config.accountId === config.accountId) {
    return _client;
  }

  _config = config;
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true,
  });

  return _client;
}

function getBucket(): string {
  if (_config) return _config.bucketName;
  return getR2Config().bucketName;
}

// ── Public URL Builder ──

/**
 * Builds the public URL for an object in R2.
 *
 * If R2_PUBLIC_DOMAIN is set (custom domain or R2.dev domain), uses that.
 * Otherwise falls back to the direct R2 endpoint:
 *   https://{bucket}.{accountId}.r2.cloudflarestorage.com/{key}
 */
export function getPublicUrl(key: string): string {
  const customDomain = process.env.R2_PUBLIC_DOMAIN;
  if (customDomain) {
    const base = customDomain.replace(/\/+$/, '');
    return `${base}/${key}`;
  }

  const config = _config ?? getR2Config();
  return `https://${config.bucketName}.${config.accountId}.r2.cloudflarestorage.com/${key}`;
}

// ── Presigned URL ──

/**
 * Generates a presigned URL for uploading an object directly to R2.
 * The browser uploads directly to this URL — bypassing Vercel's 4.5MB
 * serverless body limit entirely.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const client = getClient();
  const bucket = getBucket();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

// ── Upload ──

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export interface UploadOptions {
  /** Content-Type override (defaults to video/mp4) */
  contentType?: string;
  /** Called with progress updates */
  onProgress?: (progress: UploadProgress) => void;
}

/**
 * Uploads a file buffer/stream to R2 using multipart upload for large files.
 * Returns the R2 key that was written.
 */
export async function uploadToR2(
  body: Buffer | Uint8Array | ReadableStream | Blob,
  key: string,
  options: UploadOptions = {},
): Promise<string> {
  const client = getClient();
  const bucket = getBucket();

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: body instanceof Blob ? new Uint8Array(await (body as Blob).arrayBuffer()) : body,
      ContentType: options.contentType ?? 'video/mp4',
    },
    // Leave part size at default (5 MB) — works well for up to 10 GB
    // queueSize: 4, // concurrent parts
  });

  // Track progress via the Upload's internal events
  if (options.onProgress) {
    upload.on('httpUploadProgress', (progress) => {
      if (progress.total) {
        options.onProgress?.({
          loaded: progress.loaded ?? 0,
          total: progress.total,
          percent: Math.round(((progress.loaded ?? 0) / progress.total) * 100),
        });
      }
    });
  }

  await upload.done();

  return key;
}

// ── Delete ──

/**
 * Deletes an object from R2 by key. Returns true if deleted, false if not found.
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  const client = getClient();
  const bucket = getBucket();

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    // If the object doesn't exist, DeleteObject still returns 204 — no error.
    // R2 errors for missing objects only manifest via HeadObject-checking.
    console.error('[R2] Delete error:', error);
    throw error;
  }
}

// ── Exists Check ──

/**
 * Checks if an object exists in R2.
 */
export async function objectExists(key: string): Promise<boolean> {
  const client = getClient();
  const bucket = getBucket();

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name: string }).name === 'NotFound'
    ) {
      return false;
    }
    throw error;
  }
}

// ── Convenience: Upload File Buffer ──

/**
 * Uploads a File (from the browser FormData) to R2.
 * Converts the File to ArrayBuffer, uploads, and returns the public URL.
 */
export async function uploadFile(
  file: File,
  key: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<{ key: string; url: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  await uploadToR2(buffer, key, {
    contentType: file.type || 'video/mp4',
    onProgress,
  });
  const url = getPublicUrl(key);
  return { key, url };
}
