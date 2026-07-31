import { type NextRequest } from 'next/server';

/**
 * Returns the Clerk userId by:
 * 1. First trying the Authorization header (Bearer token from client's useAuth().getToken())
 * 2. Then trying the __session cookie directly from the request
 * Does NOT require clerkMiddleware().
 */
export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  // Method 1: Authorization header (from client useAuth().getToken())
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token && token !== 'null' && token !== 'undefined') {
      try {
        const res = await fetch('https://api.clerk.dev/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          if (user.id) return user.id;
        }
      } catch {
        // Fall through to cookie method
      }
    }
  }

  // Method 2: __session cookie from request (works if clerkMiddleware is present)
  try {
    const sessionToken = request.cookies.get('__session')?.value;
    if (sessionToken) {
      const res = await fetch('https://api.clerk.dev/v1/me', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      if (res.ok) {
        const user = await res.json();
        if (user.id) return user.id;
      }
    }
  } catch {
    // Fall through
  }

  return null;
}
