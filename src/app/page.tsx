import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session.userId;
  } catch {
    // Clerk not configured — stay on landing page
  }

  // Redirect authenticated users to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-8 inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent shadow-glass">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-text-primary">
            IRON<span className="text-accent">Creator</span> OS
          </span>
        </div>

        {/* Hero */}
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Turn One Stream Into{' '}
          <span className="text-gradient">30+ Viral Clips</span>
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-text-secondary sm:text-xl">
          AI automatically detects viral moments, generates clips with captions and hooks,
          then publishes them across every social platform — all while you focus on creating.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center rounded-lg bg-accent px-8 font-medium text-white shadow-glass transition-all hover:bg-accent-hover hover:shadow-glass-lg active:scale-[0.98]"
          >
            Get Started Free
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-12 items-center rounded-lg border border-border bg-background-card px-8 font-medium text-text-primary transition-all hover:border-accent-subtle hover:bg-background-elevated"
          >
            Sign In
          </Link>
        </div>

        {/* Features teaser */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'AI Detection',
              description: 'GPT-4o finds viral moments automatically',
            },
            {
              title: 'Auto Captions',
              description: 'Kinetic captions in 50+ languages',
            },
            {
              title: 'Multi-Platform',
              description: 'Publish to TikTok, YouTube, Twitch & more',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border bg-background-card/50 p-6 text-left"
            >
              <h3 className="mb-2 font-semibold text-text-primary">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-16 text-sm text-text-tertiary">
          &copy; {new Date().getFullYear()} IRON Creator OS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
