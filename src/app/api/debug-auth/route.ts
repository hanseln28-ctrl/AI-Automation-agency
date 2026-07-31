export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }));
  const sessionCookie = cookieStore.get('__session')?.value;

  return NextResponse.json({
    cookieCount: allCookies.length,
    cookies: allCookies,
    hasSessionCookie: !!sessionCookie,
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => ({ name: c.name }));

  let clerkUserId: string | null = null;
  let clerkError: string | null = null;

  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    try {
      const res = await fetch('https://api.clerk.dev/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const user = await res.json();
        clerkUserId = user.id ?? null;
      } else {
        clerkError = `Clerk API returned ${res.status}: ${await res.text()}`;
      }
    } catch (err) {
      clerkError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    hasAuthHeader: !!authHeader,
    authHeaderPreview: authHeader ? authHeader.substring(0, 30) + '...' : null,
    clerkUserId,
    clerkError,
    cookies: allCookies,
  });
}
