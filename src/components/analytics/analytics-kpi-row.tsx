'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { StatCard } from '@/components/shared/stat-card';
import { Icon, type IconName } from '@/components/shared/icon';
import { staggerItem } from '@/lib/utils/animations';
import { Sparkline } from './chart-placeholder';
import type { AnalyticsKPI } from './types';
import { MOCK_KPIS } from './mock-data';

interface AnalyticsKpiRowProps {
  kpis?: AnalyticsKPI[];
}

const sparklineColors: Record<string, string> = {
  default: '#6C5CE7',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export function AnalyticsKpiRow({ kpis = MOCK_KPIS }: AnalyticsKpiRowProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <MotionDiv key={kpi.label} variants={staggerItem}>
          <StatCard
            icon={({ className, ...props }) => <Icon name={kpi.icon as IconName} className={className} {...props} />}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendLabel={kpi.trendLabel}
            variant={kpi.variant}
            sparkline={<Sparkline color={sparklineColors[kpi.variant]} />}
            className="h-full"
          />
        </MotionDiv>
      ))}
    </div>
  );
}
