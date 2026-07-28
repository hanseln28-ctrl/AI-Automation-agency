'use client';

import * as React from 'react';
import { Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Campaign } from './types';
import { CAMPAIGN_STATUS_CONFIG } from './types';

interface CampaignHeaderProps {
  campaign: Campaign;
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const progressPct =
    campaign.totalDeliverables > 0
      ? Math.round((campaign.completedDeliverables / campaign.totalDeliverables) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/sponsorships"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sponsorships
      </Link>

      {/* Campaign header card */}
      <div className="rounded-xl border border-border-subtle bg-background-card p-6 shadow-card">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-2xl font-bold text-white">
              {campaign.brandName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">{campaign.campaignName}</h1>
              <p className="text-sm text-text-secondary">{campaign.brandName}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <Calendar className="h-3.5 w-3.5" />
                  {campaign.startDate} → {campaign.endDate}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                  <DollarSign className="h-3.5 w-3.5" />
                  ${campaign.budget.toLocaleString()} budget
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-background-surface p-3">
            <p className="text-2xs text-text-tertiary">Deliverables</p>
            <p className="text-lg font-bold text-text-primary">
              {campaign.completedDeliverables}/{campaign.totalDeliverables}
            </p>
            <Progress value={progressPct} className="mt-1" />
          </div>
          <div className="rounded-lg bg-background-surface p-3">
            <p className="text-2xs text-text-tertiary">Budget Used</p>
            <p className="text-lg font-bold text-text-primary">
              ${campaign.budgetUsed.toLocaleString()}
            </p>
            <Progress
              value={campaign.budget > 0 ? Math.round((campaign.budgetUsed / campaign.budget) * 100) : 0}
              className="mt-1"
              indicatorClassName="bg-success"
            />
          </div>
          <div className="rounded-lg bg-background-surface p-3">
            <p className="text-2xs text-text-tertiary">Total Clicks</p>
            <p className="text-lg font-bold text-text-primary">{campaign.clicks.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-background-surface p-3">
            <p className="text-2xs text-text-tertiary">Revenue Generated</p>
            <p className="text-lg font-bold text-success">${campaign.revenueGenerated.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
