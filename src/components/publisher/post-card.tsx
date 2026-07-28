'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MockPost } from './types';
import { PUBLISHER_PLATFORM_CONFIG, POST_STATUS_CONFIG } from './types';
import { format, isToday, isTomorrow } from 'date-fns';

interface PostCardProps {
  post: MockPost;
  onEdit: (id: string) => void;
  onPostNow: (id: string) => void;
  onReschedule: (id: string) => void;
  onDelete: (id: string) => void;
  onRetry?: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  showCheckbox?: boolean;
}

function formatScheduledTime(iso: string): string {
  if (!iso) return 'Not scheduled';
  const d = new Date(iso);
  const time = format(d, 'h:mm a');
  if (isToday(d)) return `Today at ${time}`;
  if (isTomorrow(d)) return `Tomorrow at ${time}`;
  return format(d, 'MMM d, yyyy — h:mm a');
}

function truncateCaption(text: string, max = 80): string {
  if (!text) return 'No caption';
  if (text.length <= max) return text;
  return text.slice(0, max) + '...';
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onPostNow,
  onReschedule,
  onDelete,
  onRetry,
  selected = false,
  onSelect,
  showCheckbox = false,
}) => {
  const statusCfg = POST_STATUS_CONFIG[post.status];
  const primaryPlatform = post.platforms[0];
  const platformCfg = primaryPlatform ? PUBLISHER_PLATFORM_CONFIG[primaryPlatform] : null;

  return (
    <MotionDiv
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        'group relative flex items-center gap-4 rounded-xl border bg-background-card p-4 transition-all duration-200',
        'border-border hover:border-border-hover hover:shadow-glass',
        selected && 'border-accent bg-accent-subtle/10',
      )}
    >
      {/* Checkbox */}
      {showCheckbox && onSelect && (
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(post.id, e.target.checked)}
            className="h-4 w-4 rounded border-border bg-background-surface accent-accent"
          />
        </div>
      )}

      {/* Platform indicator */}
      {platformCfg && (
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
            platformCfg.bgClass,
          )}
        >
          <Icon name={platformCfg.icon as any} size="sm" color={platformCfg.textClass} />
        </div>
      )}

      {/* Thumbnail gradient */}
      <div
        className={cn(
          'hidden h-12 w-20 flex-shrink-0 rounded-lg bg-gradient-to-br sm:block',
          post.thumbnailGradient,
        )}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-sm font-semibold text-text-primary">
            {post.clipTitle}
          </h4>
          <Badge variant={statusCfg.variant} className="text-2xs flex-shrink-0">
            {statusCfg.label}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-text-secondary">
          {truncateCaption(post.primaryCaption || post.platformEntries[0]?.caption || '')}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-2xs text-text-tertiary">
          <span className="flex items-center gap-1">
            <Icon name="clock" size="xs" color="text-text-tertiary" />
            {formatScheduledTime(post.scheduledTime)}
          </span>
          <span className="flex items-center gap-1">
            {post.platforms.map((p) => (
              <span
                key={p}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full"
                style={{ backgroundColor: PUBLISHER_PLATFORM_CONFIG[p].color + '30' }}
              >
                <Icon name={PUBLISHER_PLATFORM_CONFIG[p].icon as any} size="xs" color={PUBLISHER_PLATFORM_CONFIG[p].textClass} />
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {post.status === 'failed' && onRetry && (
          <Button variant="outline" size="sm" onClick={() => onRetry(post.id)} className="h-8 px-2 text-xs">
            <Icon name="refresh-cw" size="xs" className="mr-1" />
            Retry
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => onEdit(post.id)} className="h-8 px-2 text-xs">
          Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Icon name="more-horizontal" size="sm" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onPostNow(post.id)}>
              <Icon name="send" size="xs" className="mr-2" />
              Post Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReschedule(post.id)}>
              <Icon name="calendar" size="xs" className="mr-2" />
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(post.id)}
              className="text-danger focus:text-danger"
            >
              <Icon name="trash-2" size="xs" className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </MotionDiv>
  );
};
