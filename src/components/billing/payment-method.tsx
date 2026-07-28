'use client';

import * as React from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { PaymentMethodInfo } from './types';
import { PAYMENT_BRAND_LABELS, PAYMENT_BRAND_COLORS } from './types';

interface PaymentMethodProps {
  paymentMethod?: PaymentMethodInfo;
  onUpdate: () => void;
}

export function PaymentMethod({ paymentMethod, onUpdate }: PaymentMethodProps) {
  if (!paymentMethod) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border-subtle bg-background-card p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-subtle">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              No payment method
            </p>
            <p className="text-xs text-text-secondary">
              Add a card to activate your subscription.
            </p>
          </div>
        </div>
        <Button variant="default" size="sm" onClick={onUpdate}>
          Add Payment Method
        </Button>
      </div>
    );
  }

  const brandLabel = PAYMENT_BRAND_LABELS[paymentMethod.brand] || paymentMethod.brand;
  const brandColor = PAYMENT_BRAND_COLORS[paymentMethod.brand] || '#6C5CE7';
  const isExpired =
    paymentMethod.expYear < new Date().getFullYear() ||
    (paymentMethod.expYear === new Date().getFullYear() &&
      paymentMethod.expMonth < new Date().getMonth() + 1);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-background-card p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {/* Card icon with brand color */}
        <div
          className="flex h-12 w-16 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${brandColor}20` }}
        >
          <CreditCard
            className="h-6 w-6"
            style={{ color: brandColor }}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text-primary">
              {brandLabel}
            </p>
            <span className="font-mono text-sm text-text-secondary">
              •••• {paymentMethod.last4}
            </span>
          </div>
          <p
            className={cn('text-xs', isExpired ? 'text-danger' : 'text-text-tertiary')}
          >
            Expires{' '}
            {String(paymentMethod.expMonth).padStart(2, '0')}/
            {paymentMethod.expYear}
            {isExpired && ' — Expired'}
          </p>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={onUpdate}>
        Update
      </Button>
    </div>
  );
}
