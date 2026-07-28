'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon component from lucide-react */
  icon?: LucideIcon;
  /** Stat label (e.g. "Total Views") */
  label: string;
  /** Stat value (e.g. "125,000") */
  value: string | number;
  /** Trend indicator — positive = up, negative = down */
  trend?: number;
  /** Trend label (e.g. "vs last month") */
  trendLabel?: string;
  /** Accent color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Optional sparkline placeholder */
  sparkline?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  default: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const variantBgStyles: Record<string, string> = {
  default: 'bg-accent-subtle',
  success: 'bg-success-subtle',
  warning: 'bg-warning-subtle',
  danger: 'bg-danger-subtle',
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { icon: Icon, label, value, trend, trendLabel, variant = 'default', sparkline, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-border-subtle bg-background-card p-5 shadow-card transition-shadow hover:shadow-elevated',
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Icon & label */}
            <div className="flex items-center gap-2">
              {Icon && (
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', variantBgStyles[variant])}>
                  <Icon className={cn('h-4 w-4', variantStyles[variant])} />
                </div>
              )}
              <p className="text-sm font-medium text-text-secondary">{label}</p>
            </div>

            {/* Value */}
            <p className="text-2xl font-bold tracking-tight text-text-primary">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>

            {/* Trend */}
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {trend >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 text-danger" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend >= 0 ? 'text-success' : 'text-danger',
                  )}
                >
                  {Math.abs(trend)}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-text-tertiary">{trendLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Sparkline */}
          {sparkline && <div className="mt-1">{sparkline}</div>}
        </div>
      </div>
    );
  },
);
StatCard.displayName = 'StatCard';
