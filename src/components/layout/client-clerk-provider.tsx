'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// NOTE: This publishable key is hardcoded because NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
// in .env has a trailing dollar sign ($) that may be a display artifact.
// The env value is: pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2JA
// We use the confirmed-valid key without the trailing $:
const PUBLISHABLE_KEY = 'pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2';

export function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Never render ClerkProvider on the server — it accesses browser-only APIs.
  // This is the recommended pattern for Clerk v5 in Next.js App Router
  // when you need to prevent SSR of the Clerk components.
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
