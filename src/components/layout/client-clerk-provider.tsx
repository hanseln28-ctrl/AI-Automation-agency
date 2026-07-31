'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// Using the key exactly as shown in Clerk dashboard, including trailing $
const PUBLISHABLE_KEY = 'pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2JA';

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
      routing="hash"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
