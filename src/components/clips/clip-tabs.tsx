'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type ClipDetailTab = 'captions' | 'hashtags' | 'publishing' | 'analytics';

interface ClipTabsProps {
  activeTab: ClipDetailTab;
  onTabChange: (tab: ClipDetailTab) => void;
  className?: string;
}

const TABS: { key: ClipDetailTab; label: string }[] = [
  { key: 'captions', label: 'Captions' },
  { key: 'hashtags', label: 'Hashtags' },
  { key: 'publishing', label: 'Publishing' },
  { key: 'analytics', label: 'Analytics' },
];

export function ClipTabs({ activeTab, onTabChange, className }: ClipTabsProps) {
  return (
    <div className={cn('flex gap-1 rounded-lg bg-background-surface p-1 w-fit', className)}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
            activeTab === tab.key
              ? 'bg-background-card text-text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
