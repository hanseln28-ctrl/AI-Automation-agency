'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, DollarSign, Activity, Zap, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { Card } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { MOCK_USERS, MOCK_BILLING } from '@/components/admin/mock-data';

export default function AdminPage() {
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter((u) => u.status === 'active').length;
  const mrr = MOCK_BILLING.filter((b) => b.status === 'active').reduce((s, b) => s + b.amount, 0);

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <PageHeader
          title="Admin Dashboard"
          description="Platform overview and key metrics"
        />
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          trend={12}
          trendLabel="this month"
          variant="default"
        />
        <StatCard
          icon={Activity}
          label="Active Users"
          value={activeUsers}
          trend={8}
          trendLabel="this month"
          variant="success"
        />
        <StatCard
          icon={DollarSign}
          label="MRR"
          value={`$${mrr.toLocaleString()}`}
          trend={15}
          trendLabel="vs last month"
          variant="default"
        />
        <StatCard
          icon={Zap}
          label="AI Tokens Used"
          value="18.2M"
          trend={22}
          trendLabel="vs last month"
          variant="warning"
        />
      </motion.div>

      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Recent Users</h3>
          <div className="space-y-2">
            {MOCK_USERS.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg bg-background-surface p-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle text-xs font-bold text-accent">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-2xs text-text-tertiary">{user.email}</p>
                  </div>
                </div>
                <span className="text-2xs text-text-tertiary">
                  {new Date(user.joinedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Overview</h3>
          <div className="space-y-3">
            {[
              { label: 'Free → Paid Conversion', value: '18.4%', trend: '+2.1%' },
              { label: 'Avg. Clips per User', value: '1,245', trend: '+89' },
              { label: 'Platforms Connected', value: '3.2 avg', trend: '+0.3' },
              { label: 'Daily Active Streams', value: '142', trend: '+12' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between rounded-lg bg-background-surface p-3"
              >
                <span className="text-xs text-text-secondary">{stat.label}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-text-primary">{stat.value}</span>
                  <span className="ml-1.5 text-2xs text-success">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
