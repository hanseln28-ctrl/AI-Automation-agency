'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Lock, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PLAN_CONFIG, formatCurrency } from '@/lib/stripe/helpers';
import type { BillingTier } from '@/lib/stripe/helpers';

interface CheckoutFormProps {
  selectedTier: BillingTier;
  billingPeriod: 'monthly' | 'annual';
  onBillingPeriodChange: (period: 'monthly' | 'annual') => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export function CheckoutForm({
  selectedTier,
  billingPeriod,
  onBillingPeriodChange,
  onSubscribe,
  isLoading,
}: CheckoutFormProps) {
  const plan = PLAN_CONFIG[selectedTier];
  const price =
    billingPeriod === 'annual' ? plan.priceAnnual / 12 : plan.priceMonthly;
  const totalPrice =
    billingPeriod === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const isFree = plan.priceMonthly === 0;
  const annualSavings = plan.priceMonthly * 12 - plan.priceAnnual;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Back button */}
        <Link
          href="/settings/billing"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>

        {/* Billing period toggle */}
        {!isFree && (
          <Card className="border-border-subtle">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Billing Period
                  </p>
                  <p className="text-xs text-text-secondary">
                    Save 20% with annual billing
                  </p>
                </div>
                <div className="flex items-center rounded-lg bg-background-surface p-0.5">
                  <button
                    onClick={() => onBillingPeriodChange('monthly')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      billingPeriod === 'monthly'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => onBillingPeriodChange('annual')}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                      billingPeriod === 'annual'
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    Annual
                  </button>
                </div>
              </div>
              {billingPeriod === 'annual' && (
                <MotionP
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-xs text-success"
                >
                  You save {formatCurrency(annualSavings)} per year
                </MotionP>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment details (stub — Stripe Elements placeholder) */}
        {!isFree && (
          <Card className="border-border-subtle">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-sm font-semibold text-text-primary">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-secondary">
                    Card Number
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="4242 4242 4242 4242"
                      className="h-11 pl-10 font-mono text-sm"
                      disabled
                    />
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                      Expiry
                    </label>
                    <Input
                      placeholder="MM / YY"
                      className="h-11 text-sm"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-text-secondary">
                      CVC
                    </label>
                    <Input
                      placeholder="123"
                      className="h-11 text-sm"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-accent-subtle p-3">
                <p className="text-xs text-text-secondary">
                  Stripe Elements will be integrated here in production. For now,
                  use Stripe test card <span className="font-mono text-accent">4242 4242 4242 4242</span>.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscribe button */}
        <Button
          onClick={onSubscribe}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <MotionDiv
                className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Processing...
            </span>
          ) : isFree ? (
            'Get Started Free'
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Subscribe — {formatCurrency(totalPrice)}
              {billingPeriod === 'annual' ? '/year' : '/mo'}
            </>
          )}
        </Button>

        <p className="text-center text-2xs text-text-tertiary">
          <Shield className="mr-1 inline-block h-3 w-3" />
          Secured by Stripe. Cancel anytime.
        </p>
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6 border-border-subtle">
          <CardContent className="space-y-4 p-5">
            <h3 className="text-sm font-semibold text-text-primary">
              Order Summary
            </h3>

            <div className="flex items-center gap-3">
              {plan.highlighted && (
                <Badge variant="accent" className="text-2xs">
                  Popular
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{plan.label} Plan</span>
              <span className="text-sm font-semibold text-text-primary">
                {isFree ? 'Free' : `${formatCurrency(price)}/mo`}
              </span>
            </div>

            {!isFree && (
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <span>Billing</span>
                <span>{billingPeriod === 'annual' ? 'Annual' : 'Monthly'}</span>
              </div>
            )}

            <hr className="border-border-subtle" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">Total</span>
              <span className="text-sm font-bold text-text-primary">
                {isFree
                  ? 'Free'
                  : formatCurrency(totalPrice) +
                    (billingPeriod === 'annual' ? '/year' : '/mo')}
              </span>
            </div>

            {billingPeriod === 'annual' && !isFree && (
              <p className="text-2xs text-success">
                You save {formatCurrency(annualSavings)} vs. monthly billing
              </p>
            )}

            {/* Included features */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-text-tertiary">
                What&apos;s included:
              </p>
              <ul className="space-y-1">
                {plan.features.slice(0, 5).map((feature, i) => (
                  <li key={i} className="text-2xs text-text-secondary">
                    • {feature}
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="text-2xs text-text-tertiary">
                    + {plan.features.length - 5} more features
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
