'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import type { CaptionStyle, CaptionSettings } from './types';
import { CAPTION_STYLE_CONFIGS } from './types';

interface CaptionPreviewProps {
  clipTitle: string;
  thumbnailGradient: string;
  style: CaptionStyle;
  settings: CaptionSettings;
  onStyleChange: (style: CaptionStyle) => void;
  className?: string;
}

// Mock caption lines for preview
const PREVIEW_LINES = [
  { text: "Oh my god, did you see that?!", time: 0 },
  { text: "That was literally the most insane play!", time: 1.5 },
  { text: "No way. NO WAY! 💀", time: 3 },
  { text: "Chat, clip that right now!", time: 4.5 },
];

export function CaptionPreview({
  clipTitle,
  thumbnailGradient,
  style,
  settings,
  onStyleChange,
  className,
}: CaptionPreviewProps) {
  const [showCaptions, setShowCaptions] = React.useState(true);
  const [scrubPosition, setScrubPosition] = React.useState(30); // percent
  const [activeLineIndex, setActiveLineIndex] = React.useState(0);

  // Simulate playback advancing captions
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveLineIndex((prev) => (prev + 1) % PREVIEW_LINES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const activeLine = PREVIEW_LINES[activeLineIndex];
  const styleConfig = CAPTION_STYLE_CONFIGS.find((s) => s.key === style);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Video frame */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-background-elevated border border-border-subtle">
        {/* Thumbnail gradient background */}
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', thumbnailGradient)} />

        {/* Fake video content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Icon name="play-circle" size="xl" color="text-white/60" />
            <p className="text-xs text-white/50 font-medium">{clipTitle}</p>
          </div>
        </div>

        {/* Caption overlay */}
        {showCaptions && (
          <div
            className={cn(
              'absolute left-0 right-0 px-6 py-3',
              settings.position === 'top' && 'top-4',
              settings.position === 'center' && 'top-1/2 -translate-y-1/2',
              settings.position === 'bottom' && 'bottom-4',
            )}
          >
            <motion.div
              key={activeLineIndex + settings.animation}
              initial={getAnimationInitial(settings.animation)}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={cn(
                'text-center',
                settings.background === 'semi' && 'inline-block mx-auto rounded-lg bg-black/60 backdrop-blur-sm px-4 py-2',
                settings.background === 'box' && 'inline-block mx-auto rounded-md bg-black/80 px-4 py-2',
              )}
            >
              <span
                className={cn(
                  'font-bold leading-tight drop-shadow-lg',
                  style === 'kinetic' && 'tracking-tight',
                  style === 'minimal' && 'font-light tracking-widest',
                  style === 'bold' && 'tracking-tight',
                  style === 'emoji' && '',
                )}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  color: settings.fontColor,
                  textShadow: style === 'bold'
                    ? '0 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.9)'
                    : '0 1px 4px rgba(0,0,0,0.6)',
                }}
              >
                {activeLine.text}
              </span>
            </motion.div>
          </div>
        )}

        {/* Scrubber bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/50 to-transparent">
          <div
            className="absolute bottom-2 left-2 right-2 h-1 rounded-full bg-white/20 cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setScrubPosition((x / rect.width) * 100);
            }}
          >
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${scrubPosition}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${scrubPosition}% - 6px)` }}
            />
          </div>
        </div>

        {/* Top controls */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="text-2xs bg-black/60 backdrop-blur-sm text-white rounded-md px-1.5 py-0.5">
            PREVIEW
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Style switcher */}
        <div className="flex items-center gap-1.5 rounded-lg bg-background-surface p-1">
          {CAPTION_STYLE_CONFIGS.map((s) => (
            <button
              key={s.key}
              onClick={() => onStyleChange(s.key)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                style === s.key
                  ? 'bg-background-card text-accent shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCaptions(!showCaptions)}
          className="text-xs"
        >
          <Icon name={showCaptions ? 'eye-off' : 'eye'} size="sm" className="mr-1.5" />
          {showCaptions ? 'Hide' : 'Show'} Captions
        </Button>
      </div>
    </div>
  );
}

function getAnimationInitial(anim: string): Record<string, number> {
  switch (anim) {
    case 'pop':
      return { opacity: 0, scale: 0.7, y: 5 };
    case 'fade':
      return { opacity: 0, y: 0 };
    case 'slide':
      return { opacity: 0, y: 15 };
    case 'typewriter':
      return { opacity: 0, scale: 0.98 };
    default:
      return { opacity: 0, y: 5 };
  }
}
