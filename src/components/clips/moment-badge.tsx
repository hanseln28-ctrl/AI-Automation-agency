'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { MOMENT_CONFIG } from './types';
import type { MomentType } from './types';

interface MomentBadgeProps {
  type: MomentType;
  className?: string;
  showIcon?: boolean;
}

export function MomentBadge({ type, className, showIcon = true }: MomentBadgeProps) {
  const config = MOMENT_CONFIG[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        config.badgeClass,
        className,
      )}
    >
      {showIcon && <Icon name={config.icon as any} size="xs" />}
      {config.label}
    </span>
  );
}
