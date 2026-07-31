import { type NextRequest } from 'next/server';

/**
 * Returns the Clerk userId from the Authorization header by calling Clerk's REST API directly.
 * Client must send `Authorization: Bearer <clerk-session-token>`.
 * Does NOT require clerkMiddleware(), auth(), or any Clerk SDK server functions.
 */
export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;

    // Call Clerk's API directly to verify the token
    const res = await fetch('https://api.clerk.dev/v1/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const user = await res.json();
    return user.id ?? null;
  } catch {
    return null;
  }
}
