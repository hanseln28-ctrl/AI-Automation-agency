'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { AnimatePresence } from '@/components/shared/motion';
import { EmptyState } from '@/components/shared/empty-state';
import { Calendar } from 'lucide-react';
import { PostCard } from './post-card';
import type { MockPost } from './types';

interface QueueListProps {
  posts: MockPost[];
  isLoading?: boolean;
  onEdit: (id: string) => void;
  onPostNow: (id: string) => void;
  onReschedule: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  /** Bulk selection */
  selected: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  showCheckbox?: boolean;
}

export const QueueList: React.FC<QueueListProps> = ({
  posts,
  isLoading,
  onEdit,
  onPostNow,
  onReschedule,
  onDelete,
  onRetry,
  selected,
  onSelect,
  showCheckbox = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-background-card p-4"
          >
            <div className="h-10 w-10 animate-pulse rounded-lg bg-background-elevated" />
            <div className="hidden h-12 w-20 animate-pulse rounded-lg bg-background-elevated sm:block" />
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
        icon={Calendar}
        title="No posts scheduled for today"
        description="Create a new post to fill your queue, or check another day in the calendar view."
      />
    );
  }

  // Sort by scheduled time
  const sorted = [...posts].sort((a, b) => {
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
  });

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {sorted.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onEdit={onEdit}
            onPostNow={onPostNow}
            onReschedule={onReschedule}
            onDelete={onDelete}
            onRetry={onRetry}
            selected={selected.has(post.id)}
            onSelect={onSelect}
            showCheckbox={showCheckbox}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
