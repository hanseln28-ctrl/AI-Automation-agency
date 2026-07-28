'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MomentTimeline } from '@/components/clips/moment-timeline';
import { MomentCard } from '@/components/clips/moment-card';
import { GeneratePipeline } from '@/components/clips/generate-pipeline';
import { MOCK_MOMENTS, MOCK_STREAMS_FOR_GENERATE } from '@/components/clips/mock-data';
import type { MockMoment } from '@/components/clips/types';

type GeneratePhase = 'select' | 'analyzing' | 'results' | 'generating';

export default function GenerateClipsPage() {
  const router = useRouter();
  const [phase, setPhase] = React.useState<GeneratePhase>('select');
  const [selectedStreamId, setSelectedStreamId] = React.useState('');
  const [moments, setMoments] = React.useState<MockMoment[]>([]);
  const [selectedMomentId, setSelectedMomentId] = React.useState<string | undefined>();
  const [pipelineStage, setPipelineStage] = React.useState(0);

  const selectedStream = MOCK_STREAMS_FOR_GENERATE.find((s) => s.id === selectedStreamId);
  const selectedCount = moments.filter((m) => m.selected).length;

  const handleStreamSelect = (streamId: string) => {
    setSelectedStreamId(streamId);
    setPhase('analyzing');

    // Simulate analysis progress
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setPipelineStage(Math.min(tick, 2));
      if (tick >= 3) {
        clearInterval(interval);
        // Load mock moments for the stream
        const streamMoments = MOCK_MOMENTS.filter((m) => m.streamId === streamId);
        setMoments(streamMoments);
        setSelectedMomentId(streamMoments[0]?.id);
        setPhase('results');
      }
    }, 800);
  };

  const handleToggleMoment = (id: string) => {
    setMoments((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)),
    );
  };

  const handleMomentClick = (moment: MockMoment) => {
    setSelectedMomentId(moment.id);
  };

  const handleGenerate = () => {
    setPhase('generating');
    setPipelineStage(0);

    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setPipelineStage(Math.min(tick, 4));
      if (tick >= 5) {
        clearInterval(interval);
        router.push('/clips');
      }
    }, 1000);
  };

  const selectedMoment = moments.find((m) => m.id === selectedMomentId);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title="Generate Clips"
        description="AI will analyze your stream and detect viral-worthy moments."
        actions={
          phase !== 'select' && (
            <Button variant="outline" onClick={() => setPhase('select')}>
              <Icon name="arrow-left" size="sm" className="mr-2" />
              Back
            </Button>
          )
        }
      />

      {/* Phase: Select Stream */}
      {phase === 'select' && (
        <motion.div
          className="max-w-lg mx-auto space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-xl border border-border-subtle bg-background-card p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle">
                <Icon name="sparkles" size="xl" color="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Select a Stream</h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                Choose a stream you've imported. AI will analyze it to find the best moments for clips.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-text-secondary">Stream</label>
              <Select value={selectedStreamId} onValueChange={handleStreamSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a stream to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_STREAMS_FOR_GENERATE.map((stream) => (
                    <SelectItem key={stream.id} value={stream.id}>
                      <span className="flex items-center gap-2">
                        <span className="text-text-primary">{stream.title}</span>
                        <span className="text-text-tertiary text-xs">({stream.duration})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              disabled={!selectedStreamId}
              onClick={() => handleStreamSelect(selectedStreamId)}
            >
              <Icon name="play" size="sm" color="text-white" className="mr-2" />
              Start Analysis
            </Button>
          </div>
        </motion.div>
      )}

      {/* Phase: Analyzing */}
      {phase === 'analyzing' && (
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-xl border border-border-subtle bg-background-card p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle">
                <Icon name="loader-2" size="xl" color="text-accent" className="animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Analyzing Stream</h3>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedStream?.title}
                </p>
              </div>
            </div>

            <GeneratePipeline currentStage={pipelineStage} />
          </div>
        </motion.div>
      )}

      {/* Phase: Results */}
      {phase === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline + moments list */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="rounded-xl border border-border-subtle bg-background-card p-4">
              {selectedStream && (
                <MomentTimeline
                  duration={selectedStream.duration}
                  moments={moments}
                  selectedMomentId={selectedMomentId}
                  onMomentClick={handleMomentClick}
                />
              )}
            </div>

            {/* Moment cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">
                  Detected Moments ({moments.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                <AnimatePresence>
                  {moments.map((moment, idx) => (
                    <MomentCard
                      key={moment.id}
                      moment={moment}
                      index={idx}
                      onToggle={handleToggleMoment}
                      onClick={handleMomentClick}
                      isActive={moment.id === selectedMomentId}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Side panel: Selected moment details */}
          <div className="lg:col-span-1 space-y-4">
            {selectedMoment ? (
              <motion.div
                className="rounded-xl border border-border-subtle bg-background-card p-4 space-y-4 sticky top-4"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                key={selectedMoment.id}
              >
                <h3 className="text-sm font-semibold text-text-primary">Moment Details</h3>

                {/* Thumbnail */}
                <div
                  className={cn(
                    'aspect-video rounded-lg bg-gradient-to-br',
                    selectedMoment.thumbnailGradient,
                  )}
                />

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-text-tertiary text-xs">Type</span>
                    <div className="mt-1">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border"
                        style={{
                          color: 'var(--badge-color)',
                          borderColor: 'var(--badge-color)',
                          backgroundColor: 'color-mix(in srgb, var(--badge-color) 15%, transparent)',
                        }}
                      >
                        ● {selectedMoment.momentType.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-text-tertiary text-xs">Confidence</span>
                    <p className="text-text-primary font-semibold text-lg mt-0.5">
                      {selectedMoment.confidence}%
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-background-surface overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${selectedMoment.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-text-tertiary text-xs">Timestamp</span>
                    <p className="text-text-primary font-mono text-xs mt-0.5">
                      {selectedMoment.timestamp}
                    </p>
                  </div>

                  <div>
                    <span className="text-text-tertiary text-xs">Suggested Duration</span>
                    <p className="text-text-primary mt-0.5">{selectedMoment.durationSuggestion}s</p>
                  </div>

                  <div>
                    <span className="text-text-tertiary text-xs">AI Reasoning</span>
                    <p className="text-text-secondary text-xs leading-relaxed mt-1">
                      {selectedMoment.aiReasoning}
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={selectedCount === 0}
                >
                  <Icon name="sparkles" size="sm" color="text-white" className="mr-2" />
                  Generate {selectedCount} Selected Clip{selectedCount !== 1 ? 's' : ''}
                </Button>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-border-subtle bg-background-card p-6 text-center">
                <p className="text-sm text-text-tertiary">
                  Click a moment marker on the timeline or a card to see details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase: Generating */}
      {phase === 'generating' && (
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-xl border border-border-subtle bg-background-card p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-subtle">
                <Icon name="sparkles" size="xl" color="text-accent" className="animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Generating {selectedCount} Clip{selectedCount !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Creating clips from selected moments...
                </p>
              </div>
            </div>

            <GeneratePipeline currentStage={pipelineStage} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
