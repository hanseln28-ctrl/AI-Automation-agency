'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Upload, Calendar, DollarSign, UserPlus } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { staggerItem } from '@/lib/utils/animations';

/* ── Demo KPI data ── */
const KPIS = [
  {
    icon: Upload,
    label: "Today's Uploads",
    value: 12,
    trend: 18,
    trendLabel: 'vs yesterday',
    variant: 'default' as const,
  },
  {
    icon: Calendar,
    label: 'Scheduled Content',
    value: 8,
    variant: 'warning' as const,
  },
  {
    icon: UserPlus,
    label: 'New Followers',
    value: 1423,
    trend: 12.5,
    trendLabel: 'this week',
    variant: 'success' as const,
  },
  {
    icon: DollarSign,
    label: 'Est. Revenue',
    value: '$4,280',
    trend: 8.3,
    trendLabel: 'vs last month',
    variant: 'default' as const,
  },
];

export function KpiRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {KPIS.map((kpi, i) => (
        <MotionDiv key={kpi.label} variants={staggerItem}>
          <StatCard
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendLabel={kpi.trendLabel}
            variant={kpi.variant}
            className="h-full"
          />
        </MotionDiv>
      ))}
    </div>
  );
}

export function KpiRowSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border-subtle bg-background-card p-5"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-background-elevated" />
            <div className="h-4 w-24 animate-pulse rounded bg-background-elevated" />
          </div>
          <div className="mt-3 h-8 w-20 animate-pulse rounded bg-background-elevated" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded bg-background-elevated" />
        </div>
      ))}
    </div>
  );
}
