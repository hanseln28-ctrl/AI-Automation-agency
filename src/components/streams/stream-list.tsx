'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreHorizontal,
  Eye,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingTable } from '@/components/shared/loading-table';
import { StreamCard } from './stream-card';
import { MOCK_STREAMS } from './mock-data';
import { PLATFORM_CONFIG, STATUS_CONFIG } from './types';
import type { StreamStatus } from './types';

const TABS: { label: string; filter: StreamStatus | 'all' }[] = [
  { label: 'All Streams', filter: 'all' },
  { label: 'Processing', filter: 'importing' },
  { label: 'Completed', filter: 'completed' },
  { label: 'Failed', filter: 'failed' },
];

export function StreamList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<StreamStatus | 'all'>('all');
  const [isLoading] = React.useState(false);

  const filtered =
    activeTab === 'all'
      ? MOCK_STREAMS
      : activeTab === 'importing'
        ? MOCK_STREAMS.filter(
            (s) =>
              s.status === 'importing' ||
              s.status === 'transcribing' ||
              s.status === 'analyzing' ||
              s.status === 'generating_clips',
          )
        : MOCK_STREAMS.filter((s) => s.status === activeTab);

  if (isLoading) {
    return <LoadingTable rows={6} columns={6} />;
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-background-surface p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.filter}
            onClick={() => setActiveTab(tab.filter)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150',
              activeTab === tab.filter
                ? 'bg-background-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Eye}
          title="No streams found"
          description={
            activeTab === 'all'
              ? 'Import your first stream to get started.'
              : `No ${activeTab} streams.`
          }
          actionLabel="Import Stream"
          onAction={() => router.push('/streams/import')}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-xl border border-border-subtle bg-background-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Stream
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Imported
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((stream, idx) => (
                      <motion.tr
                        key={stream.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className="group cursor-pointer hover:bg-background-surface/50 transition-colors"
                        onClick={() => router.push(`/streams/${stream.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div
                            className={cn(
                              'h-9 w-16 rounded-md bg-gradient-to-br',
                              stream.thumbnailGradient,
                            )}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-text-primary truncate max-w-[240px]">
                            {stream.title}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs font-medium',
                              PLATFORM_CONFIG[stream.platform].badgeClass,
                            )}
                          >
                            <span
                              className="mr-1.5 h-1.5 w-1.5 rounded-full inline-block"
                              style={{
                                backgroundColor: PLATFORM_CONFIG[stream.platform].color,
                              }}
                            />
                            {PLATFORM_CONFIG[stream.platform].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {stream.duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {stream.importDate}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={STATUS_CONFIG[stream.status].variant}
                          >
                            {STATUS_CONFIG[stream.status].label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 w-32">
                          {stream.status !== 'completed' &&
                          stream.status !== 'failed' ? (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={stream.progress}
                                className="h-1.5 flex-1"
                                indicatorClassName={
                                  stream.status === 'failed'
                                    ? 'bg-danger'
                                    : 'bg-accent'
                                }
                              />
                              <span className="text-2xs text-text-tertiary tabular-nums">
                                {stream.progress}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-tertiary">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/streams/${stream.id}`);
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Clips
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Re-process
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-danger"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((stream, idx) => (
                <StreamCard key={stream.id} stream={stream} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
