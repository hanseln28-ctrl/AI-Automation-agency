'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLATFORM_CONFIG } from './types';
import type { Platform, PlatformConnection } from './types';

interface PlatformConnectCardProps {
  connection: PlatformConnection;
  onConnect: (platform: Platform) => void;
  onDisconnect: (platform: Platform) => void;
  onImport: (platform: Platform) => void;
}

const PLATFORM_ICONS: Record<Platform, string> = {
  twitch: '🎮',
  kick: '🥊',
  youtube: '▶️',
  tiktok: '🎵',
  upload: '📁',
};

export function PlatformConnectCard({
  connection,
  onConnect,
  onDisconnect,
  onImport,
}: PlatformConnectCardProps) {
  const config = PLATFORM_CONFIG[connection.platform];
  const isConnected = connection.connected;

  return (
    <MotionDiv
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card
        className={cn(
          'relative overflow-hidden p-6 h-full',
          'border-border-subtle bg-background-card',
          'transition-all duration-300',
          'hover:border-border hover:shadow-glass',
        )}
      >
        {/* Glow accent */}
        <div
          className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
          style={{ backgroundColor: config.color }}
        />

        <div className="relative flex flex-col items-center text-center gap-4">
          {/* Platform Icon */}
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl text-2xl',
              config.iconBgClass,
            )}
          >
            {PLATFORM_ICONS[connection.platform]}
          </div>

          {/* Platform Name */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {config.label}
            </h3>
            {isConnected ? (
              <p className="mt-1 text-sm text-success">Connected ✓</p>
            ) : (
              <p className="mt-1 text-sm text-text-tertiary">
                Not connected
              </p>
            )}
          </div>

          {/* Connected State */}
          {isConnected && connection.accountName && (
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 justify-center">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: config.color }}
                >
                  {connection.accountName.charAt(0)}
                </div>
                <span className="text-sm text-text-secondary">
                  {connection.handle ?? connection.accountName}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => onImport(connection.platform)}
                >
                  Import Latest Stream
                </Button>
                <button
                  onClick={() => onDisconnect(connection.platform)}
                  className="text-xs text-text-tertiary hover:text-danger transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          {/* Disconnected State */}
          {!isConnected && (
            <Button
              variant="outline"
              size="sm"
              className="mt-1 w-full"
              onClick={() => onConnect(connection.platform)}
            >
              Connect {config.label}
            </Button>
          )}
        </div>
      </Card>
    </MotionDiv>
  );
}
