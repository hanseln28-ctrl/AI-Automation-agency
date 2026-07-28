'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Video, Send, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { UsageStats } from '@/lib/stripe/helpers';

interface UsageMeterProps {
  usage: UsageStats;
}

function UsageBar({
  icon: Icon,
  label,
  used,
  limit,
}: {
  icon: React.ElementType;
  label: string;
  used: number;
  limit: number | 'unlimited';
}) {
  const isUnlimited = limit === 'unlimited';
  const percentage = isUnlimited ? 0 : Math.min((used / (limit as number)) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;
  const isOverLimit = !isUnlimited && percentage >= 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <Icon className="h-3.5 w-3.5" />
          <span>{label}</span>
        </div>
        <span className={cn('text-sm font-mono tabular-nums', isOverLimit ? 'text-danger' : isNearLimit ? 'text-warning' : 'text-text-primary')}>
          {used.toLocaleString()}
          {isUnlimited ? '' : ` / ${(limit as number).toLocaleString()}`}
        </span>
      </div>

      {isUnlimited ? (
        <div className="h-2 w-full rounded-full bg-background-surface">
          <motion.div
            className="h-full rounded-full bg-accent/30"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      ) : (
        <div className="h-2 w-full rounded-full bg-background-surface">
          <motion.div
            className={cn(
              'h-full rounded-full transition-colors',
              isOverLimit
                ? 'bg-danger'
                : isNearLimit
                  ? 'bg-warning'
                  : 'bg-accent',
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}

export function UsageMeter({ usage }: UsageMeterProps) {
  const clipsLimitVal = typeof usage.clipsLimit === 'number' ? usage.clipsLimit : 'unlimited';
  const platformsLimitVal = typeof usage.platformsLimit === 'number' ? usage.platformsLimit : 'unlimited';

  return (
    <div className="space-y-4 rounded-xl border border-border-subtle bg-background-card p-5">
      <h3 className="text-sm font-semibold text-text-primary">Usage This Month</h3>
      <UsageBar
        icon={Video}
        label="Clips Generated"
        used={usage.clipsUsed}
        limit={clipsLimitVal}
      />
      <UsageBar
        icon={Send}
        label="Posts Scheduled"
        used={usage.postsUsed}
        limit={usage.postsLimit}
      />
      <UsageBar
        icon={BarChart3}
        label="Platforms Connected"
        used={usage.platformsUsed}
        limit={platformsLimitVal}
      />
    </div>
  );
}
