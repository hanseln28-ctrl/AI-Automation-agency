'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/shared/icon';
import { MomentBadge } from './moment-badge';
import { CLIP_STATUS_CONFIG, FORMAT_CONFIG } from './types';
import type { MockClip } from './types';

interface ClipCardProps {
  clip: MockClip;
  index: number;
}

const formatIconMap: Record<string, string> = {
  vertical: 'maximize-2',
  horizontal: 'minimize-2',
  square: 'grid',
};

export function ClipCard({ clip, index }: ClipCardProps) {
  const router = useRouter();

  const formatConfig = FORMAT_CONFIG[clip.format];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group rounded-xl border border-border-subtle bg-background-card overflow-hidden hover:border-border transition-colors hover:shadow-glass"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-background-elevated to-background overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-60',
            clip.thumbnailGradient,
          )}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="play" size="lg" color="text-white" />
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="inline-flex items-center rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-2xs font-medium text-white">
            {clip.duration}s
          </span>
          <span className="inline-flex items-center rounded-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-2xs text-white">
            <Icon name={formatIconMap[clip.format] as any} size="xs" color="text-white" />
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={CLIP_STATUS_CONFIG[clip.status].variant} className="text-2xs">
            {CLIP_STATUS_CONFIG[clip.status].label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h4
          className="text-sm font-semibold text-text-primary line-clamp-1 cursor-pointer hover:text-accent transition-colors"
          onClick={() => router.push(`/clips/${clip.id}`)}
        >
          {clip.title}
        </h4>

        <p className="text-2xs text-text-tertiary truncate">{clip.sourceStreamName}</p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <MomentBadge type={clip.momentType} showIcon />
        </div>

        {/* Stats + Actions */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <div className="flex items-center gap-3 text-2xs text-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <Icon name="eye" size="xs" />
              {clip.views > 0 ? `${(clip.views / 1000).toFixed(1)}k` : '—'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="heart" size="xs" />
              {clip.engagement > 0 ? `${(clip.engagement / 1000).toFixed(1)}k` : '—'}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Icon name="more-horizontal" size="sm" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/clips/${clip.id}`)}>
                <Icon name="edit" size="sm" className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon name="download" size="sm" className="mr-2" />
                Download
              </DropdownMenuItem>
              {clip.status === 'ready' && (
                <DropdownMenuItem>
                  <Icon name="send" size="sm" className="mr-2" />
                  Publish
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger">
                <Icon name="trash-2" size="sm" className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
