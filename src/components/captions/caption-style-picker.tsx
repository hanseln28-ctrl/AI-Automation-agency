'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import type { CaptionStyle } from './types';
import { CAPTION_STYLE_CONFIGS } from './types';

interface CaptionStylePickerProps {
  selected?: CaptionStyle;
  onSelect: (style: CaptionStyle) => void;
  className?: string;
}

export function CaptionStylePicker({ selected, onSelect, className }: CaptionStylePickerProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5', className)}>
      {CAPTION_STYLE_CONFIGS.map((style, i) => {
        const isSelected = selected === style.key;
        return (
          <MotionButton
            key={style.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            onClick={() => onSelect(style.key)}
            className={cn(
              'group relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200',
              isSelected
                ? 'border-accent bg-accent-subtle shadow-glass'
                : 'border-border-subtle bg-background-card hover:border-border hover:shadow-card',
            )}
          >
            {/* Preview animation area */}
            <div
              className={cn(
                'relative h-20 w-full overflow-hidden rounded-lg bg-gradient-to-br',
                style.gradient,
              )}
            >
              {/* Animated text preview */}
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <MotionSpan
                  className={cn(
                    'text-center text-xs font-bold text-white',
                    style.key === 'minimal' && 'font-light tracking-widest',
                    style.key === 'bold' && 'text-sm',
                    style.key === 'emoji' && 'text-base',
                  )}
                  animate={
                    isSelected
                      ? {
                          scale: [1, 1.05, 1],
                          opacity: [0.8, 1, 0.8],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {style.previewText}
                </MotionSpan>
              </div>

              {/* Style icon watermark */}
              <div className="absolute bottom-1 right-1 opacity-40">
                <Icon name={style.icon as any} size="xs" color="text-white" />
              </div>
            </div>

            {/* Label */}
            <div className="text-center">
              <p className={cn(
                'text-xs font-semibold transition-colors',
                isSelected ? 'text-accent' : 'text-text-primary',
              )}>
                {style.label}
              </p>
              <p className="text-2xs text-text-tertiary mt-0.5">
                {style.description}
              </p>
            </div>

            {/* Select indicator */}
            {isSelected && (
              <MotionDiv
                layoutId="captionStyleCheck"
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Icon name="check" size="xs" color="text-white" />
              </MotionDiv>
            )}
          </MotionButton>
        );
      })}
    </div>
  );
}
