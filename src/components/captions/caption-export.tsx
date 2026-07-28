'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { toast } from 'sonner';
import type { CaptionExportFormat } from './types';
import { CAPTION_EXPORT_FORMATS } from './types';

interface CaptionExportProps {
  clipId: string;
  clipTitle: string;
  className?: string;
}

export function CaptionExport({ clipId, clipTitle, className }: CaptionExportProps) {
  const [selectedFormat, setSelectedFormat] = React.useState<CaptionExportFormat>('srt');
  const [isExporting, setIsExporting] = React.useState(false);

  function handleExport() {
    setIsExporting(true);
    // Mock export — in production this would generate and download the file
    setTimeout(() => {
      setIsExporting(false);
      const format = CAPTION_EXPORT_FORMATS.find((f) => f.format === selectedFormat);
      toast.success(`Captions exported as ${format?.label}`, {
        description: `${clipTitle}${format?.extension}`,
      });
    }, 1200);
  }

  function handleApply() {
    toast.success('Captions applied to clip', {
      description: 'The captions have been burned into the video.',
    });
  }

  return (
    <div className={cn('space-y-4 rounded-xl border border-border-subtle bg-background-card p-5', className)}>
      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
        <Icon name="download" size="sm" color="text-accent" />
        Export Captions
      </h3>

      {/* Format selector */}
      <div className="space-y-2">
        {CAPTION_EXPORT_FORMATS.map((fmt, i) => (
          <motion.button
            key={fmt.format}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, delay: i * 0.04 }}
            onClick={() => setSelectedFormat(fmt.format)}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
              selectedFormat === fmt.format
                ? 'border-accent bg-accent-subtle'
                : 'border-border-subtle bg-background-surface hover:border-border',
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                selectedFormat === fmt.format
                  ? 'border-accent'
                  : 'border-text-tertiary',
              )}
            >
              {selectedFormat === fmt.format && (
                <motion.div
                  layoutId="exportRadio"
                  className="h-2 w-2 rounded-full bg-accent"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{fmt.label}</p>
              <p className="text-2xs text-text-tertiary truncate">{fmt.description}</p>
            </div>

            <span className="text-2xs font-mono text-text-tertiary shrink-0">{fmt.extension}</span>
          </motion.button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1"
        >
          {isExporting ? (
            <>
              <Icon name="loader-2" size="sm" color="text-white" className="mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Icon name="download" size="sm" color="text-white" className="mr-2" />
              Download {CAPTION_EXPORT_FORMATS.find((f) => f.format === selectedFormat)?.label}
            </>
          )}
        </Button>

        {selectedFormat === 'burned_in' && (
          <Button variant="outline" onClick={handleApply}>
            <Icon name="video" size="sm" className="mr-2" />
            Apply to Clip
          </Button>
        )}
      </div>
    </div>
  );
}
