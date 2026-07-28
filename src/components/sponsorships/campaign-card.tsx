'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Calendar, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { staggerItem } from '@/lib/utils/animations';
import type { Campaign } from './types';
import { CAMPAIGN_STATUS_CONFIG } from './types';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const progressPct =
    campaign.totalDeliverables > 0
      ? Math.round((campaign.completedDeliverables / campaign.totalDeliverables) * 100)
      : 0;
  const budgetPct = campaign.budget > 0 ? Math.round((campaign.budgetUsed / campaign.budget) * 100) : 0;

  return (
    <MotionDiv variants={staggerItem}>
      <Link href={`/sponsorships/${campaign.id}`}>
        <Card className="group cursor-pointer transition-all duration-200 hover:shadow-elevated hover:border-accent/20">
          <CardContent className="p-5">
            {/* Header: Brand + Status */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-hover text-lg font-bold text-white">
                  {campaign.brandName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{campaign.campaignName}</p>
                  <p className="text-sm text-text-secondary">{campaign.brandName}</p>
                </div>
              </div>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>

            {/* Dates */}
            <div className="mb-4 flex items-center gap-1 text-xs text-text-tertiary">
              <Calendar className="h-3 w-3" />
              <span>{campaign.startDate}</span>
              <span className="mx-1">→</span>
              <span>{campaign.endDate}</span>
            </div>

            {/* Deliverables progress */}
            <div className="mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Deliverables</span>
                <span className="font-medium text-text-primary">
                  {campaign.completedDeliverables}/{campaign.totalDeliverables}
                </span>
              </div>
              <Progress value={progressPct} indicatorClassName="bg-accent" />
            </div>

            {/* Budget */}
            <div className="mb-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Budget</span>
                <span className="font-medium text-text-primary">
                  ${campaign.budgetUsed.toLocaleString()} / ${campaign.budget.toLocaleString()}
                </span>
              </div>
              <Progress value={budgetPct} indicatorClassName="bg-success" />
            </div>

            {/* Bottom row: stats + CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-text-tertiary">
                  <TrendingUp className="h-3 w-3" />
                  {campaign.clicks.toLocaleString()} clicks
                </span>
                <span className="flex items-center gap-1 text-text-tertiary">
                  <DollarSign className="h-3 w-3" />
                  ${campaign.revenueGenerated.toLocaleString()} rev
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-accent group-hover:translate-x-0.5 transition-transform">
                Details
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </Link>
    </MotionDiv>
  );
}
