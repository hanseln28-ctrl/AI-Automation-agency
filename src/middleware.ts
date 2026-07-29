import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes — no auth required
const PUBLIC_PATH_PREFIXES = [
  '/sign-in',
  '/sign-up',
  '/oauth',
  '/api/webhooks',
];

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes — let through immediately, no Clerk overhead
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Protected routes — try auth, fail gracefully
  try {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  } catch {
    // Clerk unavailable — redirect to sign-in
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
