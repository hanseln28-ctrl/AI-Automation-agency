'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-md text-center"
      >
        <MotionDiv
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background-elevated"
        >
          <XCircle className="h-10 w-10 text-text-tertiary" />
        </MotionDiv>

        <h1 className="text-2xl font-bold text-text-primary">
          Checkout Cancelled
        </h1>
        <p className="mt-2 text-text-secondary">
          No charges have been made. You can try again whenever you&apos;re ready.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/settings/billing')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
          <Button
            variant="default"
            onClick={() => router.back()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </MotionDiv>
    </div>
  );
}
