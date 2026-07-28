'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerItem } from '@/lib/utils/animations';
import { ChartPlaceholder } from '@/components/analytics/chart-placeholder';
import type { RevenueOverTime } from './types';
import { MOCK_REVENUE_OVER_TIME, MOCK_MONTHLY_COMPARISON } from './mock-data';
import { CATEGORY_COLORS } from './types';

interface RevenueChartProps {
  data?: RevenueOverTime[];
}

export function RevenueChart({ data = MOCK_REVENUE_OVER_TIME }: RevenueChartProps) {
  return (
    <MotionDiv variants={staggerItem} className="space-y-6">
      {/* Revenue over time */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder type="stacked-area" height={300} />
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {(Object.entries(CATEGORY_COLORS) as [string, string][]).map(([category, color]) => (
              <div key={category} className="flex items-center gap-1.5 text-xs">
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-text-secondary capitalize">{category}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder
            type="bar"
            height={260}
            data={MOCK_MONTHLY_COMPARISON.flatMap((m) => [
              { label: m.month, value: m.thisYear, color: '#6C5CE7' },
              { label: m.month, value: m.lastYear, color: '#2A2A3A' },
            ])}
          />
          <div className="mt-3 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-accent" />
              <span className="text-text-secondary">This Year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[#2A2A3A]" />
              <span className="text-text-secondary">Last Year</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
