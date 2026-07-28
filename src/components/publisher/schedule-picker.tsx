'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { format, addDays, setHours, setMinutes, isSameDay } from 'date-fns';

interface SchedulePickerProps {
  scheduledTime: string; // ISO string or empty
  onChange: (iso: string) => void;
  onPostNow: () => void;
  postNow: boolean;
}

// Mock "best time" slots per platform (hour:minute pairs in 24h)
const BEST_TIMES: { label: string; hour: number; minute: number; platforms: string[] }[] = [
  { label: 'Morning Peak', hour: 9, minute: 0, platforms: ['LinkedIn', 'X'] },
  { label: 'Lunch Scroll', hour: 12, minute: 0, platforms: ['Instagram', 'Facebook', 'Threads'] },
  { label: 'Afternoon Boost', hour: 15, minute: 0, platforms: ['TikTok', 'YouTube Shorts'] },
  { label: 'Prime Time', hour: 19, minute: 0, platforms: ['TikTok', 'Instagram', 'YouTube Shorts', 'Discord'] },
  { label: 'Late Night', hour: 22, minute: 0, platforms: ['X', 'Discord'] },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export const SchedulePicker: React.FC<SchedulePickerProps> = ({
  scheduledTime,
  onChange,
  onPostNow,
  postNow,
}) => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const next7 = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const selectedDate = scheduledTime ? new Date(scheduledTime) : null;
  const selectedHour = selectedDate ? selectedDate.getHours() : 12;
  const selectedMinute = selectedDate ? selectedDate.getMinutes() : 0;

  const handleDateSelect = (date: Date) => {
    const h = selectedHour;
    const m = selectedMinute;
    const newDate = setMinutes(setHours(date, h), m);
    onChange(newDate.toISOString());
  };

  const handleHourChange = (hour: number) => {
    const base = selectedDate || tomorrow;
    const newDate = setMinutes(setHours(base, hour), selectedMinute);
    onChange(newDate.toISOString());
  };

  const handleMinuteChange = (minute: number) => {
    const base = selectedDate || tomorrow;
    const newDate = setMinutes(setHours(base, selectedHour), minute);
    onChange(newDate.toISOString());
  };

  const applyBestTime = (hour: number, minute: number) => {
    const base = selectedDate || tomorrow;
    const newDate = setMinutes(setHours(base, hour), minute);
    onChange(newDate.toISOString());
  };

  return (
    <div className="space-y-4">
      {/* Post Now toggle */}
      <label className="flex items-center gap-3 rounded-xl border border-border bg-background-surface p-3 cursor-pointer hover:border-text-tertiary transition-colors">
        <div className={cn(
          'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
          postNow ? 'border-accent bg-accent' : 'border-text-tertiary',
        )}>
          {postNow && <Icon name="check" size="xs" color="text-white" />}
        </div>
        <input
          type="checkbox"
          checked={postNow}
          onChange={onPostNow}
          className="sr-only"
        />
        <div>
          <span className="text-sm font-medium text-text-primary">Post Now</span>
          <p className="text-xs text-text-secondary">Publish immediately</p>
        </div>
      </label>

      {!postNow && (
        <>
          {/* Date selector — horizontal scroll */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Select Date</p>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {next7.map((date, i) => {
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDateSelect(date)}
                    className={cn(
                      'flex min-w-[72px] flex-col items-center rounded-lg border px-3 py-2 text-center transition-all',
                      isSelected
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-background-surface text-text-secondary hover:border-text-tertiary',
                    )}
                  >
                    <span className="text-2xs font-medium uppercase">
                      {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEE')}
                    </span>
                    <span className="text-sm font-bold">{format(date, 'd')}</span>
                    <span className="text-2xs">{format(date, 'MMM')}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Time picker */}
          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Select Time</p>
            <div className="flex items-center gap-2">
              <select
                value={selectedHour}
                onChange={(e) => handleHourChange(Number(e.target.value))}
                className="rounded-lg border border-border bg-background-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                  </option>
                ))}
              </select>
              <span className="text-text-tertiary">:</span>
              <select
                value={selectedMinute}
                onChange={(e) => handleMinuteChange(Number(e.target.value))}
                className="rounded-lg border border-border bg-background-surface px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {m.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Best time suggestions */}
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-medium text-text-secondary">
              <Icon name="sparkles" size="xs" color="text-accent" />
              Best Times
            </p>
            <div className="flex flex-wrap gap-1.5">
              {BEST_TIMES.map((bt, i) => {
                const hourLabel = bt.hour === 0 ? '12AM' : bt.hour < 12 ? `${bt.hour}AM` : bt.hour === 12 ? '12PM' : `${bt.hour - 12}PM`;
                return (
                  <button
                    key={i}
                    onClick={() => applyBestTime(bt.hour, bt.minute)}
                    className="rounded-full border border-accent/30 bg-accent-subtle px-2.5 py-1 text-2xs text-accent transition-colors hover:bg-accent/20"
                  >
                    <span className="font-medium">{hourLabel}</span>
                    <span className="ml-1 text-text-tertiary">{bt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {scheduledTime && !postNow && (
        <p className="text-xs text-text-tertiary">
          Scheduled for {format(new Date(scheduledTime), 'EEEE, MMM d, yyyy — h:mm a')}
        </p>
      )}
    </div>
  );
};
