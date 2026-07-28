'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/shared/icon';
import { ClipPreview } from './clip-preview';
import { FormatSelector } from './format-selector';
import { DurationSelector } from './duration-selector';
import { MomentBadge } from './moment-badge';
import type { MockClip, ClipFormat, ClipDuration } from './types';

interface ClipEditorProps {
  clip: MockClip;
  onSave?: (clip: MockClip) => void;
  onExport?: (clip: MockClip) => void;
  onPublish?: (clip: MockClip) => void;
}

export function ClipEditor({ clip: initialClip, onSave, onExport, onPublish }: ClipEditorProps) {
  const [clip, setClip] = React.useState(initialClip);
  const [format, setFormat] = React.useState<ClipFormat>(initialClip.format);
  const [duration, setDuration] = React.useState<ClipDuration>(initialClip.duration);
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSave = () => {
    const updated = { ...clip, format, duration };
    setClip(updated);
    setIsSaved(true);
    onSave?.(updated);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Preview */}
      <div className="space-y-4">
        <ClipPreview
          format={format}
          thumbnailGradient={clip.thumbnailGradient}
          title={clip.title}
        />

        {/* Trim sliders (visual only) */}
        <div className="rounded-xl border border-border-subtle bg-background-card p-4 space-y-3">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="scissors" size="sm" color="text-accent" />
            Trim Controls
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-2xs text-text-tertiary mb-1">
                <span>Start: 0:00</span>
                <span>End: {duration}s</span>
              </div>
              <div className="relative h-8 bg-background-surface rounded-lg overflow-hidden border border-border-subtle">
                {/* Selected region */}
                <div
                  className="absolute top-1 bottom-1 rounded-md bg-accent/20 border border-accent/30"
                  style={{ left: '2%', right: '8%' }}
                />
                {/* Start handle */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-accent cursor-ew-resize rounded"
                  style={{ left: '2%' }}
                />
                {/* End handle */}
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-accent cursor-ew-resize rounded"
                  style={{ left: '92%' }}
                />
                {/* Playhead */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: '35%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Clip Title
          </label>
          <Input
            value={clip.title}
            onChange={(e) => setClip({ ...clip, title: e.target.value })}
            placeholder="Enter clip title..."
          />
        </div>

        {/* Format Selector */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Format
          </label>
          <FormatSelector value={format} onChange={setFormat} />
        </div>

        {/* Duration Selector */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1.5 block">
            Duration
          </label>
          <DurationSelector value={duration} onChange={setDuration} />
        </div>

        {/* Moment Detection Info */}
        <div className="rounded-xl border border-border-subtle bg-background-card p-4 space-y-3">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="sparkles" size="sm" color="text-accent" />
            Moment Detection
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Type:</span>
              <MomentBadge type={clip.momentType} showIcon />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Confidence:</span>
              <span className="text-text-primary font-medium">{clip.momentConfidence}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">Timestamp:</span>
              <span className="text-text-primary font-mono text-xs">{clip.momentTimestamp}</span>
            </div>
            <div className="pt-1">
              <p className="text-xs text-text-secondary leading-relaxed">{clip.aiReasoning}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} variant="default">
            <Icon name="save" size="sm" color="text-white" className="mr-2" />
            {isSaved ? 'Saved!' : 'Save Draft'}
          </Button>
          <Button onClick={() => onExport?.(clip)} variant="secondary">
            <Icon name="download" size="sm" className="mr-2" />
            Export
          </Button>
          <Button onClick={() => onPublish?.(clip)} variant="outline">
            <Icon name="send" size="sm" className="mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
