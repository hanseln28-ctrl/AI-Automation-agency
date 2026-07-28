'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import type { HookPlatform, HookTone } from './types';
import { HOOK_PLATFORM_CONFIG, HOOK_TONE_CONFIG, PLATFORM_OPTIONS, TONE_OPTIONS } from './types';
import { MOCK_CLIP_OPTIONS } from './mock-data';

interface HookInputProps {
  selectedClipId: string;
  selectedPlatforms: HookPlatform[];
  selectedTone: HookTone;
  customText: string;
  onClipChange: (clipId: string) => void;
  onPlatformsChange: (platforms: HookPlatform[]) => void;
  onToneChange: (tone: HookTone) => void;
  onCustomTextChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  className?: string;
}

export function HookInput({
  selectedClipId,
  selectedPlatforms,
  selectedTone,
  customText,
  onClipChange,
  onPlatformsChange,
  onToneChange,
  onCustomTextChange,
  onGenerate,
  isGenerating,
  className,
}: HookInputProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  function togglePlatform(platform: HookPlatform) {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  }

  return (
    <div className={cn('rounded-xl border border-border-subtle bg-background-card p-5 space-y-5', className)}>
      {/* Clip selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
          <Icon name="video" size="sm" color="text-text-tertiary" />
          Select Clip
        </label>
        <select
          value={selectedClipId}
          onChange={(e) => onClipChange(e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-background-surface px-3 py-2.5 text-sm text-text-primary
            focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
        >
          <option value="">Choose a clip...</option>
          {MOCK_CLIP_OPTIONS.map((clip) => (
            <option key={clip.id} value={clip.id}>
              {clip.title} ({clip.duration}s)
            </option>
          ))}
        </select>

        <p className="text-2xs text-text-tertiary">or paste a description below</p>
      </div>

      {/* Custom text */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">
          Video Description / Topic
        </label>
        <textarea
          value={customText}
          onChange={(e) => onCustomTextChange(e.target.value)}
          placeholder="Paste a video description, transcript excerpt, or topic idea..."
          rows={3}
          className="w-full rounded-lg border border-border-subtle bg-background-surface px-3 py-2.5 text-sm text-text-primary
            placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
        />
      </div>

      {/* Platform selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">
          Target Platforms
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_OPTIONS.map((platform) => {
            const config = HOOK_PLATFORM_CONFIG[platform];
            const isSelected = selectedPlatforms.includes(platform);
            return (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                  isSelected
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border-subtle bg-background-surface text-text-secondary hover:text-text-primary hover:border-border',
                )}
              >
                <Icon name={config.icon as any} size="xs" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced: tone selector */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <Icon name={showAdvanced ? 'chevron-up' : 'chevron-down'} size="sm" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {showAdvanced && (
        <MotionDiv
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">
              Tone
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TONE_OPTIONS.map((tone) => {
                const config = HOOK_TONE_CONFIG[tone];
                const isSelected = selectedTone === tone;
                return (
                  <button
                    key={tone}
                    onClick={() => onToneChange(tone)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                      isSelected
                        ? 'border-accent bg-accent-subtle text-accent'
                        : 'border-border-subtle bg-background-surface text-text-secondary hover:text-text-primary',
                    )}
                    title={config.description}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </MotionDiv>
      )}

      {/* Generate button */}
      <Button
        onClick={onGenerate}
        disabled={isGenerating || (selectedPlatforms.length === 0 && !customText)}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Icon name="loader-2" size="sm" color="text-white" className="mr-2 animate-spin" />
            Generating Hooks...
          </>
        ) : (
          <>
            <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
            Generate Hooks
          </>
        )}
      </Button>
    </div>
  );
}
