'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { toast } from 'sonner';
import type { HookSEOKeyword } from './types';

interface SEOKeywordsProps {
  keywords: HookSEOKeyword[];
  className?: string;
}

const VOLUME_BAR_COLOR: Record<string, string> = {
  high: 'bg-success',
  medium: 'bg-accent',
  low: 'bg-text-tertiary',
};

const VOLUME_BAR_WIDTH: Record<string, string> = {
  high: 'w-full',
  medium: 'w-2/3',
  low: 'w-1/3',
};

export function SEOKeywords({ keywords, className }: SEOKeywordsProps) {
  const [copied, setCopied] = React.useState(false);

  function handleCopyAll() {
    const text = keywords.map((k) => k.keyword).join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('SEO keywords copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">
          {keywords.length} Keywords
        </span>
        <Button variant="outline" size="sm" onClick={handleCopyAll}>
          <Icon name={copied ? 'check' : 'copy'} size="sm" className="mr-2" />
          {copied ? 'Copied!' : 'Copy All'}
        </Button>
      </div>

      <div className="space-y-2">
        {keywords.map((kw, i) => (
          <MotionDiv
            key={kw.keyword}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            className="group flex items-center gap-3 rounded-lg border border-border-subtle bg-background-surface px-4 py-2.5 hover:border-border transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{kw.keyword}</p>
              <div className="flex items-center gap-3 mt-1">
                {/* Search volume */}
                <span className="inline-flex items-center gap-1 text-2xs text-text-tertiary">
                  <span className={cn('h-1.5 w-1.5 rounded-full', VOLUME_BAR_COLOR[kw.searchVolume])} />
                  {kw.searchVolume === 'high' ? '🔥 High' : kw.searchVolume === 'medium' ? '📊 Medium' : '📉 Low'} volume
                </span>

                {/* Competition */}
                <span className="text-2xs text-text-tertiary">
                  Competition: <span
                    className={cn(
                      'font-medium',
                      kw.competition === 'high' ? 'text-danger' : kw.competition === 'medium' ? 'text-warning' : 'text-success',
                    )}
                  >
                    {kw.competition}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(kw.keyword);
                toast.success('Keyword copied!');
              }}
              className="shrink-0 p-1 rounded-md hover:bg-background-card transition-colors"
            >
              <Icon name="copy" size="xs" color="text-text-tertiary" />
            </button>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
