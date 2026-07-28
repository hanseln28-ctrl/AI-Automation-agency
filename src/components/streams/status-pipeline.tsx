'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Check, Loader2, XCircle } from 'lucide-react';
import { PROCESSING_STAGES } from './types';
import type { StreamStatus } from './types';

interface StatusPipelineProps {
  currentStatus: StreamStatus;
}

const STATUS_ORDER: StreamStatus[] = [
  'importing',
  'transcribing',
  'analyzing',
  'generating_clips',
  'completed',
];

export function StatusPipeline({ currentStatus }: StatusPipelineProps) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus);
  const isFailed = currentStatus === 'failed';

  return (
    <div className="rounded-xl border border-border-subtle bg-background-card p-6">
      <h3 className="mb-5 text-sm font-semibold text-text-primary">
        Processing Pipeline
      </h3>

      <div className="relative">
        {/* Background track */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border hidden md:block" />

        {/* Progress fill */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-accent hidden md:block transition-all duration-700 ease-out"
          style={{
            width:
              isFailed
                ? '0%'
                : currentIdx === -1
                  ? '0%'
                  : `${(currentIdx / (STATUS_ORDER.length - 1)) * 100}%`,
          }}
        />

        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
          {PROCESSING_STAGES.slice(0, 5).map((stage, idx) => {
            const stageIdx = STATUS_ORDER.indexOf(stage.key);
            const isComplete = !isFailed && stageIdx < currentIdx;
            const isCurrent = stage.key === currentStatus;
            const isPending = !isFailed && stageIdx > currentIdx;

            return (
              <div
                key={stage.key}
                className={cn(
                  'relative flex md:flex-col items-center gap-3 md:gap-2 md:text-center',
                  'md:w-20',
                )}
              >
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <MotionDiv
                    animate={
                      isCurrent
                        ? {
                            boxShadow: [
                              '0 0 0 0 rgba(108, 92, 231, 0.4)',
                              '0 0 0 8px rgba(108, 92, 231, 0)',
                            ],
                          }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2',
                      isComplete
                        ? 'border-success bg-success'
                        : isCurrent
                          ? 'border-accent bg-accent-subtle'
                          : isFailed && stage.key === 'importing'
                            ? 'border-danger bg-danger-subtle'
                            : 'border-border bg-background-card',
                    )}
                  >
                    {isComplete && <Check className="h-4 w-4 text-white" />}
                    {isCurrent && (
                      <MotionDiv
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      >
                        <Loader2 className="h-4 w-4 text-accent" />
                      </MotionDiv>
                    )}
                    {isFailed && stage.key === 'importing' && (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                  </MotionDiv>
                </div>

                {/* Label */}
                <div>
                  <p
                    className={cn(
                      'text-xs font-medium leading-tight transition-colors',
                      isComplete
                        ? 'text-success'
                        : isCurrent
                          ? 'text-accent'
                          : isFailed
                            ? 'text-text-tertiary'
                            : 'text-text-tertiary',
                    )}
                  >
                    {stage.label}
                  </p>
                  <p className="text-2xs text-text-tertiary hidden md:block mt-0.5">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
