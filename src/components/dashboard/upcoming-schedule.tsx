'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { ArrowRight, Music2, Film, Image, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';

/* ── Demo schedule data ── */
const SCHEDULE = [
  {
    id: 1,
    platform: 'TikTok',
    icon: Music2,
    preview: 'That clutch was INSANE! Watch till the end for the plot twist nobody expected 🔥',
    time: 'in 2 hours',
    status: 'Scheduled' as const,
    color: 'text-[#FF004F]',
    bg: 'bg-[#FF004F]/10',
  },
  {
    id: 2,
    platform: 'YouTube',
    icon: Film,
    preview: 'BEST of Friday Night Gaming — highlights from the 4-hour stream with special guest',
    time: 'tomorrow at 9am',
    status: 'Scheduled' as const,
    color: 'text-danger',
    bg: 'bg-danger-subtle',
  },
  {
    id: 3,
    platform: 'Instagram',
    icon: Image,
    preview: 'Behind the scenes of our latest setup upgrade. Rate the cable management out of 10',
    time: 'tomorrow at 2pm',
    status: 'Processing' as const,
    color: 'text-[#E1306C]',
    bg: 'bg-[#E1306C]/10',
  },
  {
    id: 4,
    platform: 'TikTok',
    icon: Music2,
    preview: "POV: You're about to hit the nastiest flick shot of your career. #gaming #fps",
    time: 'in 2 days',
    status: 'Ready' as const,
    color: 'text-[#FF004F]',
    bg: 'bg-[#FF004F]/10',
  },
  {
    id: 5,
    platform: 'YouTube',
    icon: Film,
    preview: 'Full VOD breakdown: analyzing every play from the $50K tournament finals',
    time: 'in 3 days',
    status: 'Scheduled' as const,
    color: 'text-danger',
    bg: 'bg-danger-subtle',
  },
];

const statusVariants: Record<string, 'success' | 'warning' | 'accent'> = {
  Scheduled: 'accent',
  Processing: 'warning',
  Ready: 'success',
};

export function UpcomingSchedule() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Upcoming Schedule
        </CardTitle>
        <Link
          href="/publishing"
          className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Manage
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {SCHEDULE.length === 0 ? (
          <EmptyState
            icon={Globe}
            title="No scheduled posts"
            description="Queue up your clips and start posting across platforms."
            actionLabel="Schedule a Post"
          />
        ) : (
          <div className="space-y-3">
            {SCHEDULE.map((post, i) => (
              <MotionDiv
                key={post.id}
                variants={staggerItem}
                custom={i}
                className={cn(
                  'flex items-start gap-3 rounded-lg p-2.5',
                  'transition-all duration-200 hover:bg-background-elevated/50',
                  'backdrop-blur-xl bg-background-card/80 border border-white/5',
                )}
              >
                {/* Platform icon */}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    post.bg,
                  )}
                >
                  <post.icon className={cn('h-4 w-4', post.color)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-primary">
                      {post.platform}
                    </span>
                    <span className="text-2xs text-text-tertiary">
                      {post.time}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {post.preview}
                  </p>
                </div>

                {/* Status badge */}
                <Badge
                  variant={statusVariants[post.status] || 'default'}
                  className="shrink-0 text-2xs"
                >
                  {post.status}
                </Badge>
              </MotionDiv>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingScheduleSkeleton() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-5 w-36 animate-pulse rounded bg-background-elevated" />
        <div className="h-4 w-16 animate-pulse rounded bg-background-elevated" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 p-2.5">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-background-elevated" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-14 animate-pulse rounded bg-background-elevated" />
                <div className="h-3 w-20 animate-pulse rounded bg-background-elevated" />
              </div>
              <div className="h-3 w-full animate-pulse rounded bg-background-elevated" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-background-elevated" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
