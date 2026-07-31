'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { StreamList } from '@/components/streams/stream-list';
import { useStreams } from '@/lib/hooks/use-streams';
import { streamToMock } from '@/lib/adapters';

export default function StreamsPage() {
  const router = useRouter();
  const { data: apiStreams, isLoading, error } = useStreams();

  const streams = React.useMemo(
    () => (apiStreams ? apiStreams.map(streamToMock) : []),
    [apiStreams],
  );

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

      <StreamList
        streams={streams}
        isLoading={isLoading}
        error={error as Error | null}
      />
    </div>
  );
}
