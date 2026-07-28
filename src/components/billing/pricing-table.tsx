'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { PLAN_CONFIG } from '@/lib/stripe/helpers';
import type { BillingTier } from '@/lib/stripe/helpers';
import { PlanCard } from './plan-card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';

interface PricingTableProps {
  currentTier: BillingTier;
  billingPeriod: 'monthly' | 'annual';
  onSelectPlan: (tier: BillingTier) => void;
}

export function PricingTable({
  currentTier,
  billingPeriod,
  onSelectPlan,
}: PricingTableProps) {
  const tiers = Object.values(PLAN_CONFIG);

  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {tiers.map((plan) => (
        <MotionDiv key={plan.tier} variants={staggerItem}>
          <PlanCard
            plan={plan}
            billingPeriod={billingPeriod}
            isCurrentPlan={currentTier === plan.tier}
            onSelect={() => onSelectPlan(plan.tier)}
            disabled={plan.tier === 'free'}
          />
        </MotionDiv>
      ))}
    </MotionDiv>
  );
}
