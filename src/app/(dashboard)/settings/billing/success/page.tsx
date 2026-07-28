'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, PartyPopper, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLAN_CONFIG, formatCurrency } from '@/lib/stripe/helpers';
import type { BillingTier } from '@/lib/stripe/helpers';

/* ── Confetti particle generator ── */
const COLORS = ['#6C5CE7', '#8B7CF7', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

function useConfetti() {
  const [particles, setParticles] = React.useState<
    { id: number; x: number; color: string; size: number; delay: number; duration: number }[]
  >([]);

  React.useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#6C5CE7",
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.8,
      duration: Math.random() * 1.5 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return particles;
}

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') as BillingTier | null;
  const tier: BillingTier = tierParam || 'pro';
  const plan = PLAN_CONFIG[tier];

  const particles = useConfetti();

  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <MotionDiv
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: '-5%',
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
            }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 720 - 360,
              x: [0, (Math.random() - 0.5) * 200],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 max-w-md text-center"
      >
        <MotionDiv
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle"
        >
          <CheckCircle className="h-10 w-10 text-success" />
        </MotionDiv>

        <h1 className="text-2xl font-bold text-text-primary">
          Subscription Activated!
        </h1>
        <p className="mt-2 text-text-secondary">
          Welcome to the{' '}
          <span className="font-semibold text-accent">{plan.label}</span> plan.
          You now have access to all premium features.
        </p>

        <div className="mt-6 rounded-xl border border-border-subtle bg-background-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Plan</span>
            <span className="text-sm font-semibold text-text-primary">
              {plan.label}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-text-secondary">Price</span>
            <span className="text-sm font-semibold text-text-primary">
              {plan.priceMonthly === 0
                ? 'Free'
                : formatCurrency(plan.priceMonthly) + '/mo'}
            </span>
          </div>
        </div>

        <Button
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full"
          size="lg"
        >
          <PartyPopper className="mr-2 h-4 w-4" />
          Go to Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <p className="mt-4 text-2xs text-text-tertiary">
          You&apos;ll receive a confirmation email shortly.
        </p>
      </MotionDiv>
    </div>
  );
}
