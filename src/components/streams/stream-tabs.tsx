'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { fadeIn } from '@/lib/utils/animations';

interface StreamTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'clips', label: 'Clips' },
  { key: 'transcript', label: 'Transcript' },
  { key: 'settings', label: 'Settings' },
];

export function StreamTabs({ activeTab, onTabChange }: StreamTabsProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150',
              activeTab === tab.key
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeTab}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Content rendered by parent */}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
