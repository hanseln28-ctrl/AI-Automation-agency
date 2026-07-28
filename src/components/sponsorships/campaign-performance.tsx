'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Eye, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import type { CampaignPerformance } from './types';

interface CampaignPerformanceProps {
  performances: CampaignPerformance[];
}

export function CampaignPerformanceView({ performances }: CampaignPerformanceProps) {
  if (performances.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-sm text-text-tertiary">No performance data yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Summary totals
  const totals = performances.reduce(
    (acc, p) => ({
      views: acc.views + p.views,
      ctr: acc.ctr + p.ctr,
      conversions: acc.conversions + p.conversions,
      revenue: acc.revenue + p.revenue,
    }),
    { views: 0, ctr: 0, conversions: 0, revenue: 0 },
  );
  const avgCtr = (totals.ctr / performances.length).toFixed(1);

  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Summary KPI cards */}
      <MotionDiv
        variants={staggerItem}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle">
              <Eye className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xs text-text-tertiary">Total Views</p>
              <p className="text-lg font-bold text-text-primary">{totals.views.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
              <MousePointerClick className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xs text-text-tertiary">Avg. CTR</p>
              <p className="text-lg font-bold text-text-primary">{avgCtr}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-subtle">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xs text-text-tertiary">Conversions</p>
              <p className="text-lg font-bold text-text-primary">{totals.conversions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-subtle">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xs text-text-tertiary">Revenue</p>
              <p className="text-lg font-bold text-success">${totals.revenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Per-deliverable table */}
      <MotionDiv variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Deliverable Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-text-tertiary">
                    <th className="pb-3 font-medium">Deliverable</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Conversions</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {performances.map((p) => (
                    <tr
                      key={p.deliverableId}
                      className="border-b border-border-subtle/50 hover:bg-background-elevated/30 transition-colors"
                    >
                      <td className="py-3 font-medium text-text-primary">{p.deliverableTitle}</td>
                      <td className="py-3 text-right font-mono text-text-primary">{p.views.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono text-text-secondary">{p.ctr}%</td>
                      <td className="py-3 text-right font-mono text-text-secondary">{p.conversions}</td>
                      <td className="py-3 text-right font-mono text-success">${p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </MotionDiv>
  );
}
