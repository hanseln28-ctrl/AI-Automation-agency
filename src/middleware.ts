import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * We don't use clerkMiddleware() because it crashes with MIDDLEWARE_INVOCATION_FAILED on Vercel.
 * Instead, auth is handled by each API route individually via the Authorization header.
 * This middleware simply passes all requests through.
 */
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
