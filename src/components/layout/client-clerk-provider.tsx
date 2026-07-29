'use client';

import { ClerkProvider } from '@clerk/nextjs';

const PUBLISHABLE_KEY = 'pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2JA';

export function ClientClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );
}
