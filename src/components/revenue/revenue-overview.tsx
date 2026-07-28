'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Icon } from '@/components/shared/icon';
import { staggerItem } from '@/lib/utils/animations';
import { Sparkline } from '@/components/analytics/chart-placeholder';
import { MOCK_TOTAL_REVENUE } from './mock-data';

interface RevenueOverviewProps {
  totalRevenue?: number;
  trend?: number;
  trendLabel?: string;
  currency?: string;
}

export function RevenueOverview({
  totalRevenue = MOCK_TOTAL_REVENUE,
  trend = 18.2,
  trendLabel = 'vs last month',
  currency = 'USD',
}: RevenueOverviewProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalRevenue);

  return (
    <MotionDiv variants={staggerItem}>
      <StatCard
        icon={({ className, ...props }) => <Icon name="dollar-sign" className={className} {...props} />}
        label="Total Revenue"
        value={formatted}
        trend={trend}
        trendLabel={trendLabel}
        variant="success"
        sparkline={<Sparkline color="#10B981" width={100} height={32} />}
        className="border-accent/10 bg-gradient-to-br from-background-card to-accent-subtle/10 shadow-glass"
      />
    </MotionDiv>
  );
}
