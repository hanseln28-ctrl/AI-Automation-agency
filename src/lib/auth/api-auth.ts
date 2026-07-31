import { cookies } from 'next/headers';

/**
 * Returns the Clerk userId from the __session cookie using Clerk's backend API.
 * Does NOT require clerkMiddleware() — works in any route handler.
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('__session')?.value;
    if (!sessionToken) return null;

    // Use Clerk's backend to verify the session token
    const { verifyToken } = await import('@clerk/backend');
    const { data } = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    return data.sub ?? null;
  } catch {
    return null;
  }
}
