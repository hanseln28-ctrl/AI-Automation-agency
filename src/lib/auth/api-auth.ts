import { cookies } from 'next/headers';

/**
 * Returns the Clerk userId from the __session cookie by calling Clerk's REST API directly.
 * Does NOT require clerkMiddleware(), auth(), or any Clerk SDK functions.
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('__session')?.value;
    if (!sessionToken) return null;

    // Call Clerk's API directly with the session token
    const res = await fetch('https://api.clerk.dev/v1/me', {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!res.ok) return null;
    
    const user = await res.json();
    return user.id ?? null;
  } catch {
    return null;
  }
}
