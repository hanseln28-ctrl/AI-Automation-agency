import { clerkMiddleware } from '@clerk/nextjs/server';

// clerkMiddleware() sets up the auth context that auth() reads in route handlers.
// Without this, auth() in API routes always returns { userId: null }.
// We don't add route protection here — each route/API handler guards itself via auth().
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
