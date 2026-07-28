'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { ClipGrid } from '@/components/clips/clip-grid';
import { ClipFilterBar } from '@/components/clips/clip-filter-bar';
import { MOCK_CLIPS } from '@/components/clips/mock-data';
import type { ClipStatus } from '@/components/clips/types';

const TABS: { label: string; filter: ClipStatus | 'all' }[] = [
  { label: 'All Clips', filter: 'all' },
  { label: 'Ready to Publish', filter: 'ready' },
  { label: 'Published', filter: 'published' },
  { label: 'Archived', filter: 'archived' },
];

export default function ClipsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<ClipStatus | 'all'>('all');
  const [isLoading] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [platformFilter, setPlatformFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [momentTypeFilter, setMomentTypeFilter] = React.useState('all');

  const filtered = MOCK_CLIPS.filter((clip) => {
    // Tab filter
    if (activeTab !== 'all' && clip.status !== activeTab) return false;

    // Search filter
    if (search && !clip.title.toLowerCase().includes(search.toLowerCase())) return false;

    // Status dropdown filter (overrides tab when set)
    if (statusFilter !== 'all' && clip.status !== statusFilter) return false;

    // Moment type filter
    if (momentTypeFilter !== 'all' && clip.momentType !== momentTypeFilter) return false;

    return true;
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="Clips"
        description="Browse, edit, and publish your AI-generated clips."
        actions={
          <Button onClick={() => router.push('/clips/generate')}>
            <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
            Generate New Clips
          </Button>
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

      {/* Filter bar */}
      <ClipFilterBar
        onSearch={setSearch}
        onPlatformChange={setPlatformFilter}
        onStatusChange={setStatusFilter}
        onMomentTypeChange={setMomentTypeFilter}
        platformFilter={platformFilter}
        statusFilter={statusFilter}
        momentTypeFilter={momentTypeFilter}
      />

      {/* Grid */}
      <ClipGrid
        clips={filtered}
        isLoading={isLoading}
        activeTab={activeTab}
      />
    </motion.div>
  );
}
