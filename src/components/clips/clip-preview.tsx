'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import type { ClipFormat } from './types';

interface ClipPreviewProps {
  format: ClipFormat;
  thumbnailGradient?: string;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

const formatClasses: Record<ClipFormat, string> = {
  vertical: 'aspect-[9/16] max-w-[300px] mx-auto',
  horizontal: 'aspect-video w-full',
  square: 'aspect-square max-w-[400px] mx-auto',
};

export function ClipPreview({
  format,
  thumbnailGradient = 'from-[#6C5CE7] via-[#EC4899] to-[#0A0A0F]',
  title,
  className,
  children,
}: ClipPreviewProps) {
  return (
    <div className={cn('relative rounded-xl overflow-hidden shadow-glass border border-border-subtle', formatClasses[format], className)}>
      {/* Gradient background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br',
          thumbnailGradient,
        )}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/10">
          <Icon name="play" size="lg" color="text-white" className="ml-0.5" />
        </div>
      </div>

      {/* Title overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
      )}

      {/* Format indicator */}
      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm text-2xs text-white font-medium">
        {format === 'vertical' ? '9:16' : format === 'horizontal' ? '16:9' : '1:1'}
      </div>

      {/* Children overlay */}
      {children}
    </div>
  );
}
