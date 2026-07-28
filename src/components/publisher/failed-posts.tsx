'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { AlertTriangle } from 'lucide-react';
import type { MockPost } from './types';
import { PUBLISHER_PLATFORM_CONFIG } from './types';

interface FailedPostsProps {
  posts: MockPost[];
  onRetry: (id: string) => void;
  onRetryAll: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const FailedPosts: React.FC<FailedPostsProps> = ({
  posts,
  onRetry,
  onRetryAll,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border bg-background-card p-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-background-elevated" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-background-elevated" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-background-elevated" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="No failed posts"
        description="All your posts have been published successfully."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Retry All */}
      {posts.length > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-danger/30 bg-danger-subtle p-3">
          <div className="flex items-center gap-2">
            <Icon name="alert-triangle" size="sm" color="text-danger" />
            <span className="text-sm text-danger">{posts.length} failed posts</span>
          </div>
          <Button variant="destructive" size="sm" onClick={onRetryAll}>
            <Icon name="refresh-cw" size="xs" className="mr-1.5" />
            Retry All
          </Button>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {posts.map((post) => {
          const primaryPlatform = post.platforms[0];
          const platformCfg = primaryPlatform ? PUBLISHER_PLATFORM_CONFIG[primaryPlatform] : null;

          return (
            <MotionDiv
              key={post.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-xl border border-danger/20 bg-background-card p-4"
            >
              <div className="flex items-start gap-4">
                {/* Platform icon */}
                {platformCfg && (
                  <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg', platformCfg.bgClass)}>
                    <Icon name={platformCfg.icon as any} size="sm" color={platformCfg.textClass} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-text-primary">{post.clipTitle}</h4>
                    <Badge variant="danger" className="text-2xs">Failed</Badge>
                  </div>

                  {/* Error message */}
                  {post.errorMessage && (
                    <div className="mt-2 rounded-lg border border-danger/30 bg-danger-subtle/50 p-2.5">
                      <div className="flex items-start gap-2">
                        <Icon name="alert-triangle" size="xs" color="text-danger" className="mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-danger">Error</p>
                          <p className="text-xs text-text-secondary">{post.errorMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Post metadata */}
                  <div className="mt-2 flex items-center gap-3 text-2xs text-text-tertiary">
                    <span>
                      {post.platforms.map((p) => PUBLISHER_PLATFORM_CONFIG[p].label).join(', ')}
                    </span>
                    {post.retryCount && post.retryCount > 0 && (
                      <span>Retried {post.retryCount}x</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => onRetry(post.id)} className="h-8 px-2 text-xs">
                    <Icon name="refresh-cw" size="xs" className="mr-1" />
                    Retry
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(post.id)} className="h-8 px-2 text-xs">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)} className="h-8 w-8 p-0 text-text-tertiary hover:text-danger">
                    <Icon name="trash-2" size="sm" />
                  </Button>
                </div>
              </div>
            </MotionDiv>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
