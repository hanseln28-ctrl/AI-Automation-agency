'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Heart, Reply, Flag, Archive, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PLATFORM_CONFIG, SENTIMENT_CONFIG, COMMENT_STATUS_CONFIG } from './types';
import type { MockComment, CommunityPlatform } from './types';

interface CommentCardProps {
  comment: MockComment;
  selected: boolean;
  onSelect: (id: string) => void;
  onReply: (comment: MockComment) => void;
  onLike: (comment: MockComment) => void;
  onFlag: (comment: MockComment) => void;
  onArchive: (comment: MockComment) => void;
}

export function CommentCard({
  comment,
  selected,
  onSelect,
  onReply,
  onLike,
  onFlag,
  onArchive,
}: CommentCardProps) {
  const platform = comment.platform as CommunityPlatform;
  const platformCfg = PLATFORM_CONFIG[platform];
  const sentimentCfg = SENTIMENT_CONFIG[comment.sentiment];
  const statusCfg = COMMENT_STATUS_CONFIG[comment.status];

  const timeAgo = formatTimeAgo(comment.timestamp);

  return (
    <MotionDiv
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group rounded-xl border p-4 transition-all',
        selected
          ? 'border-accent bg-accent-subtle/50'
          : 'border-border-subtle bg-background-card hover:border-border',
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <label className="mt-1 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(comment.id)}
            className="h-4 w-4 rounded border-border bg-background-surface accent-accent"
          />
        </label>

        {/* User avatar */}
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-background-elevated text-xs text-text-secondary">
            {comment.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-text-primary">
              {comment.username}
            </span>
            <Badge variant="outline" className={cn('text-2xs', platformCfg.badgeClass)}>
              {platformCfg.label}
            </Badge>
            <Badge variant="outline" className={cn('text-2xs', sentimentCfg.badgeClass)}>
              {sentimentCfg.emoji} {sentimentCfg.label}
            </Badge>
            <Badge variant={statusCfg.variant} className="text-2xs">
              {statusCfg.label}
            </Badge>
            <span className="text-2xs text-text-tertiary">{timeAgo}</span>
          </div>

          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
            {comment.commentText}
          </p>

          {comment.postTitle && (
            <p className="mt-1.5 text-2xs text-text-tertiary">
              on <span className="text-text-secondary">{comment.postTitle}</span>
            </p>
          )}

          {/* Actions row */}
          <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-text-secondary hover:text-accent"
              onClick={() => onReply(comment)}
            >
              <Reply className="mr-1 h-3 w-3" />
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-text-secondary hover:text-success"
              onClick={() => onLike(comment)}
            >
              <Heart className="mr-1 h-3 w-3" />
              {comment.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-text-secondary hover:text-warning"
              onClick={() => onFlag(comment)}
            >
              <Flag className="mr-1 h-3 w-3" />
              Flag
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-text-secondary hover:text-text-primary"
              onClick={() => onArchive(comment)}
            >
              <Archive className="mr-1 h-3 w-3" />
              Archive
            </Button>
          </div>
        </div>

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onReply(comment)}>
              <Reply className="mr-2 h-4 w-4" /> Reply
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFlag(comment)}>
              <Flag className="mr-2 h-4 w-4" /> Flag
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onArchive(comment)}>
              <Archive className="mr-2 h-4 w-4" /> Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </MotionDiv>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
