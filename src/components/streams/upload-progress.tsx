'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2 } from 'lucide-react';

export type UploadStage = 'uploading' | 'processing' | 'analyzing' | 'generating';

interface StageInfo {
  key: UploadStage;
  label: string;
  description: string;
}

const STAGES: StageInfo[] = [
  { key: 'uploading', label: 'Uploading', description: 'Transferring video to our servers' },
  { key: 'processing', label: 'Processing', description: 'Encoding and preparing video' },
  {
    key: 'analyzing',
    label: 'Analyzing',
    description: 'Detecting viral moments, sentiment, and highlights',
  },
  {
    key: 'generating',
    label: 'Generating Clips',
    description: 'Creating short-form content with captions and hooks',
  },
];

interface UploadProgressProps {
  currentStage: UploadStage;
  progress: number; // 0–100
}

export function UploadProgress({ currentStage, progress }: UploadProgressProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="rounded-xl border border-border-subtle bg-background-card p-6">
      <div className="space-y-6">
        {/* Overall progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              {STAGES[currentIndex]?.label ?? 'Processing'}
            </span>
            <span className="text-sm tabular-nums text-text-secondary">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage indicators */}
        <div className="space-y-3">
          {STAGES.map((stage, idx) => {
            const isComplete = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div key={stage.key} className="flex items-start gap-3">
                {/* Status dot */}
                <div className="relative mt-0.5">
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300',
                      isComplete
                        ? 'border-success bg-success'
                        : isCurrent
                          ? 'border-accent bg-accent-subtle'
                          : 'border-border bg-transparent',
                    )}
                  >
                    {isComplete && <Check className="h-3 w-3 text-white" />}
                    {isCurrent && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      >
                        <Loader2 className="h-3 w-3 text-accent" />
                      </motion.div>
                    )}
                  </div>
                  {/* Connector line */}
                  {idx < STAGES.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-5 left-2.5 h-[calc(100%+0.75rem)] w-px -translate-x-1/2',
                        isComplete ? 'bg-success/40' : 'bg-border',
                      )}
                    />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isComplete
                        ? 'text-success'
                        : isCurrent
                          ? 'text-text-primary'
                          : 'text-text-tertiary',
                    )}
                  >
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-text-secondary mt-0.5"
                    >
                      {stage.description}
                    </motion.p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
