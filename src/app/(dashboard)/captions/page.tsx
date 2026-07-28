'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/shared/icon';
import { MOCK_CAPTION_PROJECTS } from '@/components/captions/mock-data';
import { MOCK_CLIPS } from '@/components/clips/mock-data';
import type { CaptionProject, CaptionStyle } from '@/components/captions/types';
import { CAPTION_STYLE_CONFIGS } from '@/components/captions/types';

type TabFilter = 'all' | 'generated' | 'applied' | 'draft';

const TABS: { label: string; filter: TabFilter }[] = [
  { label: 'All Captions', filter: 'all' },
  { label: 'Generated', filter: 'generated' },
  { label: 'Applied', filter: 'applied' },
  { label: 'Drafts', filter: 'draft' },
];

// Helper to get status color
function getStatusBadge(status: string) {
  switch (status) {
    case 'generated':
      return 'bg-accent-subtle text-accent border-accent/30';
    case 'applied':
      return 'bg-success-subtle text-success border-success/30';
    case 'edited':
      return 'bg-warning-subtle text-warning border-warning/30';
    default:
      return 'bg-background-elevated text-text-tertiary border-border';
  }
}

export default function CaptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabFilter>('all');
  const [search, setSearch] = React.useState('');
  const [showBulkSelect, setShowBulkSelect] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = MOCK_CAPTION_PROJECTS.filter((proj) => {
    if (activeTab !== 'all' && proj.status !== activeTab) return false;
    if (search && !proj.clipTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function selectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((f) => f.id)));
    }
  }

  function handleBulkGenerate() {
    const count = selected.size;
    setShowBulkSelect(false);
    setSelected(new Set());
    // In production, this would trigger caption generation for selected clips
    alert(`Generating captions for ${count} clip${count !== 1 ? 's' : ''}...`);
  }

  if (MOCK_CAPTION_PROJECTS.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-16 w-16 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
          <Icon name="message-square" size="xl" color="text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary">No captions yet</h2>
        <p className="mt-1 text-sm text-text-secondary text-center max-w-sm">
          Generate captions for your clips. AI will automatically transcribe and style them.
        </p>
        <Button className="mt-4" onClick={() => router.push('/clips')}>
          <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
          Go to Clips
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="Captions"
        description="Manage and export AI-generated captions for your clips."
        actions={
          <div className="flex items-center gap-2">
            {showBulkSelect ? (
              <>
                <span className="text-sm text-text-secondary">
                  {selected.size} selected
                </span>
                <Button variant="outline" size="sm" onClick={selectAll}>
                  {selected.size === filtered.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkGenerate}
                  disabled={selected.size === 0}
                >
                  <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
                  Generate Captions
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowBulkSelect(false); setSelected(new Set()); }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowBulkSelect(true)}>
                <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
                Generate Captions
              </Button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => setActiveTab(tab.filter)}
            className={cn(
              'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
              activeTab === tab.filter
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Icon name="search" size="sm" color="text-text-tertiary" className="absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search captions by clip title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background-surface border-border-subtle"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="search" size="lg" color="text-text-tertiary" />
          <p className="mt-2 text-sm text-text-secondary">No captions match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((proj, i) => (
              <CaptionCard
                key={proj.id}
                project={proj}
                index={i}
                isBulkSelect={showBulkSelect}
                isSelected={selected.has(proj.id)}
                onToggleSelect={toggleSelect}
                onClick={() => router.push(`/clips/${proj.clipId}`)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

// ── Caption Card ──

function CaptionCard({
  project,
  index,
  isBulkSelect,
  isSelected,
  onToggleSelect,
  onClick,
}: {
  project: CaptionProject;
  index: number;
  isBulkSelect: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onClick: () => void;
}) {
  const styleConfig = CAPTION_STYLE_CONFIGS.find((s) => s.key === project.style);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={cn(
        'group rounded-xl border overflow-hidden transition-all cursor-pointer',
        isSelected
          ? 'border-accent shadow-glass'
          : 'border-border-subtle bg-background-card hover:border-border hover:shadow-card',
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden" onClick={onClick}>
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60', project.thumbnailGradient)} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="play" size="sm" color="text-white" />
          </div>
        </div>

        {/* Style badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm px-2 py-0.5 text-2xs font-medium text-white">
            <Icon name={styleConfig?.icon as any} size="xs" color="text-white" />
            {styleConfig?.label}
          </span>
        </div>

        {/* Bulk select checkbox */}
        {isBulkSelect && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSelect(project.id); }}
            className={cn(
              'absolute top-2 right-2 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors',
              isSelected
                ? 'bg-accent border-accent'
                : 'border-white/40 bg-black/40',
            )}
          >
            {isSelected && <Icon name="check" size="xs" color="text-white" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2" onClick={onClick}>
        <h4 className="text-sm font-semibold text-text-primary line-clamp-1 group-hover:text-accent transition-colors">
          {project.clipTitle}
        </h4>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="ghost" className="text-2xs">
            {project.language}
          </Badge>
          <span className="text-2xs text-text-tertiary">
            {project.wordCount} words
          </span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-2xs font-medium',
              getStatusBadge(project.status),
            )}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>

          <span className="text-2xs text-text-tertiary">
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
