'use client';

import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState } from 'react';

function ClerkStatus() {
  const [error, setError] = useState<string | null>(null);

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#12121A] p-8">
      <h1 className="mb-8 text-2xl font-bold text-white">Clerk Standalone Test</h1>
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-400">✅ Clerk is working — you are signed in!</p>
          <UserButton afterSignOutUrl="/test-clerk" />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="w-full max-w-md">
          <SignIn
            routing="hash"
            signUpUrl="/test-clerk#/sign-up"
            appearance={{
              variables: {
                colorPrimary: '#6C5CE7',
                colorBackground: '#12121A',
                colorText: '#FAFAFA',
                colorTextSecondary: '#A1A1AA',
                colorInputBackground: '#1A1A24',
                colorInputText: '#FAFAFA',
              },
            }}
          />
        </div>
      </SignedOut>
    </div>
  );
}

export default function TestClerkPage() {
  return (
    <ClerkProvider publishableKey="pk_test_dml0YWwtbWFuLTMuY2xlcmsuYWNjb3VudHMuZGV2">
      <ClerkStatus />
    </ClerkProvider>
  );
}
