'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/components/shared/empty-state';
import { Video } from 'lucide-react';
import { ClipCard } from './clip-card';
import type { MockClip } from './types';

interface ClipGridProps {
  clips: MockClip[];
  isLoading?: boolean;
  activeTab: string;
}

export function ClipGrid({ clips, isLoading = false, activeTab }: ClipGridProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border-subtle bg-background-card overflow-hidden animate-pulse"
          >
            <div className="aspect-video bg-background-elevated" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 rounded bg-background-elevated" />
              <div className="h-3 w-1/2 rounded bg-background-elevated" />
              <div className="h-5 w-16 rounded-full bg-background-elevated" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clips.length === 0) {
    const emptyMessages: Record<string, { title: string; description: string }> = {
      all: {
        title: 'No clips yet',
        description: 'Generate your first clip from an imported stream.',
      },
      ready: {
        title: 'No clips ready to publish',
        description: 'All clips are either published, queued, or archived.',
      },
      published: {
        title: 'No published clips',
        description: 'Ready clips can be published to your connected platforms.',
      },
      archived: {
        title: 'No archived clips',
        description: 'Archive clips you no longer need front and center.',
      },
    };

    const msg = emptyMessages[activeTab] || emptyMessages.all;

    return (
      <EmptyState
        icon={Video}
        title={msg.title}
        description={msg.description}
        actionLabel="Generate New Clips"
        onAction={() => router.push('/clips/generate')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {clips.map((clip, idx) => (
          <ClipCard key={clip.id} clip={clip} index={idx} />
        ))}
      </AnimatePresence>
    </div>
  );
}
