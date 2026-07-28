'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import type { PlanTierConfig } from '@/lib/stripe/helpers';
import { formatCurrency } from '@/lib/stripe/helpers';

interface PlanCardProps {
  plan: PlanTierConfig;
  billingPeriod: 'monthly' | 'annual';
  isCurrentPlan: boolean;
  onSelect: (tier: string) => void;
  disabled?: boolean;
}

export function PlanCard({ plan, billingPeriod, isCurrentPlan, onSelect, disabled }: PlanCardProps) {
  const price =
    billingPeriod === 'annual' ? plan.priceAnnual / 12 : plan.priceMonthly;
  const isFree = plan.priceMonthly === 0;

  return (
    <MotionDiv
      whileHover={!disabled ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-colors',
        plan.highlighted
          ? 'border-accent/40 bg-accent-subtle shadow-glass-lg'
          : 'border-border-subtle bg-background-card shadow-card',
        isCurrentPlan && 'ring-2 ring-accent/50',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge
            variant="default"
            className="bg-accent px-4 py-1 text-xs font-semibold"
          >
            <Zap className="mr-1 h-3 w-3" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="mb-3">
          <Badge variant="success" className="text-2xs">
            Current Plan
          </Badge>
        </div>
      )}

      {/* Plan name */}
      <h3 className="text-lg font-bold text-text-primary">{plan.label}</h3>

      {/* Price */}
      <div className="mt-3 flex items-baseline gap-0.5">
        {isFree ? (
          <span className="text-4xl font-bold text-text-primary">Free</span>
        ) : (
          <>
            <span className="text-4xl font-bold text-text-primary">
              {formatCurrency(price)}
            </span>
            <span className="text-sm text-text-tertiary">/mo</span>
          </>
        )}
      </div>

      {/* Annual savings */}
      {billingPeriod === 'annual' && !isFree && (
        <p className="mt-1 text-xs text-success">
          Save {formatCurrency(plan.priceMonthly * 12 - plan.priceAnnual)}/year
        </p>
      )}

      {billingPeriod === 'monthly' && !isFree && (
        <p className="mt-1 text-xs text-text-tertiary">
          or {formatCurrency(plan.priceAnnual)}/year (20% off)
        </p>
      )}

      {/* Feature list */}
      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan.tier)}
        disabled={disabled || isCurrentPlan}
        className={cn(
          'mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition-all',
          isCurrentPlan
            ? 'bg-background-elevated text-text-tertiary cursor-default'
            : plan.highlighted
              ? 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]'
              : 'bg-background-elevated text-text-primary hover:bg-background-card active:scale-[0.98]',
        )}
      >
        {isCurrentPlan ? 'Current Plan' : isFree ? 'Get Started' : 'Upgrade'}
      </button>
    </MotionDiv>
  );
}
