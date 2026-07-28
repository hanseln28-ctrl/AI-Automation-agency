'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/icon';
import { toast } from 'sonner';
import type { HookHashtag } from './types';

interface HashtagCloudProps {
  hashtags: HookHashtag[];
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  trending: '🔥 Trending',
  niche: '🎯 Niche',
  broad: '🌐 Broad',
};

const VOLUME_COLORS: Record<string, string> = {
  high: 'border-accent/40 bg-accent-subtle text-accent',
  medium: 'border-border bg-background-surface text-text-secondary',
  low: 'border-border-subtle bg-background-surface text-text-tertiary',
};

export function HashtagCloud({ hashtags, className }: HashtagCloudProps) {
  const [copied, setCopied] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const categories = ['all', 'trending', 'niche', 'broad'];
  const filtered = activeCategory === 'all'
    ? hashtags
    : hashtags.filter((h) => h.category === activeCategory);

  function handleCopyAll() {
    const text = filtered.map((h) => h.text).join(' ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`Copied ${filtered.length} hashtags!`);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-lg bg-background-surface p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                activeCategory === cat
                  ? 'bg-background-card text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={handleCopyAll}>
          <Icon name={copied ? 'check' : 'copy'} size="sm" className="mr-2" />
          {copied ? 'Copied!' : `Copy All (${filtered.length})`}
        </Button>
      </div>

      {/* Hashtag cloud — visual tag display */}
      <div className="flex flex-wrap gap-2">
        {filtered.map((tag, i) => (
          <MotionSpan
            key={tag.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium cursor-pointer transition-all hover:scale-105',
              VOLUME_COLORS[tag.volume],
            )}
            onClick={() => {
              navigator.clipboard.writeText(tag.text);
              toast.success(`Copied ${tag.text}`);
            }}
          >
            {tag.text}
            {tag.volume === 'high' && (
              <span className="ml-1 text-2xs opacity-70">↑</span>
            )}
          </MotionSpan>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-2xs text-text-tertiary">
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> High volume
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-text-secondary" /> Medium
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary" /> Low
        </span>
      </div>
    </div>
  );
}
