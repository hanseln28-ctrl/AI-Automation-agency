'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { toast } from 'sonner';
import type { HookTitleVariation, HookPlatform } from './types';
import { HOOK_PLATFORM_CONFIG } from './types';

interface TitleCardProps {
  title: HookTitleVariation;
  index: number;
}

export function TitleCard({ title, index }: TitleCardProps) {
  const [copied, setCopied] = React.useState(false);
  const platformConfig = HOOK_PLATFORM_CONFIG[title.platform];

  function handleCopy() {
    navigator.clipboard.writeText(title.text).then(() => {
      setCopied(true);
      toast.success('Title copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group rounded-xl border border-border-subtle bg-background-card hover:border-border hover:shadow-card transition-all overflow-hidden"
    >
      {/* Score indicator bar */}
      <div className="h-1 bg-background-surface">
        <motion.div
          className="h-full rounded-r-full bg-gradient-to-r from-accent to-[#8B7CF7]"
          initial={{ width: 0 }}
          animate={{ width: `${title.score}%` }}
          transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
        />
      </div>

      <div className="p-3 space-y-2">
        <p className="text-sm text-text-primary leading-relaxed">{title.text}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Platform badge */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium"
              style={{
                backgroundColor: `${platformConfig.color}20`,
                color: platformConfig.color,
                border: `1px solid ${platformConfig.color}40`,
              }}
            >
              <Icon name={platformConfig.icon as any} size="xs" />
              {platformConfig.label}
            </span>

            {/* Score */}
            <span className="text-2xs text-text-tertiary font-mono">
              {title.score}%
            </span>
          </div>

          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
            <Icon name={copied ? 'check' : 'copy'} size="xs" color={copied ? 'text-success' : 'text-text-tertiary'} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Copy All Titles Button ──

interface CopyAllTitlesProps {
  titles: HookTitleVariation[];
  platform?: HookPlatform;
}

export function CopyAllTitles({ titles, platform }: CopyAllTitlesProps) {
  const [copied, setCopied] = React.useState(false);

  function handleCopyAll() {
    const filtered = platform ? titles.filter((t) => t.platform === platform) : titles;
    const text = filtered.map((t) => t.text).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`Copied ${filtered.length} titles!`);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopyAll}>
      <Icon name={copied ? 'check' : 'copy'} size="sm" className="mr-2" />
      {copied ? 'Copied!' : `Copy All (${titles.length})`}
    </Button>
  );
}
