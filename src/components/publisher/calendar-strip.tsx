'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import type { MockPost } from './types';
import { PUBLISHER_PLATFORM_CONFIG } from './types';
import { format, isToday, addDays, startOfDay, isSameDay } from 'date-fns';

interface CalendarStripProps {
  posts: MockPost[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  startDate?: Date;
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  posts,
  selectedDate,
  onSelectDate,
  startDate = new Date(),
}) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(startOfDay(startDate), i);
    const count = posts.filter((p) => {
      if (!p.scheduledTime) return false;
      return isSameDay(new Date(p.scheduledTime), d);
    }).length;
    return { date: d, count };
  });

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-background-surface p-2">
      {days.map(({ date, count }, i) => {
        const isSelected = isSameDay(date, selectedDate);
        const today = isToday(date);
        return (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectDate(date)}
            className={cn(
              'flex min-w-[64px] flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all duration-150',
              isSelected
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-secondary hover:bg-background-card hover:text-text-primary',
            )}
          >
            <span className="text-2xs font-medium uppercase">
              {format(date, 'EEE')}
            </span>
            <span className={cn(
              'text-lg font-bold leading-none',
              today && !isSelected && 'text-accent',
            )}>
              {format(date, 'd')}
            </span>
            {/* Post dots */}
            {count > 0 && (
              <div className="flex gap-0.5 mt-0.5">
                {Array.from({ length: Math.min(count, 4) }).map((_, j) => (
                  <span
                    key={j}
                    className={cn(
                      'h-1 w-1 rounded-full',
                      isSelected ? 'bg-white' : 'bg-accent',
                    )}
                  />
                ))}
                {count > 4 && (
                  <span className={cn('text-2xs', isSelected ? 'text-white' : 'text-accent')}>
                    +{count - 4}
                  </span>
                )}
              </div>
            )}
            {count === 0 && <div className="h-2" />}
          </motion.button>
        );
      })}
    </div>
  );
};
