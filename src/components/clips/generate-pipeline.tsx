'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { GENERATE_STAGES } from './types';

interface GeneratePipelineProps {
  currentStage: number; // index into GENERATE_STAGES
  className?: string;
}

export function GeneratePipeline({ currentStage, className }: GeneratePipelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-sm font-semibold text-text-primary">Processing Pipeline</h3>

      <div className="space-y-0">
        {GENERATE_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isActive = idx === currentStage;
          const isPending = idx > currentStage;

          return (
            <div key={stage.key} className="flex gap-3">
              {/* Connector + Icon */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300',
                    isCompleted && 'bg-success-subtle',
                    isActive && 'bg-accent-subtle ring-2 ring-accent/30',
                    isPending && 'bg-background-surface',
                  )}
                >
                  {isCompleted ? (
                    <Icon name="check" size="sm" color="text-success" />
                  ) : isActive ? (
                    <Icon name="loader-2" size="sm" color="text-accent" className="animate-spin" />
                  ) : (
                    <span className="text-xs text-text-tertiary font-mono">{idx + 1}</span>
                  )}
                </div>
                {idx < GENERATE_STAGES.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[16px] mt-1 transition-colors duration-300',
                      isCompleted ? 'bg-success/30' : 'bg-border',
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className={cn('pb-4 flex-1', isPending && 'opacity-50')}>
                <p
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCompleted && 'text-success',
                    isActive && 'text-accent',
                    isPending && 'text-text-secondary',
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">{stage.description}</p>

                {/* Progress bar for active stage */}
                {isActive && (
                  <div className="mt-2 h-1 rounded-full bg-background-surface overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full animate-pulse"
                      style={{ width: '60%' }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
