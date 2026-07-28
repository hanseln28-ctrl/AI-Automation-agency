'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { FORMAT_CONFIG } from './types';
import type { ClipFormat } from './types';

interface FormatSelectorProps {
  value: ClipFormat;
  onChange: (format: ClipFormat) => void;
  className?: string;
}

export function FormatSelector({ value, onChange, className }: FormatSelectorProps) {
  const formats: ClipFormat[] = ['vertical', 'horizontal', 'square'];

  return (
    <div className={cn('flex gap-1 rounded-lg bg-background-surface p-1', className)}>
      {formats.map((format) => {
        const config = FORMAT_CONFIG[format];
        const isActive = value === format;

        return (
          <button
            key={format}
            onClick={() => onChange(format)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Icon
              name={config.icon as any}
              size="sm"
              color={isActive ? 'text-accent' : 'text-text-tertiary'}
            />
            <span className="hidden sm:inline">{config.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
