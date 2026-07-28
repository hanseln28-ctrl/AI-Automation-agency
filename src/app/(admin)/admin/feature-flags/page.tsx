'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { FeatureFlagsList } from '@/components/admin/feature-flags-list';
import { MOCK_FEATURE_FLAGS } from '@/components/admin/mock-data';
import type { AdminFeatureFlag } from '@/components/admin/types';

export default function AdminFeatureFlagsPage() {
  const [flags, setFlags] = React.useState(MOCK_FEATURE_FLAGS);

  const handleToggle = (flagId: string) => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.id !== flagId) return f;
        const newState = !f.enabled;
        toast(`${f.name}: ${newState ? 'Enabled' : 'Disabled'}`);
        return { ...f, enabled: newState, lastModified: new Date().toISOString() };
      }),
    );
  };

  const handleRolloutChange = (flagId: string, percentage: number) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === flagId
          ? { ...f, rolloutPercentage: percentage, lastModified: new Date().toISOString() }
          : f,
      ),
    );
  };

  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PageHeader
        title="Feature Flags"
        description="Toggle platform features and control rollout percentages"
      />

      <FeatureFlagsList
        flags={flags}
        onToggle={handleToggle}
        onRolloutChange={handleRolloutChange}
      />
    </MotionDiv>
  );
}
