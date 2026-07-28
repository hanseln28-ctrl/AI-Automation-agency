'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerItem } from '@/lib/utils/animations';
import { MOCK_MONTHLY_COMPARISON, MOCK_REVENUE_OVER_TIME } from './mock-data';
import { CATEGORY_COLORS } from './types';
import type { RevenueSourceCategory } from './types';

export function RevenueComparison() {
  const currentMonth = MOCK_REVENUE_OVER_TIME[MOCK_REVENUE_OVER_TIME.length - 1];
  const lastMonth = MOCK_REVENUE_OVER_TIME[MOCK_REVENUE_OVER_TIME.length - 2];

  const categories: { key: RevenueSourceCategory; label: string; current: number; previous: number }[] = [
    { key: 'twitch', label: 'Twitch', current: currentMonth.twitch, previous: lastMonth.twitch },
    { key: 'youtube', label: 'YouTube', current: currentMonth.youtube, previous: lastMonth.youtube },
    { key: 'sponsorship', label: 'Sponsorship', current: currentMonth.sponsorship, previous: lastMonth.sponsorship },
    { key: 'merch', label: 'Merch', current: currentMonth.merch, previous: lastMonth.merch },
    { key: 'affiliate', label: 'Affiliate', current: currentMonth.affiliate, previous: lastMonth.affiliate },
    { key: 'kick', label: 'Kick', current: currentMonth.kick, previous: lastMonth.kick },
    { key: 'tiktok', label: 'TikTok', current: currentMonth.tiktok, previous: lastMonth.tiktok },
    { key: 'donations', label: 'Donations', current: currentMonth.donations, previous: lastMonth.donations },
  ];

  const totalCurrent = categories.reduce((s, c) => s + c.current, 0);
  const totalPrevious = categories.reduce((s, c) => s + c.previous, 0);

  return (
    <MotionDiv variants={staggerItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total comparison */}
      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>This Month vs Last</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-2xs text-text-tertiary">This Month</p>
              <p className="text-2xl font-bold text-text-primary">
                ${totalCurrent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-2xs text-text-tertiary">Last Month</p>
              <p className="text-xl font-semibold text-text-secondary">
                ${totalPrevious.toLocaleString()}
              </p>
            </div>
            {(() => {
              const change = ((totalCurrent - totalPrevious) / totalPrevious) * 100;
              const isPositive = change >= 0;
              return (
                <div
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                  }`}
                >
                  {isPositive ? '+' : ''}{change.toFixed(1)}% vs last month
                </div>
              );
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      {categories.slice(0, 3).map((cat) => {
        const changes = cat.previous > 0 ? ((cat.current - cat.previous) / cat.previous) * 100 : 0;
        return (
          <Card key={cat.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[cat.key] }}
                  />
                  <span className="text-sm font-medium text-text-primary">{cat.label}</span>
                </div>
                <span
                  className={`text-xs font-medium ${changes >= 0 ? 'text-success' : 'text-danger'}`}
                >
                  {changes >= 0 ? '+' : ''}{changes.toFixed(1)}%
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-text-primary">
                ${cat.current.toLocaleString()}
              </p>
              <p className="text-xs text-text-tertiary">
                prev. ${cat.previous.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </MotionDiv>
  );
}
