'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, Ban, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { EmptyState } from '@/components/shared/empty-state';
import { PLATFORM_CONFIG } from './types';
import type { MockFlaggedContent, CommunityPlatform } from './types';

interface ModerationQueueProps {
  items: MockFlaggedContent[];
  onApprove: (item: MockFlaggedContent) => void;
  onDelete: (item: MockFlaggedContent) => void;
  onBan: (item: MockFlaggedContent) => void;
  onIgnore: (item: MockFlaggedContent) => void;
}

export function ModerationQueue({
  items,
  onApprove,
  onDelete,
  onBan,
  onIgnore,
}: ModerationQueueProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-warning" />
          <h3 className="text-sm font-semibold text-text-primary">Flagged Content Queue</h3>
          <Badge variant="warning" className="text-2xs">
            {items.length} pending
          </Badge>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No flagged content"
          description="Your community is looking clean!"
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => {
              const platformCfg = PLATFORM_CONFIG[item.platform as CommunityPlatform];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  <Card className="overflow-hidden p-0">
                    <div className="flex items-start gap-4 p-4">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-background-elevated text-xs text-text-secondary">
                          {item.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-text-primary">
                            {item.username}
                          </span>
                          <Badge variant="outline" className={cn('text-2xs', platformCfg.badgeClass)}>
                            {platformCfg.label}
                          </Badge>
                          <Badge variant="outline" className="text-2xs bg-background-elevated text-text-secondary border-border">
                            {item.type === 'comment' ? '💬 Comment' : '✉️ Message'}
                          </Badge>
                          <span className="text-2xs text-text-tertiary">
                            {formatTime(item.date)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-text-secondary bg-background-surface rounded-lg p-3 border border-border-subtle">
                          {item.content}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5">
                          <Badge variant="warning" className="text-2xs">
                            Flag: {item.reason}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-1.5 border-t border-border-subtle pt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-success hover:text-success hover:bg-success-subtle"
                            onClick={() => onApprove(item)}
                          >
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-danger hover:text-danger hover:bg-danger-subtle"
                            onClick={() => onDelete(item)}
                          >
                            <XCircle className="mr-1.5 h-3.5 w-3.5" />
                            Delete
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-danger hover:text-danger hover:bg-danger-subtle"
                            onClick={() => onBan(item)}
                          >
                            <Ban className="mr-1.5 h-3.5 w-3.5" />
                            Ban User
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs text-text-tertiary hover:text-text-primary ml-auto"
                            onClick={() => onIgnore(item)}
                          >
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
