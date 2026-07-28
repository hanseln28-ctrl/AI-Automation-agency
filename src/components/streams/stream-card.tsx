'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MoreHorizontal, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PLATFORM_CONFIG, STATUS_CONFIG } from './types';
import type { MockStream } from './types';

interface StreamCardProps {
  stream: MockStream;
  index: number;
}

export function StreamCard({ stream, index }: StreamCardProps) {
  const router = useRouter();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="rounded-xl border border-border-subtle bg-background-card p-4 cursor-pointer hover:bg-background-surface/50 transition-colors"
      onClick={() => router.push(`/streams/${stream.id}`)}
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div
          className={cn(
            'h-16 w-28 shrink-0 rounded-lg bg-gradient-to-br',
            stream.thumbnailGradient,
          )}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-text-primary truncate">
              {stream.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 -mr-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/streams/${stream.id}`);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Clips
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-process
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-danger"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-1.5 flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={cn('text-2xs', PLATFORM_CONFIG[stream.platform].badgeClass)}
            >
              {PLATFORM_CONFIG[stream.platform].label}
            </Badge>
            <span className="text-2xs text-text-tertiary">{stream.duration}</span>
            <span className="text-2xs text-text-tertiary">{stream.importDate}</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <Badge variant={STATUS_CONFIG[stream.status].variant} className="text-2xs">
              {STATUS_CONFIG[stream.status].label}
            </Badge>
            {stream.status !== 'completed' && stream.status !== 'failed' && (
              <>
                <Progress
                  value={stream.progress}
                  className="h-1.5 flex-1 max-w-[80px]"
                  indicatorClassName={
                    stream.status === 'failed' ? 'bg-danger' : 'bg-accent'
                  }
                />
                <span className="text-2xs text-text-tertiary tabular-nums">
                  {stream.progress}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
