'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { CurrentPlan } from '@/components/billing/current-plan';
import { UsageMeter } from '@/components/billing/usage-meter';
import { PricingTable } from '@/components/billing/pricing-table';
import { BillingHistory } from '@/components/billing/billing-history';
import { PaymentMethod } from '@/components/billing/payment-method';
import {
  MOCK_CURRENT_SUBSCRIPTION,
  MOCK_USAGE,
  MOCK_BILLING_HISTORY,
  MOCK_PAYMENT_METHOD,
} from '@/components/billing/mock-data';
import type { BillingTier } from '@/lib/stripe/helpers';
import { staggerContainer } from '@/lib/utils/animations';

export default function BillingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'annual'>('monthly');
  const [subscription, setSubscription] = React.useState(MOCK_CURRENT_SUBSCRIPTION);
  const usage = MOCK_USAGE[subscription.tier];

  const handleSelectPlan = (tier: BillingTier) => {
    if (tier === 'free') return;
    router.push(`/settings/billing/checkout?tier=${tier}&period=${billingPeriod}`);
  };

  const handleCancelSubscription = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: true,
    }));
    toast.success('Subscription will be cancelled at the end of the billing period.');
  };

  const handleReactivateSubscription = () => {
    setSubscription((prev) => ({
      ...prev,
      cancelAtPeriodEnd: false,
      status: 'active',
    }));
    toast.success('Subscription reactivated.');
  };

  const handleUpdatePaymentMethod = () => {
    toast.info('Payment method update will be available via Stripe Customer Portal.');
  };

  return (
    <MotionDiv
      className="space-y-8 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription, billing history, and payment methods."
        actions={
          <div className="flex items-center rounded-lg bg-background-surface p-0.5">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span className="ml-1 text-success">–20%</span>
            </button>
          </div>
        }
      />

      {/* Current Plan + Usage */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CurrentPlan
            subscription={subscription}
            onCancelSubscription={handleCancelSubscription}
            onReactivateSubscription={handleReactivateSubscription}
          />
        </div>
        <div className="lg:col-span-1">
          <UsageMeter usage={usage} />
        </div>
      </div>

      {/* Pricing Table */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-text-primary">
          Available Plans
        </h2>
        <PricingTable
          currentTier={subscription.tier}
          billingPeriod={billingPeriod}
          onSelectPlan={handleSelectPlan}
        />
      </section>

      {/* Payment Method */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-text-primary">
          Payment Method
        </h2>
        <PaymentMethod
          paymentMethod={MOCK_PAYMENT_METHOD}
          onUpdate={handleUpdatePaymentMethod}
        />
      </section>

      {/* Billing History */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-text-primary">
          Billing History
        </h2>
        <BillingHistory invoices={MOCK_BILLING_HISTORY} />
      </section>

      {/* Danger Zone — Cancel Subscription */}
      <section className="rounded-xl border border-danger/30 bg-danger-subtle/30 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-danger">Danger Zone</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Permanently cancel your subscription and lose access to premium
              features.
            </p>
          </div>
          <button
            onClick={handleCancelSubscription}
            disabled={subscription.cancelAtPeriodEnd || subscription.status === 'cancelled'}
            className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 bg-transparent px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancel Subscription
          </button>
        </div>
        {subscription.cancelAtPeriodEnd && (
          <p className="mt-3 text-xs text-text-tertiary">
            Your subscription is set to cancel at the end of the current billing
            period. You can reactivate anytime before then.
          </p>
        )}
      </section>
    </MotionDiv>
  );
}
