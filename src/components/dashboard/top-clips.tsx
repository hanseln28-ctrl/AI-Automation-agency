'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/* ── Demo clip data ── */
const TOP_CLIPS = [
  {
    id: 1,
    title: 'That clutch was absolutely insane! 🔥',
    platform: 'TikTok',
    views: '2.4M',
    engagement: '8.7%',
    date: '2 hours ago',
    gradient: 'from-purple-600 to-blue-600',
  },
  {
    id: 2,
    title: 'When the whole lobby goes silent...',
    platform: 'YouTube',
    views: '1.8M',
    engagement: '6.2%',
    date: '5 hours ago',
    gradient: 'from-red-600 to-orange-600',
  },
  {
    id: 3,
    title: 'BEST reaction to winning $10k 💰',
    platform: 'TikTok',
    views: '956K',
    engagement: '11.3%',
    date: '8 hours ago',
    gradient: 'from-green-600 to-teal-600',
  },
  {
    id: 4,
    title: 'Teaching a noob how to build in 60 sec',
    platform: 'Instagram',
    views: '720K',
    engagement: '5.8%',
    date: 'Yesterday',
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    id: 5,
    title: 'The funniest fail compilation #247 😂',
    platform: 'YouTube',
    views: '510K',
    engagement: '9.1%',
    date: 'Yesterday',
    gradient: 'from-yellow-600 to-amber-600',
  },
];

const platformVariants: Record<string, 'default' | 'accent' | 'success' | 'warning'> = {
  TikTok: 'accent',
  YouTube: 'danger',
  Instagram: 'warning',
};

export function TopClips() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Top Performing Clips
        </CardTitle>
        <Link
          href="/clips"
          className="flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-hover"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {TOP_CLIPS.map((clip, i) => (
          <motion.div
            key={clip.id}
            variants={staggerItem}
            custom={i}
            className={cn(
              'group flex items-center gap-3 rounded-lg p-2.5',
              'transition-all duration-200 hover:bg-background-elevated/50',
              'backdrop-blur-xl bg-background-card/80 border border-white/5',
            )}
          >
            {/* Thumbnail */}
            <div
              className={cn(
                'relative h-14 w-14 shrink-0 overflow-hidden rounded-lg',
                'bg-gradient-to-br',
                clip.gradient,
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-5 w-5 text-white/80 drop-shadow-lg" />
              </div>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {clip.title}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={platformVariants[clip.platform] || 'default'}>
                  {clip.platform}
                </Badge>
                <span className="text-xs text-text-tertiary">
                  {clip.date}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="hidden shrink-0 items-center gap-4 text-right sm:flex">
              <div className="flex items-center gap-1 text-xs">
                <Eye className="h-3 w-3 text-text-tertiary" />
                <span className="font-medium text-text-primary">{clip.views}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Heart className="h-3 w-3 text-text-tertiary" />
                <span className="font-medium text-text-primary">
                  {clip.engagement}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopClipsSkeleton() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-5 w-36 animate-pulse rounded bg-background-elevated" />
        <div className="h-4 w-14 animate-pulse rounded bg-background-elevated" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-2.5">
            <div className="h-14 w-14 animate-pulse rounded-lg bg-background-elevated" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-background-elevated" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-background-elevated" />
                <div className="h-4 w-20 animate-pulse rounded bg-background-elevated" />
              </div>
            </div>
            <div className="hidden sm:flex gap-4">
              <div className="h-4 w-14 animate-pulse rounded bg-background-elevated" />
              <div className="h-4 w-12 animate-pulse rounded bg-background-elevated" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
