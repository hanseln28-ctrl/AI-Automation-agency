'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { PageHeader } from '@/components/shared/page-header';
import { AIUsageDashboard } from '@/components/admin/ai-usage-dashboard';
import { MOCK_AI_USAGE } from '@/components/admin/mock-data';

export default function AdminAIUsagePage() {
  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PageHeader
        title="AI Usage"
        description="Monitor OpenAI API usage, tokens, and costs across all users"
      />

      <AIUsageDashboard records={MOCK_AI_USAGE} />
    </MotionDiv>
  );
}
