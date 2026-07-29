'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-background-card p-8 text-center">
          <h2 className="mb-2 text-lg font-semibold text-text-primary">Auth Not Configured</h2>
          <p className="text-sm text-text-secondary">
            Clerk environment variables are not set. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your Vercel environment variables and redeploy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
