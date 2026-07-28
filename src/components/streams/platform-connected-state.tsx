'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG } from './types';
import type { Platform } from './types';

interface PlatformConnectedStateProps {
  platform: Platform;
  accountName: string;
  handle?: string;
  accountAvatar?: string;
  onImport: () => void;
  onDisconnect: () => void;
}

export function PlatformConnectedState({
  platform,
  accountName,
  handle,
  onImport,
  onDisconnect,
}: PlatformConnectedStateProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: config.color }}
        >
          {accountName.charAt(0)}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-text-primary">{accountName}</p>
          {handle && (
            <p className="text-xs text-text-tertiary">{handle}</p>
          )}
          <p className="text-xs text-success mt-0.5">Connected ✓</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <Button size="sm" className="w-full" onClick={onImport}>
          Import Latest Stream
        </Button>
        <button
          onClick={onDisconnect}
          className="text-xs text-text-tertiary hover:text-danger transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
