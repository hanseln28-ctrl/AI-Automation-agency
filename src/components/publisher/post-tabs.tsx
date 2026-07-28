'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';

export type PublisherTab = 'queue' | 'calendar' | 'posted' | 'failed';

interface PostTabsProps {
  active: PublisherTab;
  onChange: (tab: PublisherTab) => void;
  failedCount?: number;
  queueCount?: number;
}

const TABS: { key: PublisherTab; label: string; icon: string }[] = [
  { key: 'queue', label: 'Queue', icon: 'clock' },
  { key: 'calendar', label: 'Calendar', icon: 'calendar' },
  { key: 'posted', label: 'Posted', icon: 'check-circle' },
  { key: 'failed', label: 'Failed', icon: 'alert-triangle' },
];

export const PostTabs: React.FC<PostTabsProps> = ({
  active,
  onChange,
  failedCount = 0,
  queueCount = 0,
}) => {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-background-surface p-1">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const count = tab.key === 'failed' ? failedCount : tab.key === 'queue' ? queueCount : undefined;

        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Icon name={tab.icon as any} size="sm" color={isActive ? 'text-text-primary' : 'text-text-tertiary'} />
            {tab.label}
            {count !== undefined && count > 0 && (
              <span className={cn(
                'ml-1 rounded-full px-1.5 py-0 text-xs font-bold',
                tab.key === 'failed'
                  ? 'bg-danger/20 text-danger'
                  : 'bg-accent-subtle text-accent',
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
