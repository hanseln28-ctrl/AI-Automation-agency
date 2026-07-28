'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { MOMENT_CONFIG } from './types';
import type { MockMoment, MomentType } from './types';

interface MomentTimelineProps {
  duration: string; // e.g., "4h 12m"
  moments: MockMoment[];
  currentTime?: string;
  onMomentClick?: (moment: MockMoment) => void;
  selectedMomentId?: string;
}

// Parse "Xh Ym" to total minutes
function parseDuration(dur: string): number {
  const h = /(\d+)h/.exec(dur);
  const m = /(\d+)m/.exec(dur);
  return (h ? parseInt(h[1], 10) * 60 : 0) + (m ? parseInt(m[1], 10) : 0);
}

// Parse "h:mm:ss" to total seconds
function parseTimestamp(ts: string): number {
  const parts = ts.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function MomentTimeline({
  duration,
  moments,
  currentTime = '0:00:00',
  onMomentClick,
  selectedMomentId,
}: MomentTimelineProps) {
  const totalMinutes = parseDuration(duration);
  const totalSeconds = totalMinutes * 60;

  const getPositionPercent = (ts: string): number => {
    const secs = parseTimestamp(ts);
    return totalSeconds > 0 ? Math.min((secs / totalSeconds) * 100, 100) : 0;
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>Stream Timeline</span>
        <span>{duration}</span>
      </div>

      {/* Timeline track */}
      <div className="relative h-12 bg-background-surface rounded-lg overflow-hidden border border-border-subtle">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(108,92,231,0.05)_50%,transparent_100%)]" />

        {/* Scrubber handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/60 z-10 pointer-events-none"
          style={{ left: `${getPositionPercent(currentTime)}%` }}
        />

        {/* Moment markers */}
        {moments.map((moment) => {
          const pos = getPositionPercent(moment.timestamp);
          const config = MOMENT_CONFIG[moment.momentType];
          const isSelected = moment.id === selectedMomentId;

          return (
            <button
              key={moment.id}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-0.5 transition-transform hover:scale-125',
                isSelected && 'scale-125',
              )}
              style={{ left: `${pos}%` }}
              onClick={() => onMomentClick?.(moment)}
              title={`${config.label} at ${moment.timestamp} (${moment.confidence}%)`}
            >
              <div
                className={cn(
                  'h-3 w-3 rounded-full border-2 border-background shadow-md',
                  isSelected && 'ring-2 ring-white/30',
                )}
                style={{ backgroundColor: config.color }}
              />
              <span className="text-[8px] text-text-tertiary font-mono leading-none">
                {moment.timestamp}
              </span>
            </button>
          );
        })}

        {/* Passive baseline */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border" />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap">
        {Object.entries(MOMENT_CONFIG).map(([key, config]) => (
          <span key={key} className="inline-flex items-center gap-1 text-2xs text-text-tertiary">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.label}
          </span>
        ))}
      </div>
    </div>
  );
}
