'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Tv, Scissors, Send, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';

const ACTIONS = [
  {
    icon: Tv,
    label: 'Import Stream',
    description: 'Paste a VOD URL to process',
    href: '/streams/import',
    gradient: 'from-[#6C5CE7]/20 to-[#8B7CF7]/10',
    iconBg: 'bg-accent-subtle',
    iconColor: 'text-accent',
  },
  {
    icon: Scissors,
    label: 'Generate Clips',
    description: 'AI-powered highlight detection',
    href: '/clips',
    gradient: 'from-[#10B981]/20 to-[#34D399]/10',
    iconBg: 'bg-success-subtle',
    iconColor: 'text-success',
  },
  {
    icon: Send,
    label: 'Schedule Post',
    description: 'Queue content across platforms',
    href: '/publishing',
    gradient: 'from-[#F59E0B]/20 to-[#FBBF24]/10',
    iconBg: 'bg-warning-subtle',
    iconColor: 'text-warning',
  },
  {
    icon: BarChart3,
    label: 'View Analytics',
    description: 'Deep dive into performance',
    href: '/analytics',
    gradient: 'from-[#EC4899]/20 to-[#F472B6]/10',
    iconBg: 'bg-danger-subtle',
    iconColor: 'text-danger',
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((action) => (
        <MotionDiv key={action.label} variants={staggerItem}>
          <Link
            href={action.href}
            className={cn(
              'group relative flex flex-col rounded-xl border border-border-subtle',
              'bg-background-card p-5 transition-all duration-300',
              'hover:-translate-y-1 hover:border-accent/30 hover:shadow-elevated',
            )}
          >
            {/* Gradient overlay on hover */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                action.gradient,
              )}
            />

            <div className="relative z-10">
              <div
                className={cn(
                  'mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                  action.iconBg,
                )}
              >
                <action.icon className={cn('h-5 w-5', action.iconColor)} />
              </div>

              <h3 className="text-sm font-semibold text-text-primary">
                {action.label}
              </h3>
              <p className="mt-1 text-xs text-text-tertiary">
                {action.description}
              </p>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Get started
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </MotionDiv>
      ))}
    </div>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border-subtle bg-background-card p-5"
        >
          <div className="mb-3 h-10 w-10 animate-pulse rounded-lg bg-background-elevated" />
          <div className="h-4 w-24 animate-pulse rounded bg-background-elevated" />
          <div className="mt-2 h-3 w-36 animate-pulse rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
