'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PublisherPlatform } from './types';
import { PUBLISHER_PLATFORM_CONFIG } from './types';

interface PlatformSelectorProps {
  selected: PublisherPlatform[];
  onChange: (platforms: PublisherPlatform[]) => void;
  disabled?: boolean;
}

const ALL_PLATFORMS: PublisherPlatform[] = [
  'tiktok', 'instagram', 'youtube_shorts', 'facebook', 'threads', 'x', 'linkedin', 'discord',
];

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selected,
  onChange,
  disabled = false,
}) => {
  const toggle = (p: PublisherPlatform) => {
    if (disabled) return;
    if (selected.includes(p)) {
      onChange(selected.filter((s) => s !== p));
    } else {
      onChange([...selected, p]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_PLATFORMS.map((platform) => {
        const cfg = PUBLISHER_PLATFORM_CONFIG[platform];
        const isSelected = selected.includes(platform);
        return (
          <Tooltip key={platform}>
            <TooltipTrigger asChild>
              <MotionButton
                type="button"
                onClick={() => toggle(platform)}
                disabled={disabled}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  isSelected
                    ? cn(cfg.bgClass, cfg.borderClass, cfg.textClass, 'shadow-sm')
                    : 'border-border bg-background-surface text-text-secondary hover:border-text-tertiary hover:text-text-primary',
                  disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <Icon name={cfg.icon as any} size="xs" color={isSelected ? cfg.textClass : 'text-text-tertiary'} />
                {cfg.label}
              </MotionButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              {cfg.label} — {cfg.charLimit.toLocaleString()} char limit
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};
