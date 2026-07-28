'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/icon';
import type { CaptionLine } from './types';

interface CaptionEditorProps {
  lines: CaptionLine[];
  onLinesChange: (lines: CaptionLine[]) => void;
  className?: string;
}

const EMOJI_OPTIONS = ['😱', '🔥', '💀', '😤', '😂', '❤️', '🎉', '💯', '👀', '🏆', '😳', '🤯', '🥹', '🚀', '😭'];

export function CaptionEditor({ lines, onLinesChange, className }: CaptionEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState<string | null>(null);

  function updateLine(id: string, field: keyof CaptionLine, value: string) {
    onLinesChange(lines.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  function addLine() {
    const lastLine = lines[lines.length - 1];
    const newId = `line-${Date.now()}`;
    onLinesChange([
      ...lines,
      {
        id: newId,
        speakerLabel: 'Speaker 1',
        startTime: lastLine ? lastLine.endTime : '00:00.000',
        endTime: lastLine
          ? incrementTime(lastLine.endTime, 2)
          : '00:02.000',
        text: '',
      },
    ]);
  }

  function deleteLine(id: string) {
    if (lines.length <= 1) return;
    onLinesChange(lines.filter((l) => l.id !== id));
  }

  function importFile() {
    // In production this would open a file picker and parse SRT/VTT
    // For now we show a demo message
    alert('In production, this would parse SRT and VTT files. Mock import ready.');
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {lines.length} Caption Lines
          </span>
          <Badge variant="ghost" className="text-2xs">
            Speaker 1
          </Badge>
          {lines.some((l) => l.speakerLabel === 'Speaker 2') && (
            <Badge variant="outline" className="text-2xs">
              Speaker 2
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={importFile}>
            <Icon name="upload" size="sm" className="mr-1.5" />
            Import SRT/VTT
          </Button>
          <Button variant="outline" size="sm" onClick={addLine}>
            <Icon name="plus" size="sm" className="mr-1.5" />
            Add Line
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border-subtle bg-background-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_80px_1fr_60px_100px_40px] gap-2 px-4 py-2.5 border-b border-border-subtle bg-background-surface text-2xs font-semibold text-text-tertiary uppercase tracking-wider">
          <span>Start</span>
          <span>End</span>
          <span>Text</span>
          <span>Emoji</span>
          <span>Speaker</span>
          <span />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border-subtle">
          <AnimatePresence initial={false}>
            {lines.map((line, i) => (
              <MotionDiv
                key={line.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-[80px_80px_1fr_60px_100px_40px] gap-2 px-4 py-2 items-center hover:bg-background-surface/50 transition-colors"
              >
                {/* Start time */}
                <Input
                  value={line.startTime}
                  onChange={(e) => updateLine(line.id, 'startTime', e.target.value)}
                  className="h-7 px-1.5 text-xs font-mono bg-transparent border-border-subtle"
                />

                {/* End time */}
                <Input
                  value={line.endTime}
                  onChange={(e) => updateLine(line.id, 'endTime', e.target.value)}
                  className="h-7 px-1.5 text-xs font-mono bg-transparent border-border-subtle"
                />

                {/* Text */}
                <Input
                  value={line.text}
                  onChange={(e) => updateLine(line.id, 'text', e.target.value)}
                  placeholder="Caption text..."
                  className="h-7 px-2 text-xs bg-transparent border-border-subtle"
                />

                {/* Emoji */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowEmojiPicker(showEmojiPicker === line.id ? null : line.id)
                    }
                    className="flex h-7 w-full items-center justify-center rounded-md border border-border-subtle bg-transparent text-sm hover:border-border transition-colors"
                  >
                    {line.emoji || '—'}
                  </button>
                  <AnimatePresence>
                    {showEmojiPicker === line.id && (
                      <MotionDiv
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 -bottom-2 left-1/2 -translate-x-1/2 translate-y-full"
                      >
                        <div className="rounded-xl border border-border bg-background-elevated shadow-glass-lg p-2">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {EMOJI_OPTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  updateLine(line.id, 'emoji', emoji === line.emoji ? undefined : emoji!);
                                  setShowEmojiPicker(null);
                                }}
                                className={cn(
                                  'h-8 w-8 flex items-center justify-center rounded-lg text-sm hover:bg-background-surface transition-colors',
                                  line.emoji === emoji && 'bg-accent-subtle',
                                )}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>

                {/* Speaker */}
                <Input
                  value={line.speakerLabel}
                  onChange={(e) => updateLine(line.id, 'speakerLabel', e.target.value)}
                  className="h-7 px-1.5 text-xs bg-transparent border-border-subtle"
                />

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-text-tertiary hover:text-danger"
                  onClick={() => deleteLine(line.id)}
                  disabled={lines.length <= 1}
                >
                  <Icon name="trash-2" size="xs" />
                </Button>
              </MotionDiv>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function incrementTime(time: string, seconds: number): string {
  const parts = time.split(':');
  const secParts = parts[1] ? parts[1].split('.') : ['00', '000'];
  let totalSecs = parseInt(parts[0]) * 60 + parseInt(secParts[0]) + seconds;
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${secParts[1] || '000'}`;
}
