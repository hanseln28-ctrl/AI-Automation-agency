'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Plus, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { CampaignCard } from '@/components/sponsorships/campaign-card';
import { MOCK_CAMPAIGNS } from '@/components/sponsorships/mock-data';

export default function SponsorshipsPage() {
  const [showPast, setShowPast] = React.useState(false);

  const activeCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => c.status === 'active' || c.status === 'draft',
  );
  const pastCampaigns = MOCK_CAMPAIGNS.filter(
    (c) => c.status === 'completed' || c.status === 'cancelled',
  );

  // Upcoming deliverables (from active campaigns)
  const upcomingDeliverables = React.useMemo(() => {
    return activeCampaigns
      .flatMap((c) =>
        c.deliverables
          .filter((d) => d.status === 'pending' || d.status === 'in_progress')
          .map((d) => ({ ...d, campaignName: c.campaignName, brandName: c.brandName, campaignId: c.id })),
      )
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [activeCampaigns]);

  return (
    <MotionDiv
      className="space-y-6 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Sponsorships"
        description="Manage brand campaigns and track deliverables."
        actions={
          <Link href="/sponsorships/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        }
      />

      {/* Active Campaigns */}
      <MotionDiv variants={staggerItem}>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Active Campaigns</h2>
        {activeCampaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-text-tertiary">
              No active campaigns. Create your first one!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {activeCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </MotionDiv>

      {/* Upcoming Deliverables */}
      {upcomingDeliverables.length > 0 && (
        <MotionDiv variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingDeliverables.slice(0, 5).map((deliverable) => (
                  <Link
                    key={deliverable.id}
                    href={`/sponsorships/${deliverable.campaignId}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background-elevated/30"
                  >
                    <Clock className="h-4 w-4 text-warning shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {deliverable.title}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {deliverable.brandName} · {deliverable.campaignName}
                      </p>
                    </div>
                    <Badge variant="warning" className="shrink-0">
                      Due {new Date(deliverable.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </MotionDiv>
      )}

      {/* Past Campaigns */}
      <MotionDiv variants={staggerItem}>
        <button
          onClick={() => setShowPast(!showPast)}
          className="mb-4 flex items-center gap-2 text-lg font-semibold text-text-primary hover:text-accent transition-colors"
        >
          Past Campaigns
          {showPast ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {showPast && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pastCampaigns.length === 0 ? (
              <Card className="sm:col-span-2 xl:col-span-3">
                <CardContent className="py-8 text-center text-sm text-text-tertiary">
                  No past campaigns.
                </CardContent>
              </Card>
            ) : (
              pastCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))
            )}
          </div>
        )}
      </MotionDiv>
    </MotionDiv>
  );
}
