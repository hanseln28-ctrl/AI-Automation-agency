'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { DURATION_OPTIONS } from './types';
import type { ClipDuration } from './types';

interface DurationSelectorProps {
  value: ClipDuration;
  onChange: (duration: ClipDuration) => void;
  className?: string;
}

export function DurationSelector({ value, onChange, className }: DurationSelectorProps) {
  return (
    <div className={cn('flex gap-1 rounded-lg bg-background-surface p-1', className)}>
      {DURATION_OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
