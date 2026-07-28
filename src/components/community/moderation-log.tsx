'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { History, CheckCircle2, Trash2, Ban, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { MODERATION_ACTION_CONFIG } from './types';
import type { MockModerationLogEntry } from './types';

interface ModerationLogProps {
  entries: MockModerationLogEntry[];
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  approved: <CheckCircle2 className="h-4 w-4 text-success" />,
  deleted: <Trash2 className="h-4 w-4 text-danger" />,
  banned: <Ban className="h-4 w-4 text-danger" />,
  ignored: <EyeOff className="h-4 w-4 text-text-tertiary" />,
};

export function ModerationLog({ entries }: ModerationLogProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-text-secondary" />
        <h3 className="text-sm font-semibold text-text-primary">Moderation Log</h3>
        <Badge variant="ghost" className="text-2xs">
          {entries.length} actions
        </Badge>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="No moderation actions yet"
          description="Actions taken by you or auto-mod will appear here"
        />
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => {
            const actionCfg = MODERATION_ACTION_CONFIG[entry.action];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: i * 0.03 }}
              >
                <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-background-surface/50">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-surface">
                    {ACTION_ICONS[entry.action] || (
                      <EyeOff className="h-4 w-4 text-text-tertiary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={actionCfg.variant} className="text-2xs">
                        {actionCfg.label}
                      </Badge>
                      <span className="text-xs text-text-secondary">
                        {entry.targetType === 'user' ? '👤' : entry.targetType === 'comment' ? '💬' : '✉️'}{' '}
                        {entry.target}
                      </span>
                    </div>
                    <p className="mt-0.5 text-2xs text-text-tertiary">
                      Reason: {entry.reason}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-2xs text-text-tertiary">{formatTime(entry.date)}</p>
                    <p className="text-2xs text-text-tertiary">by {entry.moderator}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
