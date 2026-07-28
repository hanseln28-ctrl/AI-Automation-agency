'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import type {
  CaptionPosition,
  CaptionAnimation,
  CaptionBackground,
  CaptionSettings,
} from './types';
import {
  CAPTION_POSITION_CONFIG,
  CAPTION_ANIMATION_CONFIG,
  CAPTION_BACKGROUND_CONFIG,
} from './types';

interface CaptionSettingsPanelProps {
  settings: CaptionSettings;
  onSettingsChange: (settings: CaptionSettings) => void;
  className?: string;
}

const PRESET_COLORS = ['#FFFFFF', '#FFD700', '#FF6B6B', '#6C5CE7', '#10B981', '#3B82F6', '#F97316', '#EC4899'];

export function CaptionSettingsPanel({ settings, onSettingsChange, className }: CaptionSettingsPanelProps) {
  function update<K extends keyof CaptionSettings>(key: K, value: CaptionSettings[K]) {
    onSettingsChange({ ...settings, [key]: value });
  }

  return (
    <div className={cn('space-y-6 rounded-xl border border-border-subtle bg-background-card p-5', className)}>
      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
        <Icon name="sliders" size="sm" color="text-accent" />
        Caption Settings
      </h3>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-secondary">Font Size</label>
          <span className="text-xs font-mono text-accent">{settings.fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={48}
          step={2}
          value={settings.fontSize}
          onChange={(e) => update('fontSize', Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-background-surface cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="flex justify-between text-2xs text-text-tertiary">
          <span>12px</span>
          <span>48px</span>
        </div>
      </div>

      {/* Font Color */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">Font Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => update('fontColor', color)}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-all',
                settings.fontColor === color
                  ? 'border-white scale-110 shadow-md'
                  : 'border-transparent hover:scale-105',
              )}
              style={{ backgroundColor: color }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={settings.fontColor}
              onChange={(e) => update('fontColor', e.target.value)}
              className="h-8 w-8 rounded-full border-2 border-border-subtle cursor-pointer bg-transparent
                [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0"
            />
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">Background</label>
        <div className="flex gap-2">
          {(Object.entries(CAPTION_BACKGROUND_CONFIG) as [CaptionBackground, { label: string }][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => update('background', key)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                  settings.background === key
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border-subtle bg-background-surface text-text-secondary hover:text-text-primary',
                )}
              >
                {config.label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Position */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">Position</label>
        <div className="flex gap-2">
          {(Object.entries(CAPTION_POSITION_CONFIG) as [CaptionPosition, { label: string }][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => update('position', key)}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                  settings.position === key
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border-subtle bg-background-surface text-text-secondary hover:text-text-primary',
                )}
              >
                {config.label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Animation */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-text-secondary">Animation Style</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(CAPTION_ANIMATION_CONFIG) as [CaptionAnimation, { label: string }][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => update('animation', key)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                  settings.animation === key
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border-subtle bg-background-surface text-text-secondary hover:text-text-primary',
                )}
              >
                {config.label}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
