export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll().map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' }));
  const sessionCookie = cookieStore.get('__session')?.value;

  let verifyResult = null;
  let verifyError = null;

  if (sessionCookie) {
    try {
      const { verifyToken } = await import('@clerk/backend');
      const result = await verifyToken(sessionCookie, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const data = result.data as { sub?: string } | null;
      verifyResult = { sub: data?.sub ?? null, hasData: !!data };
    } catch (err) {
      verifyError = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    cookieCount: allCookies.length,
    cookies: allCookies,
    hasSessionCookie: !!sessionCookie,
    verifyResult,
    verifyError,
  });
}
