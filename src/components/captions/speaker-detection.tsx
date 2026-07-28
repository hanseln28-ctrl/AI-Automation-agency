'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { CaptionLine } from './types';

interface SpeakerDetectionProps {
  lines: CaptionLine[];
  onSpeakerRename: (oldLabel: string, newLabel: string) => void;
  className?: string;
}

const SPEAKER_COLORS: Record<string, { dot: string; badge: string; bar: string }> = {
  1: { dot: 'bg-[#6C5CE7]', badge: 'bg-[#6C5CE7]/15 text-[#A78BFA] border-[#6C5CE7]/30', bar: 'bg-[#6C5CE7]' },
  2: { dot: 'bg-[#10B981]', badge: 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/30', bar: 'bg-[#10B981]' },
  3: { dot: 'bg-[#F59E0B]', badge: 'bg-[#F59E0B]/15 text-[#FCD34D] border-[#F59E0B]/30', bar: 'bg-[#F59E0B]' },
  4: { dot: 'bg-[#EC4899]', badge: 'bg-[#EC4899]/15 text-[#F9A8D4] border-[#EC4899]/30', bar: 'bg-[#EC4899]' },
};

export function SpeakerDetection({ lines, onSpeakerRename, className }: SpeakerDetectionProps) {
  // Extract unique speakers
  const speakers = React.useMemo(() => {
    const map = new Map<string, { count: number; totalDuration: number }>();
    lines.forEach((line) => {
      const existing = map.get(line.speakerLabel) || { count: 0, totalDuration: 0 };
      existing.count++;
      map.set(line.speakerLabel, existing);
    });
    return Array.from(map.entries()).map(([label, stats], i) => ({
      label,
      ...stats,
      colorIndex: (i % 4) + 1,
    }));
  }, [lines]);

  const totalLines = lines.length;

  return (
    <div className={cn('space-y-4 rounded-xl border border-border-subtle bg-background-card p-5', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <Icon name="mic" size="sm" color="text-accent" />
          Speaker Detection
        </h3>
        <Badge variant="ghost" className="text-2xs">
          {speakers.length} speaker{speakers.length !== 1 ? 's' : ''} detected
        </Badge>
      </div>

      {/* Speakers list */}
      <div className="space-y-3">
        {speakers.map((speaker, i) => {
          const colors = (SPEAKER_COLORS[speaker.colorIndex] || SPEAKER_COLORS['1'])!;
          const percentage = ((speaker.count / totalLines) * 100).toFixed(0);

          return (
            <MotionDiv
              key={speaker.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.06 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-3">
                {/* Speaker color dot */}
                <div className={cn('h-3 w-3 rounded-full shrink-0', colors.dot)} />

                {/* Speaker name (editable) */}
                <Input
                  value={speaker.label}
                  onChange={(e) => onSpeakerRename(speaker.label, e.target.value)}
                  className="h-7 px-2 py-0 text-xs font-medium bg-transparent border-border-subtle w-32"
                />

                {/* Stats */}
                <span className="text-2xs text-text-tertiary">
                  {speaker.count} lines
                </span>

                <div className="flex-1" />

                <span className="text-2xs font-mono text-text-secondary">
                  {percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-background-surface overflow-hidden">
                <MotionDiv
                  className={cn('h-full rounded-full', colors.bar)}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </MotionDiv>
          );
        })}
      </div>

      {/* Waveform visualization placeholder */}
      <div className="rounded-lg bg-background-surface p-4">
        <div className="flex items-end justify-center gap-0.5 h-16">
          {Array.from({ length: 40 }).map((_, i) => {
            const h = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10;
            return (
              <MotionDiv
                key={i}
                className="w-1 rounded-t-sm bg-accent/40"
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', delay: i * 0.02 }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-center text-2xs text-text-tertiary">
          Audio waveform visualization — speaker changes at color transitions
        </p>
      </div>
    </div>
  );
}
