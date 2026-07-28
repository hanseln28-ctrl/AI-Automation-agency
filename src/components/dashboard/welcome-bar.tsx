'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { CalendarDays, Sparkles, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';

const TIPS = [
  'Streams with custom thumbnails get 2.3x more clip views.',
  'Posting within 24 hours of a stream boosts engagement by 40%.',
  'Clips under 60 seconds have the highest completion rate on TikTok.',
  'Adding captions increases watch time by an average of 12%.',
  'The best time to post on Instagram is Tuesday at 11 AM.',
  'Creators who post 3+ clips daily see 5x follower growth.',
  'Vertical clips (9:16) outperform horizontal by 4x on mobile.',
];

interface WelcomeBarProps {
  userName: string;
}

export function WelcomeBar({ userName }: WelcomeBarProps) {
  const [tipIndex, setTipIndex] = React.useState(() =>
    Math.floor(Math.random() * TIPS.length),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <MotionDiv
      variants={staggerItem}
      className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
    >
      <div className="flex-1 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {greeting},{' '}
          <span className="bg-gradient-to-r from-accent to-[#8B7CF7] bg-clip-text text-transparent">
            {userName}
          </span>
        </h1>
        <p className="text-sm text-text-secondary sm:text-base">
          Here&apos;s what&apos;s happening with your content today
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs text-text-tertiary">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Rotating AI Tip */}
      <MotionDiv
        key={tipIndex}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'flex items-start gap-3 rounded-xl border border-accent/20',
          'bg-accent-subtle px-4 py-3 shadow-glass',
          'sm:max-w-xs',
        )}
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/20">
          <Lightbulb className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-accent">
            <Sparkles className="mr-1 inline-block h-3 w-3" />
            Pro Tip
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
            {TIPS[tipIndex]}
          </p>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
