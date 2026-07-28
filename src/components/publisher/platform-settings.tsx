'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Switch } from '@/components/ui/switch';
import type { PublisherPlatform, PostPlatformSettings } from './types';
import { PUBLISHER_PLATFORM_CONFIG, YOUTUBE_CATEGORIES } from './types';

interface PlatformSettingsProps {
  platform: PublisherPlatform;
  settings: PostPlatformSettings;
  onChange: (settings: PostPlatformSettings) => void;
}

export const PlatformSettings: React.FC<PlatformSettingsProps> = ({
  platform,
  settings,
  onChange,
}) => {
  const cfg = PUBLISHER_PLATFORM_CONFIG[platform];

  return (
    <div className="rounded-xl border border-border bg-background-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className={cn('flex h-7 w-7 items-center justify-center rounded-md', cfg.bgClass)}>
          <Icon name={cfg.icon as any} size="sm" color={cfg.textClass} />
        </div>
        <span className="text-sm font-semibold text-text-primary">{cfg.label} Settings</span>
      </div>

      <div className="space-y-3">
        {/* TikTok */}
        {platform === 'tiktok' && (
          <>
            <SettingRow label="Allow comments" enabled={settings.allowComments ?? true} onChange={(v) => onChange({ ...settings, allowComments: v })} />
            <SettingRow label="Allow Duet" enabled={settings.allowDuet ?? true} onChange={(v) => onChange({ ...settings, allowDuet: v })} />
            <SettingRow label="Allow Stitch" enabled={settings.allowStitch ?? true} onChange={(v) => onChange({ ...settings, allowStitch: v })} />
          </>
        )}

        {/* YouTube Shorts */}
        {platform === 'youtube_shorts' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">Category</label>
              <select
                value={settings.category || 'Gaming'}
                onChange={(e) => onChange({ ...settings, category: e.target.value })}
                className="w-full rounded-lg border border-border bg-background-card px-3 py-2 text-xs text-text-primary focus:border-accent focus:outline-none"
              >
                {YOUTUBE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary">Playlist (optional)</label>
              <input
                type="text"
                value={settings.playlist || ''}
                onChange={(e) => onChange({ ...settings, playlist: e.target.value })}
                placeholder="e.g. Best Clips 2025"
                className="w-full rounded-lg border border-border bg-background-card px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
              />
            </div>
            <SettingRow label="Made for Kids" enabled={settings.madeForKids ?? false} onChange={(v) => onChange({ ...settings, madeForKids: v })} />
          </>
        )}

        {/* Instagram */}
        {platform === 'instagram' && (
          <>
            <SettingRow label="Share to Feed" enabled={settings.shareToFeed ?? true} onChange={(v) => onChange({ ...settings, shareToFeed: v })} />
            <SettingRow label="Post to Reels" enabled={settings.postToReels ?? true} onChange={(v) => onChange({ ...settings, postToReels: v })} />
          </>
        )}

        {/* X/Twitter */}
        {platform === 'x' && (
          <SettingRow label="Thread mode" enabled={settings.threadMode ?? false} onChange={(v) => onChange({ ...settings, threadMode: v })} description="Split longer content into a thread" />
        )}

        {/* Facebook, Threads, LinkedIn, Discord — no special settings */}
        {(platform === 'facebook' || platform === 'threads' || platform === 'linkedin' || platform === 'discord') && (
          <p className="text-xs text-text-tertiary">No additional settings for {cfg.label}.</p>
        )}
      </div>
    </div>
  );
};

function SettingRow({
  label,
  enabled,
  onChange,
  description,
}: {
  label: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        {description && <p className="text-2xs text-text-tertiary">{description}</p>}
      </div>
      <Switch checked={enabled} onCheckedChange={onChange} />
    </div>
  );
}
