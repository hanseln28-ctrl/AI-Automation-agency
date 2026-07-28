'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { MomentBadge } from './moment-badge';
import type { MockMoment } from './types';

interface MomentCardProps {
  moment: MockMoment;
  index: number;
  onToggle?: (id: string) => void;
  onClick?: (moment: MockMoment) => void;
  isActive?: boolean;
}

export function MomentCard({ moment, index, onToggle, onClick, isActive = false }: MomentCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-all duration-150 cursor-pointer',
        isActive
          ? 'border-accent bg-accent-subtle shadow-glass'
          : 'border-border-subtle bg-background-card hover:border-border',
      )}
      onClick={() => onClick?.(moment)}
    >
      <div className="flex gap-3">
        {/* Checkbox */}
        <div
          className="shrink-0 pt-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(moment.id);
          }}
        >
          <div
            className={cn(
              'h-5 w-5 rounded border-2 flex items-center justify-center transition-colors',
              moment.selected
                ? 'bg-accent border-accent'
                : 'border-border hover:border-text-tertiary',
            )}
          >
            {moment.selected && <Icon name="check" size="xs" color="text-white" />}
          </div>
        </div>

        {/* Thumbnail (small) */}
        <div
          className={cn(
            'h-14 w-24 shrink-0 rounded-lg bg-gradient-to-br',
            moment.thumbnailGradient,
          )}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <MomentBadge type={moment.momentType} showIcon />
            <span className="text-2xs text-text-tertiary">
              {moment.confidence}% confidence
            </span>
          </div>

          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {moment.aiReasoning}
          </p>

          <div className="flex items-center gap-3 mt-1.5 text-2xs text-text-tertiary">
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size="xs" />
              {moment.timestamp}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="timer" size="xs" />
              {moment.durationSuggestion}s suggested
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
