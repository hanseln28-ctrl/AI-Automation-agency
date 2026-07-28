'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Calendar } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { staggerContainer } from '@/lib/utils/animations';
import { AnalyticsKpiRow } from '@/components/analytics/analytics-kpi-row';
import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { AnalyticsContent } from '@/components/analytics/analytics-content';
import { AnalyticsAudience } from '@/components/analytics/analytics-audience';
import { AnalyticsPlatforms } from '@/components/analytics/analytics-platforms';
import type { DateRange } from '@/components/analytics/types';

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'custom', label: 'Custom' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  return (
    <MotionDiv
      className="space-y-6 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Analytics"
        description="Track your content performance across all platforms."
        actions={
          <div className="flex items-center gap-1 rounded-lg bg-background-surface p-1">
            {DATE_RANGES.map((range) => (
              <Button
                key={range.value}
                variant={dateRange === range.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange(range.value)}
                className={dateRange === range.value ? '' : 'text-text-secondary'}
              >
                {range.value === 'custom' ? (
                  <>
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {range.label}
                  </>
                ) : (
                  range.label
                )}
              </Button>
            ))}
          </div>
        }
      />

      {/* KPI Row */}
      <AnalyticsKpiRow />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview />
        </TabsContent>

        <TabsContent value="content">
          <AnalyticsContent />
        </TabsContent>

        <TabsContent value="audience">
          <AnalyticsAudience />
        </TabsContent>

        <TabsContent value="platforms">
          <AnalyticsPlatforms />
        </TabsContent>
      </Tabs>
    </MotionDiv>
  );
}
