'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerContainer } from '@/lib/utils/animations';
import { CampaignHeader } from '@/components/sponsorships/campaign-header';
import { DeliverablesList } from '@/components/sponsorships/deliverables-list';
import { CampaignPerformanceView } from '@/components/sponsorships/campaign-performance';
import { ReportGenerator } from '@/components/sponsorships/report-generator';
import { ChartPlaceholder } from '@/components/analytics/chart-placeholder';
import { getCampaignById, getCampaignPerformance } from '@/components/sponsorships/mock-data';
import { MOCK_CAMPAIGN_AUDIENCE } from '@/components/sponsorships/mock-data';
import type { Campaign } from '@/components/sponsorships/types';

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = getCampaignById(params.id);

  if (!campaign) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="rounded-xl border border-border-subtle bg-background-card p-12 text-center">
          <p className="text-lg font-medium text-text-primary">Campaign not found</p>
          <p className="mt-1 text-sm text-text-secondary">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <MotionDiv
      className="space-y-6 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <CampaignHeader campaign={campaign} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="deliverables">
          <Card>
            <CardHeader>
              <CardTitle>Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliverablesList deliverables={campaign.deliverables} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <CampaignPerformanceView performances={getCampaignPerformance(campaign.id)} />
        </TabsContent>

        <TabsContent value="audience">
          <AudienceTab />
        </TabsContent>

        <TabsContent value="report">
          <ReportGenerator campaignName={campaign.campaignName} brandName={campaign.brandName} />
        </TabsContent>
      </Tabs>
    </MotionDiv>
  );
}

function OverviewTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-6">
      {/* Deliverable progress */}
      <Card>
        <CardHeader>
          <CardTitle>Deliverable Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <DeliverablesList deliverables={campaign.deliverables.slice(0, 5)} />
          {campaign.deliverables.length > 5 && (
            <p className="mt-3 text-center text-sm text-text-tertiary">
              +{campaign.deliverables.length - 5} more deliverables — see Deliverables tab
            </p>
          )}
        </CardContent>
      </Card>

      {/* Performance overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartPlaceholder type="area" height={240} />
        </CardContent>
      </Card>
    </div>
  );
}

const GENDER_COLORS = { male: '#3B82F6', female: '#EC4899', other: '#6C5CE7' };

function AudienceTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Demographics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {MOCK_CAMPAIGN_AUDIENCE.map((demo) => {
            const total = demo.male + demo.female + demo.other;
            return (
              <div key={demo.ageGroup} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text-primary">{demo.ageGroup}</span>
                  <span className="text-text-tertiary">{total}%</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-background-surface">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${demo.male}%`, backgroundColor: GENDER_COLORS.male }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${demo.female}%`, backgroundColor: GENDER_COLORS.female }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${demo.other}%`, backgroundColor: GENDER_COLORS.other }}
                  />
                </div>
                <div className="flex gap-4 text-2xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.male }} />
                    M {demo.male}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.female }} />
                    F {demo.female}%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: GENDER_COLORS.other }} />
                    O {demo.other}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
