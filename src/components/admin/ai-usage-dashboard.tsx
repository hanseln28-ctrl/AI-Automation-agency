'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Zap, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Progress } from '@/components/ui/progress';
import type { AdminAIUsageRecord } from './types';

interface AIUsageDashboardProps {
  records: AdminAIUsageRecord[];
}

export function AIUsageDashboard({ records }: AIUsageDashboardProps) {
  const totalCalls = records.reduce((s, r) => s + r.openaiCalls, 0);
  const totalTokens = records.reduce((s, r) => s + r.tokensUsed, 0);
  const totalCost = records.reduce((s, r) => s + r.cost, 0);

  const maxTokens = Math.max(...records.map((r) => r.tokensUsed), 1);

  return (
    <div className="space-y-6">
      {/* Overview KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Zap}
          label="Total API Calls"
          value={totalCalls.toLocaleString()}
          trend={18}
          trendLabel="vs last month"
          variant="default"
        />
        <StatCard
          icon={BarChart3}
          label="Total Tokens Used"
          value={`${(totalTokens / 1_000_000).toFixed(1)}M`}
          trend={12}
          trendLabel="vs last month"
          variant="default"
        />
        <StatCard
          icon={DollarSign}
          label="Total Cost"
          value={`$${totalCost.toFixed(2)}`}
          trend={15}
          trendLabel="vs last month"
          variant="warning"
        />
      </div>

      {/* Usage Chart placeholder */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Token Usage (Last 30 Days)
        </h3>
        <div className="h-[180px] flex items-end gap-1.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const val = 20 + Math.random() * 80;
            return (
              <MotionDiv
                key={i}
                className="flex-1 rounded-t-sm bg-accent/50"
                initial={{ height: 0 }}
                animate={{ height: `${val}%` }}
                transition={{ duration: 0.3, delay: i * 0.01 }}
              />
            );
          })}
        </div>
        <div className="mt-3 flex justify-between text-2xs text-text-tertiary">
          <span>Jul 1</span>
          <span>Jul 15</span>
          <span>Jul 30</span>
        </div>
      </Card>

      {/* Per-User Breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Per-User Breakdown</h3>
        {records.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No usage data"
            description="AI usage records will appear here"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border-subtle">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-background-surface">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">
                    User
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                    API Calls
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                    Tokens Used
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                    Tokens
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => (
                  <MotionTr
                    key={rec.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.03 }}
                    className="border-b border-border-subtle hover:bg-background-surface/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-text-primary">{rec.userName}</p>
                      <p className="text-2xs text-text-tertiary">{rec.period}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-text-secondary tabular-nums">
                        {rec.openaiCalls.toLocaleString()}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right">
                      <span className="text-sm text-text-secondary tabular-nums">
                        {rec.tokensUsed.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={(rec.tokensUsed / maxTokens) * 100}
                          className="h-1.5 flex-1"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-text-primary tabular-nums">
                        ${rec.cost.toFixed(2)}
                      </span>
                    </td>
                  </MotionTr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
