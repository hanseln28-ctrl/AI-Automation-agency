'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CheckoutForm } from '@/components/billing/checkout-form';
import type { BillingTier } from '@/lib/stripe/helpers';

const VALID_TIERS: BillingTier[] = ['starter', 'pro', 'agency', 'enterprise'];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierParam = searchParams.get('tier') as BillingTier | null;
  const periodParam = searchParams.get('period') as 'monthly' | 'annual' | null;

  const selectedTier: BillingTier =
    tierParam && VALID_TIERS.includes(tierParam) ? tierParam : 'pro';
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annual'>(
    periodParam === 'annual' ? 'annual' : 'monthly',
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);

    // Simulate API call — in production this creates a Stripe Checkout session
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/settings/billing/success?tier=${selectedTier}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <CheckoutForm
        selectedTier={selectedTier}
        billingPeriod={billingPeriod}
        onBillingPeriodChange={setBillingPeriod}
        onSubscribe={handleSubscribe}
        isLoading={isLoading}
      />
    </div>
  );
}
