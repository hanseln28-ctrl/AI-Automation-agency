'use client';

import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps content behind authentication.
 * - While auth state is loading: renders a loading skeleton
 * - If not authenticated: redirects to /sign-in
 * - If authenticated: renders children
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading skeleton while Clerk resolves auth state
  if (!isLoaded) {
    return (
      fallback ?? (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="w-full max-w-2xl space-y-6">
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="skeleton h-8 w-48" />
              <div className="skeleton h-4 w-72" />
            </div>

            {/* Card skeletons */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background-card/60 p-4 backdrop-blur-xl"
                >
                  <div className="skeleton mb-3 h-32 w-full rounded-lg" />
                  <div className="skeleton mb-2 h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-xl border border-border bg-background-card/60 p-4 backdrop-blur-xl">
              <div className="skeleton mb-4 h-10 w-full rounded-lg" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-center gap-4">
                  <div className="skeleton h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton mb-1 h-4 w-1/3" />
                    <div className="skeleton h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    );
  }

  // Redirecting — show nothing while navigation happens
  if (!isSignedIn) {
    return null;
  }

  // Authenticated — render children
  return <>{children}</>;
}
