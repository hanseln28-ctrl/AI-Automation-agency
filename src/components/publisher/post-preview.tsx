'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import type { PublisherPlatform } from './types';
import { PUBLISHER_PLATFORM_CONFIG } from './types';

interface PostPreviewProps {
  platform: PublisherPlatform;
  caption: string;
  hashtags: string[];
  thumbnailGradient: string;
  clipTitle: string;
}

const PLATFORM_PREVIEW_STYLES: Record<PublisherPlatform, { bg: string; maxW: string; headerBg: string }> = {
  tiktok: { bg: 'bg-[#121212]', maxW: 'max-w-[280px]', headerBg: 'bg-[#1A1A1A]' },
  instagram: { bg: 'bg-[#1A1A1A]', maxW: 'max-w-[320px]', headerBg: 'bg-[#222222]' },
  youtube_shorts: { bg: 'bg-[#0F0F0F]', maxW: 'max-w-[280px]', headerBg: 'bg-[#1A1A1A]' },
  facebook: { bg: 'bg-[#18191A]', maxW: 'max-w-[380px]', headerBg: 'bg-[#242526]' },
  threads: { bg: 'bg-[#101010]', maxW: 'max-w-[340px]', headerBg: 'bg-[#1A1A1A]' },
  x: { bg: 'bg-[#15202B]', maxW: 'max-w-[380px]', headerBg: 'bg-[#1A2B3C]' },
  linkedin: { bg: 'bg-[#1B1F23]', maxW: 'max-w-[380px]', headerBg: 'bg-[#28323B]' },
  discord: { bg: 'bg-[#313338]', maxW: 'max-w-[380px]', headerBg: 'bg-[#2B2D31]' },
};

export const PostPreview: React.FC<PostPreviewProps> = ({
  platform,
  caption,
  hashtags,
  thumbnailGradient,
  clipTitle,
}) => {
  const cfg = PUBLISHER_PLATFORM_CONFIG[platform];
  const style = PLATFORM_PREVIEW_STYLES[platform];

  const displayText = caption || 'Your caption will appear here...';
  const displayHashtags = hashtags.length > 0 ? hashtags.join(' ') : '';

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'mx-auto overflow-hidden rounded-2xl border border-border shadow-glass-lg',
        style.bg,
        style.maxW,
      )}
    >
      {/* Platform header bar */}
      <div className={cn('flex items-center gap-2 px-3 py-2', style.headerBg)}>
        <div className={cn('flex h-6 w-6 items-center justify-center rounded-full', cfg.bgClass)}>
          <Icon name={cfg.icon as any} size="xs" color={cfg.textClass} />
        </div>
        <span className="text-xs font-medium text-text-secondary">{cfg.label}</span>
      </div>

      {/* Thumbnail */}
      <div className={cn('relative aspect-video w-full bg-gradient-to-br', thumbnailGradient)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
            <Icon name="play" size="md" color="text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-2xs text-white">
          {clipTitle.length > 40 ? clipTitle.slice(0, 40) + '...' : clipTitle}
        </div>
      </div>

      {/* Caption */}
      <div className="p-3">
        <p className="text-xs leading-relaxed text-text-secondary">
          {displayText}
        </p>
        {displayHashtags && (
          <p className="mt-1 text-xs leading-relaxed" style={{ color: cfg.color }}>
            {displayHashtags}
          </p>
        )}
      </div>

      {/* Engagement bar */}
      <div className={cn('flex items-center gap-4 border-t border-border px-3 py-2', style.headerBg)}>
        <span className="flex items-center gap-1 text-2xs text-text-tertiary">
          <Icon name="heart" size="xs" color="text-text-tertiary" /> 0
        </span>
        <span className="flex items-center gap-1 text-2xs text-text-tertiary">
          <Icon name="message-circle" size="xs" color="text-text-tertiary" /> 0
        </span>
        <span className="flex items-center gap-1 text-2xs text-text-tertiary">
          <Icon name="share-2" size="xs" color="text-text-tertiary" /> 0
        </span>
      </div>
    </MotionDiv>
  );
};
