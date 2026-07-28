'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { Icon } from '@/components/shared/icon';
import { HookInput } from '@/components/hooks/hook-input';
import { HookResults } from '@/components/hooks/hook-results';
import { generateMockHookResult, getClipOptionById } from '@/components/hooks/mock-data';
import type { HookPlatform, HookTone, HookGenerationResult } from '@/components/hooks/types';

export default function HooksPage() {
  const [selectedClipId, setSelectedClipId] = React.useState('');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<HookPlatform[]>(['tiktok']);
  const [selectedTone, setSelectedTone] = React.useState<HookTone>('casual');
  const [customText, setCustomText] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [result, setResult] = React.useState<HookGenerationResult | null>(null);

  function handleGenerate() {
    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const clipOption = getClipOptionById(selectedClipId);
      const clipTitle = clipOption?.title || customText.slice(0, 50) || 'Custom Content';

      const generated = generateMockHookResult(
        selectedClipId || 'custom',
        clipTitle,
        selectedPlatforms,
        selectedTone,
      );

      setResult(generated);
      setIsGenerating(false);
    }, 2000);
  }

  function handleRegenerate() {
    handleGenerate();
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="AI Hook Generator"
        description="Generate viral titles, hooks, descriptions, hashtags, and SEO keywords for your clips. Optimized for every platform."
      />

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Input */}
        <div className="lg:col-span-2">
          <HookInput
            selectedClipId={selectedClipId}
            selectedPlatforms={selectedPlatforms}
            selectedTone={selectedTone}
            customText={customText}
            onClipChange={setSelectedClipId}
            onPlatformsChange={setSelectedPlatforms}
            onToneChange={setSelectedTone}
            onCustomTextChange={setCustomText}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-3">
          {isGenerating && !result && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border-subtle bg-background-card">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Icon name="loader-2" size="xl" color="text-accent" />
              </motion.div>
              <p className="mt-4 text-sm font-medium text-text-primary">Generating hooks...</p>
              <p className="mt-1 text-xs text-text-tertiary">Analyzing clip content and optimizing for engagement</p>
            </div>
          )}

          {!result && !isGenerating && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-border-subtle bg-background-card/50">
              <div className="h-16 w-16 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
                <Icon name="sparkles" size="xl" color="text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text-primary">Ready to Generate</h3>
              <p className="mt-1 text-sm text-text-secondary text-center max-w-sm">
                Select a clip or paste a description, choose your platforms, and let AI generate optimized hooks.
              </p>
            </div>
          )}

          {result && (
            <HookResults
              result={result}
              onRegenerate={handleRegenerate}
              isRegenerating={isGenerating}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
