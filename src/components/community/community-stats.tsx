'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, AlertTriangle, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { staggerItem } from '@/lib/utils/animations';

interface CommunityStats {
  unreadCount: number;
  pendingModeration: number;
  responseRate: number;
  avgResponseTime: string;
}

const DEFAULT_STATS: CommunityStats = {
  unreadCount: 47,
  pendingModeration: 12,
  responseRate: 92.5,
  avgResponseTime: '4m 32s',
};

export function CommunityStats({ stats }: { stats?: Partial<CommunityStats> }) {
  const s = { ...DEFAULT_STATS, ...stats };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div variants={staggerItem}>
        <StatCard
          icon={MessageSquare}
          label="Unread Messages"
          value={s.unreadCount}
          trend={12}
          trendLabel="vs yesterday"
          variant="default"
        />
      </motion.div>
      <motion.div variants={staggerItem}>
        <StatCard
          icon={AlertTriangle}
          label="Pending Moderation"
          value={s.pendingModeration}
          trend={-8}
          trendLabel="vs yesterday"
          variant="warning"
        />
      </motion.div>
      <motion.div variants={staggerItem}>
        <StatCard
          icon={CheckCircle2}
          label="Response Rate"
          value={`${s.responseRate}%`}
          trend={2.3}
          trendLabel="this week"
          variant="success"
        />
      </motion.div>
      <motion.div variants={staggerItem}>
        <StatCard
          icon={Clock}
          label="Avg Response Time"
          value={s.avgResponseTime}
          trend={-15}
          trendLabel="faster this week"
          variant="default"
        />
      </motion.div>
    </div>
  );
}
