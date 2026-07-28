'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { Search, Filter, Archive, CheckSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/empty-state';
import { CommentCard } from './comment-card';
import { PLATFORM_CONFIG } from './types';
import type { MockComment, CommunityPlatform } from './types';

interface CommentsListProps {
  comments: MockComment[];
  onReply: (comment: MockComment) => void;
  onLike: (comment: MockComment) => void;
  onFlag: (comment: MockComment) => void;
  onArchive: (comment: MockComment) => void;
  onBulkArchive: (ids: string[]) => void;
}

const PLATFORMS: { value: CommunityPlatform | 'all'; label: string }[] = [
  { value: 'all', label: 'All Platforms' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X' },
];

export function CommentsList({
  comments,
  onReply,
  onLike,
  onFlag,
  onArchive,
  onBulkArchive,
}: CommentsListProps) {
  const [search, setSearch] = React.useState('');
  const [platformFilter, setPlatformFilter] = React.useState<CommunityPlatform | 'all'>('all');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    return comments.filter((c) => {
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false;
      if (search && !c.commentText.toLowerCase().includes(search.toLowerCase()) && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [comments, search, platformFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((c) => c.id)));
    }
  };

  const handleBulkArchive = () => {
    onBulkArchive(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
            <Input
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                onClick={() => setSearch('')}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform filter pills */}
          <div className="flex items-center gap-1">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatformFilter(p.value)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  platformFilter === p.value
                    ? 'bg-accent text-white'
                    : 'bg-background-elevated text-text-secondary hover:text-text-primary',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 rounded-lg border border-accent bg-accent-subtle/30 px-4 py-2"
          >
            <span className="text-sm text-text-secondary">
              {selectedIds.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-text-secondary hover:text-text-primary"
              onClick={selectAll}
            >
              <CheckSquare className="mr-1 h-3.5 w-3.5" />
              {selectedIds.size === filtered.length ? 'Deselect all' : 'Select all'}
            </Button>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleBulkArchive}
              >
                <Archive className="mr-1 h-3.5 w-3.5" />
                Archive selected
              </Button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Comments list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No comments found"
            description={search ? 'Try adjusting your search terms' : 'No comments in this view'}
          />
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                selected={selectedIds.has(comment.id)}
                onSelect={toggleSelect}
                onReply={onReply}
                onLike={onLike}
                onFlag={onFlag}
                onArchive={onArchive}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
