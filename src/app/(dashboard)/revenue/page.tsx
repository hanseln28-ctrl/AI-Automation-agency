'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Calendar, DollarSign } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { staggerContainer } from '@/lib/utils/animations';
import { RevenueOverview } from '@/components/revenue/revenue-overview';
import { RevenueBreakdown } from '@/components/revenue/revenue-breakdown';
import { RevenueChart } from '@/components/revenue/revenue-chart';
import { RevenueComparison } from '@/components/revenue/revenue-comparison';
import { TransactionsTable } from '@/components/revenue/transactions-table';
import type { DateRange } from '@/components/analytics/types';

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'custom', label: 'Custom' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

export default function RevenuePage() {
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');
  const [currency, setCurrency] = React.useState('USD');

  return (
    <MotionDiv
      className="space-y-6 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Revenue"
        description="Track your earnings from all revenue sources."
        actions={
          <div className="flex items-center gap-3">
            {/* Currency selector */}
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-[100px]">
                <DollarSign className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date range */}
            <div className="flex items-center gap-1 rounded-lg bg-background-surface p-1">
              {DATE_RANGES.map((range) => (
                <Button
                  key={range.value}
                  variant={dateRange === range.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDateRange(range.value)}
                  className={dateRange === range.value ? '' : 'text-text-secondary'}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        }
      />

      {/* Total Revenue KPI */}
      <div className="max-w-sm">
        <RevenueOverview currency={currency} />
      </div>

      {/* Revenue Breakdown — 2×4 grid */}
      <RevenueBreakdown />

      {/* Revenue Over Time & Monthly Comparison */}
      <RevenueChart />

      {/* Monthly Comparison Cards */}
      <RevenueComparison />

      {/* Transactions Table */}
      <TransactionsTable />
    </MotionDiv>
  );
}
