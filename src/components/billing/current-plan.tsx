'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PLAN_CONFIG, formatCurrency } from '@/lib/stripe/helpers';
import type { CurrentSubscription } from './types';
import {
  SUBSCRIPTION_STATUS_LABELS,
  SUBSCRIPTION_STATUS_VARIANTS,
} from './types';

interface CurrentPlanProps {
  subscription: CurrentSubscription;
  onCancelSubscription: () => void;
  onReactivateSubscription: () => void;
}

export function CurrentPlan({
  subscription,
  onCancelSubscription,
  onReactivateSubscription,
}: CurrentPlanProps) {
  const plan = PLAN_CONFIG[subscription.tier];
  const isActive = subscription.status === 'active';
  const isTrialing = subscription.status === 'trialing';
  const isCancelled = subscription.status === 'cancelled';
  const isPastDue = subscription.status === 'past_due';
  const endsAt = new Date(subscription.currentPeriodEnd);

  const price =
    subscription.billingPeriod === 'annual'
      ? plan.priceAnnual / 12
      : plan.priceMonthly;

  return (
    <Card className="overflow-hidden border-border-subtle">
      {/* Header accent bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            subscription.status === 'active'
              ? 'linear-gradient(90deg, #10B981, #34D399)'
              : subscription.status === 'past_due'
                ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                : subscription.status === 'trialing'
                  ? 'linear-gradient(90deg, #6C5CE7, #8B7CF7)'
                  : 'linear-gradient(90deg, #6B7280, #9CA3AF)',
        }}
      />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{plan.label} Plan</CardTitle>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">
                {formatCurrency(price)}
              </span>
              /mo
              {subscription.billingPeriod === 'annual' && (
                <span className="text-xs text-success ml-1">(20% off)</span>
              )}
            </p>
          </div>
          <Badge variant={SUBSCRIPTION_STATUS_VARIANTS[subscription.status]}>
            {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status-specific message */}
        {isActive && (
          <div className="flex items-center gap-2 rounded-lg bg-success-subtle p-3 text-sm">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span className="text-text-primary">
              Your subscription renews on{' '}
              <span className="font-semibold">
                {endsAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
          </div>
        )}

        {isPastDue && (
          <div className="flex items-center gap-2 rounded-lg bg-warning-subtle p-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-text-primary">
              Payment is past due. Please update your payment method.
            </span>
          </div>
        )}

        {isCancelled && subscription.cancelAtPeriodEnd && (
          <div className="flex items-center gap-2 rounded-lg bg-background-elevated p-3 text-sm">
            <Clock className="h-4 w-4 text-text-tertiary" />
            <span className="text-text-secondary">
              Access ends on{' '}
              <span className="font-semibold text-text-primary">
                {endsAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
          </div>
        )}

        {isTrialing && (
          <div className="flex items-center gap-2 rounded-lg bg-accent-subtle p-3 text-sm">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-text-primary">
              Trial ends on{' '}
              <span className="font-semibold">
                {endsAt.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
          </div>
        )}

        {/* Actions */}
        {isActive && !subscription.cancelAtPeriodEnd && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelSubscription}
            className="text-text-tertiary hover:text-danger"
          >
            Cancel Subscription
          </Button>
        )}

        {isCancelled && subscription.cancelAtPeriodEnd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReactivateSubscription}
          >
            Reactivate Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
