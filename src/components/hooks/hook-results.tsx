'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { TitleCard, CopyAllTitles } from './title-card';
import { HookCard } from './hook-card';
import { HashtagCloud } from './hashtag-cloud';
import { SEOKeywords } from './seo-keywords';
import { GenerateButton } from './generate-button';
import type { HookGenerationResult } from './types';

type ResultsTab = 'titles' | 'hooks' | 'descriptions' | 'hashtags' | 'seo';

interface HookResultsProps {
  result: HookGenerationResult;
  onRegenerate: () => void;
  isRegenerating: boolean;
  className?: string;
}

const TABS: { key: ResultsTab; label: string; icon: string }[] = [
  { key: 'titles', label: 'Titles', icon: 'file-text' },
  { key: 'hooks', label: 'Hooks', icon: 'zap' },
  { key: 'descriptions', label: 'Descriptions', icon: 'message-square' },
  { key: 'hashtags', label: 'Hashtags', icon: 'tag' },
  { key: 'seo', label: 'SEO', icon: 'search' },
];

export function HookResults({ result, onRegenerate, isRegenerating, className }: HookResultsProps) {
  const [activeTab, setActiveTab] = React.useState<ResultsTab>('titles');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary">Generated Results</h2>
          <p className="text-xs text-text-tertiary mt-0.5">
            For: {result.clipTitle} • {result.generatedAt ? new Date(result.generatedAt).toLocaleTimeString() : 'Just now'}
          </p>
        </div>
        <GenerateButton onClick={onRegenerate} isGenerating={isRegenerating} className="self-start" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 flex items-center gap-1.5',
              activeTab === tab.key
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            <Icon name={tab.icon as any} size="sm" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'titles' && <TitlesTab titles={result.titles} />}
          {activeTab === 'hooks' && <HooksTab hooks={result.hooks} />}
          {activeTab === 'descriptions' && <DescriptionsTab descriptions={result.descriptions} />}
          {activeTab === 'hashtags' && <HashtagCloud hashtags={result.hashtags} />}
          {activeTab === 'seo' && <SEOKeywords keywords={result.seoKeywords} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Titles Tab ──

function TitlesTab({ titles }: { titles: HookGenerationResult['titles'] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {titles.length} title variations
        </p>
        <CopyAllTitles titles={titles} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {titles.map((title, i) => (
          <TitleCard key={title.id} title={title} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Hooks Tab ──

function HooksTab({ hooks }: { hooks: HookGenerationResult['hooks'] }) {
  const [copiedAll, setCopiedAll] = React.useState(false);

  function handleCopyAllHooks() {
    const text = hooks.map((h) => `[${h.type}] ${h.text}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {hooks.length} hook variations for the first 3 seconds
        </p>
        <Button variant="outline" size="sm" onClick={handleCopyAllHooks}>
          <Icon name={copiedAll ? 'check' : 'copy'} size="sm" className="mr-2" />
          {copiedAll ? 'Copied!' : `Copy All (${hooks.length})`}
        </Button>
      </div>

      <div className="space-y-2">
        {hooks.map((hook, i) => (
          <HookCard key={hook.id} hook={hook} index={i} />
        ))}
      </div>
    </div>
  );
}

// ── Descriptions Tab ──

function DescriptionsTab({ descriptions }: { descriptions: HookGenerationResult['descriptions'] }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        {descriptions.length} description variations
      </p>

      <div className="space-y-3">
        {descriptions.map((desc, i) => {
          const isExpanded = expandedId === desc.id;
          return (
            <motion.div
              key={desc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl border border-border-subtle bg-background-card overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    'text-2xs font-medium px-2 py-0.5 rounded-full',
                    desc.length === 'short'
                      ? 'bg-warning-subtle text-warning border border-warning/20'
                      : desc.length === 'medium'
                        ? 'bg-accent-subtle text-accent border border-accent/20'
                        : 'bg-success-subtle text-success border border-success/20',
                  )}>
                    {desc.length === 'short' ? 'Short (~50 chars)' : desc.length === 'medium' ? 'Medium (~200 chars)' : 'Long (~400 chars)'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : desc.id)}
                      className="p-1 rounded-md hover:bg-background-surface transition-colors"
                    >
                      <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size="xs"
                        color="text-text-tertiary"
                      />
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(desc.text)}
                      className="p-1 rounded-md hover:bg-background-surface transition-colors"
                    >
                      <Icon name="copy" size="xs" color="text-text-tertiary" />
                    </button>
                  </div>
                </div>

                <p className={cn(
                  'text-sm text-text-primary leading-relaxed',
                  !isExpanded && 'line-clamp-2',
                )}>
                  {desc.text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
