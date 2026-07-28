'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/icon';
import { cn } from '@/lib/utils/cn';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import type { Deliverable } from './types';
import { DELIVERABLE_STATUS_CONFIG, DELIVERABLE_TYPE_CONFIG } from './types';

interface DeliverablesListProps {
  deliverables: Deliverable[];
  className?: string;
}

const statusIcons: Record<string, React.ReactNode> = {
  completed: <Check className="h-3.5 w-3.5" />,
  in_progress: <Clock className="h-3.5 w-3.5" />,
  pending: <Clock className="h-3.5 w-3.5" />,
  rejected: <AlertTriangle className="h-3.5 w-3.5" />,
};

export function DeliverablesList({ deliverables, className }: DeliverablesListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn('space-y-2', className)}
    >
      {deliverables.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-tertiary">No deliverables found.</p>
      ) : (
        deliverables.map((deliverable) => {
          const statusConfig = DELIVERABLE_STATUS_CONFIG[deliverable.status];
          const typeConfig = DELIVERABLE_TYPE_CONFIG[deliverable.type];
          const isComplete = deliverable.status === 'completed';

          return (
            <motion.div
              key={deliverable.id}
              variants={staggerItem}
              className={cn(
                'flex items-center gap-4 rounded-lg border border-border-subtle bg-background-card p-4 transition-colors',
                isComplete && 'border-success/10 bg-success-subtle/10',
              )}
            >
              {/* Status indicator */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                  isComplete
                    ? 'border-success bg-success-subtle text-success'
                    : deliverable.status === 'in_progress'
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border bg-background-surface text-text-tertiary',
                )}
              >
                {statusIcons[deliverable.status]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isComplete ? 'text-text-secondary line-through' : 'text-text-primary',
                    )}
                  >
                    {deliverable.title}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="ghost" className="text-2xs">
                    {typeConfig.label}
                  </Badge>
                  <span className="text-2xs text-text-tertiary capitalize">{deliverable.platform}</span>
                  <span className="text-2xs text-text-tertiary">
                    Due {new Date(deliverable.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  {deliverable.completedAt && (
                    <span className="text-2xs text-success">
                      Completed {new Date(deliverable.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <Badge variant={statusConfig.variant} className="shrink-0">
                {statusConfig.label}
              </Badge>
            </motion.div>
          );
        })}
      )}
    </motion.div>
  );
}
