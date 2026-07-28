'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { StreamList } from '@/components/streams/stream-list';

export default function StreamsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Streams"
        description="Import and manage your livestreams for clip generation."
        actions={
          <Button onClick={() => router.push('/streams/import')}>
            <Plus className="mr-2 h-4 w-4" />
            Import Stream
          </Button>
        }
      />

      <StreamList />
    </div>
  );
}
