'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/shared/icon';
import type { IconName } from '@/components/shared/icon';
import { cn } from '@/lib/utils/cn';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import type { RevenueSourceCard as RevenueSourceCardType } from './types';
import { MOCK_REVENUE_SOURCES } from './mock-data';

interface RevenueBreakdownProps {
  sources?: RevenueSourceCardType[];
}

export function RevenueBreakdown({ sources = MOCK_REVENUE_SOURCES }: RevenueBreakdownProps) {
  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
    >
      {sources.map((source) => (
        <RevenueSourceCard key={source.source} source={source} />
      ))}
    </MotionDiv>
  );
}

function RevenueSourceCard({ source }: { source: RevenueSourceCardType }) {
  const isPositive = source.trend >= 0;

  return (
    <MotionDiv variants={staggerItem}>
      <Card className="group transition-all duration-200 hover:shadow-elevated">
        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${source.color}20` }}
            >
              <Icon name={source.icon as IconName} size="sm" style={{ color: source.color }} />
            </div>
            <div
              className={cn(
                'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-2xs font-medium',
                isPositive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger',
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(source.trend)}%
            </div>
          </div>
          <p className="text-sm font-medium text-text-secondary truncate">{source.label}</p>
          <p className="mt-0.5 text-lg font-bold text-text-primary">
            ${source.amount.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </MotionDiv>
  );
}
