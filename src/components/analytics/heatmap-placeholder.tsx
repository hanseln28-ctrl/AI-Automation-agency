'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { BestPostingTime } from './types';

interface HeatmapPlaceholderProps {
  data: BestPostingTime[];
  className?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_LABELS = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

function getIntensityColor(value: number): string {
  // Color scale: cool (low) to hot (high)
  if (value <= 10) return 'bg-[#1A1A24]';
  if (value <= 20) return 'bg-[#1E2040]';
  if (value <= 30) return 'bg-[#2A2560]';
  if (value <= 40) return 'bg-[#3D2E80]';
  if (value <= 50) return 'bg-[#5639A8]';
  if (value <= 60) return 'bg-[#6C5CE7]';
  if (value <= 70) return 'bg-[#8070F0]';
  if (value <= 80) return 'bg-[#9B8EF5]';
  if (value <= 90) return 'bg-[#B8AEFA]';
  return 'bg-[#D4CDFC]';
}

export function HeatmapPlaceholder({ data, className }: HeatmapPlaceholderProps) {
  // Build lookup: day*hour -> value
  const lookup = new Map<string, number>();
  for (const cell of data) {
    lookup.set(`${cell.day}-${cell.hour}`, cell.value);
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Legend */}
      <div className="flex items-center gap-2 text-2xs text-text-tertiary">
        <span>Low</span>
        {[10, 30, 50, 70, 90].map((v) => (
          <div key={v} className={cn('h-3 w-3 rounded-sm', getIntensityColor(v))} />
        ))}
        <span>High</span>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="inline-grid min-w-[600px]" style={{ gridTemplateColumns: '48px repeat(24, 1fr)', gridTemplateRows: '24px repeat(7, 28px)' }}>
          {/* Empty top-left cell */}
          <div />

          {/* Hour headers */}
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="flex items-center justify-center text-2xs text-text-tertiary"
            >
              {h % 3 === 0 ? `${h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}` : ''}
            </div>
          ))}

          {/* Day rows */}
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <React.Fragment key={day}>
              <div className="flex items-center text-2xs font-medium text-text-secondary">
                {DAY_LABELS[day]}
              </div>
              {Array.from({ length: 24 }, (_, hour) => {
                const value = lookup.get(`${day}-${hour}`) ?? 0;
                return (
                  <div
                    key={hour}
                    className={cn(
                      'm-px rounded-sm transition-colors duration-300',
                      getIntensityColor(value),
                    )}
                    title={`${DAY_LABELS[day]} ${hour}:00 — ${value}% engagement`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Best times summary */}
      <div className="flex flex-wrap gap-3">
        {(() => {
          const sorted = [...data].sort((a, b) => b.value - a.value).slice(0, 3);
          return sorted.map((cell, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-lg bg-accent-subtle px-3 py-1.5 text-xs">
              <span className="text-accent">🔥</span>
              <span className="text-text-secondary">
                {DAY_LABELS[cell.day]}s at{' '}
                {cell.hour === 0 ? '12 AM' : cell.hour < 12 ? `${cell.hour} AM` : cell.hour === 12 ? '12 PM' : `${cell.hour - 12} PM`}
              </span>
              <span className="font-medium text-accent">{cell.value}%</span>
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
