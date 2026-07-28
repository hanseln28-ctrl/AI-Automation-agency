'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import type { MockPost } from './types';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  getDay,
} from 'date-fns';

interface CalendarViewProps {
  posts: MockPost[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  /** Posts for the selected day shown in sidebar */
  sidebarPosts: MockPost[];
  onEdit: (id: string) => void;
  onPostNow: (id: string) => void;
  onDelete: (id: string) => void;
}

function buildMonthGrid(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const days: Date[] = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  posts,
  selectedDate,
  onSelectDate,
  currentMonth,
  onMonthChange,
  sidebarPosts,
  onEdit,
  onPostNow,
  onDelete,
}) => {
  const days = buildMonthGrid(currentMonth);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getPostsOnDay = (date: Date): MockPost[] => {
    return posts.filter((p) => {
      if (!p.scheduledTime) return false;
      return isSameDay(new Date(p.scheduledTime), date);
    });
  };

  const goToPrevMonth = () => onMonthChange(addDays(startOfMonth(currentMonth), -1));
  const goToNextMonth = () => onMonthChange(addDays(endOfMonth(currentMonth), 1));

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Calendar Grid */}
      <div className="flex-1 rounded-xl border border-border bg-background-card p-4">
        {/* Month header */}
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goToPrevMonth} className="h-8 w-8 p-0">
            <Icon name="chevron-left" size="sm" />
          </Button>
          <h3 className="text-sm font-semibold text-text-primary">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="ghost" size="sm" onClick={goToNextMonth} className="h-8 w-8 p-0">
            <Icon name="chevron-right" size="sm" />
          </Button>
        </div>

        {/* Day name headers */}
        <div className="mb-2 grid grid-cols-7">
          {dayNames.map((name) => (
            <div key={name} className="py-1 text-center text-2xs font-medium text-text-tertiary">
              {name}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, currentMonth);
            const selected = isSameDay(day, selectedDate);
            const today = isToday(day);
            const dayPosts = getPostsOnDay(day);

            return (
              <MotionButton
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectDate(day)}
                className={cn(
                  'flex flex-col items-center rounded-lg py-1.5 transition-all duration-150',
                  !inMonth && 'opacity-30',
                  selected
                    ? 'bg-accent text-white'
                    : today
                      ? 'bg-accent-subtle text-accent'
                      : 'text-text-secondary hover:bg-background-elevated hover:text-text-primary',
                )}
              >
                <span className={cn('text-xs font-medium', today && !selected && 'font-bold')}>
                  {format(day, 'd')}
                </span>
                {dayPosts.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: Math.min(dayPosts.length, 3) }).map((_, j) => (
                      <span
                        key={j}
                        className={cn(
                          'h-1 w-1 rounded-full',
                          selected ? 'bg-white' : 'bg-accent',
                        )}
                      />
                    ))}
                  </div>
                )}
              </MotionButton>
            );
          })}
        </div>
      </div>

      {/* Side Panel: posts for selected day */}
      <div className="w-full rounded-xl border border-border bg-background-card p-4 lg:w-80">
        <h4 className="mb-3 text-sm font-semibold text-text-primary">
          {format(selectedDate, 'EEEE, MMM d')}
        </h4>
        {sidebarPosts.length === 0 ? (
          <div className="py-8 text-center">
            <Icon name="calendar" size="lg" color="text-text-tertiary" className="mx-auto mb-2" />
            <p className="text-xs text-text-secondary">No posts scheduled</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sidebarPosts
              .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
              .map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border border-border bg-background-surface p-3 transition-colors hover:border-text-tertiary"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-text-primary">
                        {post.clipTitle}
                      </p>
                      <p className="mt-0.5 text-2xs text-text-tertiary">
                        {format(new Date(post.scheduledTime), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-2xs" onClick={() => onEdit(post.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-2xs" onClick={() => onPostNow(post.id)}>
                      Post Now
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-2xs text-danger" onClick={() => onDelete(post.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
