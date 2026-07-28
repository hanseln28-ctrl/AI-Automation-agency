'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import {
  Upload,
  Scissors,
  Send,
  Trophy,
  MessageCircle,
  UserPlus,
  DollarSign,
  Sparkles,
  Clock,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/* ── Demo activity data ── */
interface ActivityItem {
  id: number;
  icon: LucideIcon;
  message: string;
  timestamp: string;
  color: string;
  bg: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 1,
    icon: Upload,
    message: "Stream imported: 'Friday Night Gaming' — 2h 15m",
    timestamp: '10 minutes ago',
    color: 'text-accent',
    bg: 'bg-accent-subtle',
  },
  {
    id: 2,
    icon: Scissors,
    message: "3 clips generated from 'Friday Night Gaming'",
    timestamp: '8 minutes ago',
    color: 'text-success',
    bg: 'bg-success-subtle',
  },
  {
    id: 3,
    icon: Send,
    message: "Clip posted to TikTok: 'That clutch was insane'",
    timestamp: '5 minutes ago',
    color: 'text-[#FF004F]',
    bg: 'bg-[#FF004F]/10',
  },
  {
    id: 4,
    icon: Trophy,
    message: 'New follower milestone: 5,000 reached 🎉',
    timestamp: '1 hour ago',
    color: 'text-warning',
    bg: 'bg-warning-subtle',
  },
  {
    id: 5,
    icon: MessageCircle,
    message: 'New comment on TikTok clip: "Bro this is the best..."',
    timestamp: '2 hours ago',
    color: 'text-text-secondary',
    bg: 'bg-background-elevated',
  },
  {
    id: 6,
    icon: Send,
    message: "Clip posted to YouTube Shorts: 'BEST reaction ever'",
    timestamp: '3 hours ago',
    color: 'text-danger',
    bg: 'bg-danger-subtle',
  },
  {
    id: 7,
    icon: Sparkles,
    message: "AI captions generated for 5 clips",
    timestamp: '4 hours ago',
    color: 'text-accent',
    bg: 'bg-accent-subtle',
  },
  {
    id: 8,
    icon: UserPlus,
    message: '12 new followers from TikTok clip',
    timestamp: '5 hours ago',
    color: 'text-success',
    bg: 'bg-success-subtle',
  },
  {
    id: 9,
    icon: DollarSign,
    message: 'Sponsorship report ready: $320 estimated',
    timestamp: 'Yesterday',
    color: 'text-warning',
    bg: 'bg-warning-subtle',
  },
  {
    id: 10,
    icon: Video,
    message: "Stream imported: 'Monday Grind Session' — 3h 45m",
    timestamp: 'Yesterday',
    color: 'text-accent',
    bg: 'bg-accent-subtle',
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" />
          <CardTitle className="text-base font-semibold">
            Recent Activity
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-border-subtle" />

          <div className="space-y-1">
            {ACTIVITIES.map((activity, i) => (
              <MotionDiv
                key={activity.id}
                variants={staggerItem}
                custom={i}
                className="relative flex items-start gap-3 py-2 pl-1"
              >
                {/* Timeline dot */}
                <div
                  className={cn(
                    'relative z-10 flex h-[10px] w-[10px] shrink-0 items-center justify-center rounded-full',
                    activity.bg,
                    'ring-2 ring-background',
                  )}
                >
                  <div
                    className={cn(
                      'h-[6px] w-[6px] rounded-full',
                      activity.bg.replace('/10', ''),
                    )}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary">{activity.message}</p>
                  <span className="text-xs text-text-tertiary">
                    {activity.timestamp}
                  </span>
                </div>

                {/* Icon */}
                <activity.icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 opacity-50',
                    activity.color,
                  )}
                />
              </MotionDiv>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivitySkeleton() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-background-elevated" />
          <div className="h-5 w-32 animate-pulse rounded bg-background-elevated" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3 py-1">
              <div className="h-[10px] w-[10px] animate-pulse rounded-full bg-background-elevated" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-full animate-pulse rounded bg-background-elevated" />
                <div className="h-3 w-20 animate-pulse rounded bg-background-elevated" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
