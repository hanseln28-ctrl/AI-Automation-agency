'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { slideRight, slideLeft } from '@/lib/utils/animations';

interface ImportTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { key: 'connect', label: 'Connect Platform', icon: '🔌' },
  { key: 'upload', label: 'Upload MP4', icon: '📤' },
];

export function ImportTabs({ activeTab, onTabChange }: ImportTabsProps) {
  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-150',
              activeTab === tab.key
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with animation */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={activeTab}
          variants={activeTab === 'connect' ? slideRight : slideLeft}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="min-h-[400px]"
        >
          {/* Content is rendered by parent */}
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
