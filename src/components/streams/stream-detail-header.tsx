'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG, STATUS_CONFIG } from './types';
import type { MockStream } from './types';

interface StreamDetailHeaderProps {
  stream: MockStream;
}

export function StreamDetailHeader({ stream }: StreamDetailHeaderProps) {
  const router = useRouter();
  const config = PLATFORM_CONFIG[stream.platform];
  const statusConfig = STATUS_CONFIG[stream.status];

  return (
    <div className="space-y-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-text-secondary hover:text-text-primary -ml-2"
        onClick={() => router.push('/streams')}
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Back to Streams
      </Button>

      {/* Header Card */}
      <div className="rounded-xl border border-border-subtle bg-background-card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Thumbnail */}
          <div
            className={cn(
              'w-full md:w-64 h-36 md:h-auto shrink-0 bg-gradient-to-br',
              stream.thumbnailGradient,
            )}
          />

          {/* Info */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-xl font-bold text-text-primary">
                  {stream.title}
                </h1>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                <Badge
                  variant="outline"
                  className={cn('text-xs', config.badgeClass)}
                >
                  {config.label}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-text-tertiary" />
                  {stream.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-text-tertiary" />
                  {stream.importDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
