'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  className?: string;
}

export function GenerateButton({ onClick, isGenerating, className }: GenerateButtonProps) {
  return (
    <MotionDiv
      className={cn('flex justify-center', className)}
      whileHover={!isGenerating ? { scale: 1.02 } : undefined}
      whileTap={!isGenerating ? { scale: 0.98 } : undefined}
    >
      <Button
        onClick={onClick}
        disabled={isGenerating}
        size="lg"
        className={cn(
          'relative overflow-hidden px-8 py-6 text-base font-semibold transition-all',
          !isGenerating && 'bg-gradient-accent hover:shadow-glass-lg',
        )}
      >
        {/* Animated background shimmer */}
        {!isGenerating && (
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        )}

        {isGenerating ? (
          <span className="flex items-center gap-3">
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Icon name="loader-2" size="sm" color="text-white" />
            </MotionDiv>
            <MotionSpan
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              AI is generating hooks...
            </MotionSpan>
          </span>
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            <Icon name="sparkles" size="sm" color="text-white" />
            Generate Hooks
          </span>
        )}
      </Button>
    </MotionDiv>
  );
}
