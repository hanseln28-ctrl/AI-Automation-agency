'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { DollarSign, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PLAN_CONFIG, SUBSCRIPTION_STATUS_CONFIG } from './types';
import type { AdminBillingRecord } from './types';

interface SubscriptionsTableProps {
  subscriptions: AdminBillingRecord[];
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const totalMRR = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.amount, 0);
  const activeSubs = subscriptions.filter((s) => s.status === 'active').length;
  const churnedSubs = subscriptions.filter((s) => s.status === 'cancelled').length;
  const churnRate = subscriptions.length > 0 ? ((churnedSubs / subscriptions.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Monthly Recurring Revenue"
          value={`$${totalMRR.toLocaleString()}`}
          trend={12.5}
          trendLabel="vs last month"
          variant="default"
        />
        <StatCard
          icon={Users}
          label="Active Subscriptions"
          value={activeSubs}
          trend={8}
          trendLabel="vs last month"
          variant="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Churn Rate"
          value={`${churnRate}%`}
          trend={-0.8}
          trendLabel="improving"
          variant="warning"
        />
        <StatCard
          icon={BarChart3}
          label="Conversion Rate"
          value="18.4%"
          trend={2.1}
          trendLabel="vs last month"
          variant="success"
        />
      </div>

      {/* Revenue Chart placeholder */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue Overview</h3>
        <div className="h-[200px] flex items-end gap-2">
          {[40, 55, 48, 70, 62, 85, 75, 90, 82, 95, 88, 100].map((val, i) => (
            <MotionDiv
              key={i}
              className="flex-1 rounded-t-md bg-accent/60"
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-2xs text-text-tertiary">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
          <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
          <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </Card>

      {/* Subscriptions Table */}
      {subscriptions.length === 0 ? (
        <EmptyState
          icon={DollarSign}
          title="No subscriptions found"
          description="No billing records to display"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-background-surface">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-text-secondary">Start Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary">Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub, i) => (
                <MotionTr
                  key={sub.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                  className="border-b border-border-subtle hover:bg-background-surface/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-text-primary">{sub.userName}</p>
                    <p className="text-2xs text-text-tertiary">{sub.paymentMethod}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn('text-2xs', PLAN_CONFIG[sub.plan].badgeClass)}
                    >
                      {PLAN_CONFIG[sub.plan].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={SUBSCRIPTION_STATUS_CONFIG[sub.status].variant} className="text-2xs">
                      {SUBSCRIPTION_STATUS_CONFIG[sub.status].label}
                    </Badge>
                  </td>
                  <td className="hidden md:table-cell px-4 py-3">
                    <span className="text-xs text-text-tertiary">
                      {new Date(sub.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-semibold text-text-primary tabular-nums">
                      ${sub.amount.toFixed(2)}
                    </span>
                    <span className="text-2xs text-text-tertiary block">/mo</span>
                  </td>
                </MotionTr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
