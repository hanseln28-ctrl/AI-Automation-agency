import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes — no auth required
const PUBLIC_PREFIXES = [
  '/sign-in',
  '/sign-up',
  '/oauth',
  '/api/webhooks',
  '/api/debug-env',
];

function isPublic(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Protected route — check for Clerk session cookie
  const hasSession = req.cookies.has('__session');

  if (!hasSession) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
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
