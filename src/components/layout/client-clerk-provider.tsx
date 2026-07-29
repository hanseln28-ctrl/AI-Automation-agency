'use client';

import { ClerkProvider } from '@clerk/nextjs';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    // Clerk not configured — render app without auth (public pages only)
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
