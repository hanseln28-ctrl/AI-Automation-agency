import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes are public (no auth required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/oauth(.*)',
  '/api/webhooks/(.*)',
]);

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/streams(.*)',
  '/clips(.*)',
  '/captions(.*)',
  '/publishing(.*)',
  '/publisher(.*)',
  '/analytics(.*)',
  '/sponsorships(.*)',
  '/revenue(.*)',
  '/community(.*)',
  '/settings(.*)',
  '/admin(.*)',
  '/api/((?!webhooks).)*', // Protect all API routes except webhooks
]);

// Define admin-only routes
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Skip auth entirely for public routes
  if (isPublicRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();

    // Additional admin check
    if (isAdminRoute(req)) {
      const { sessionClaims } = await auth();
      const role = (sessionClaims?.metadata as { role?: string })?.role;
      if (role !== 'admin') {
        return new Response('Forbidden', { status: 403 });
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
