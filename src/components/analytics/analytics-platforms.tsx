'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Eye, Heart, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { ChartPlaceholder } from './chart-placeholder';
import { MOCK_PLATFORM_DETAILS, MOCK_PLATFORM_PERFORMANCE } from './mock-data';
import type { PlatformDetail, PlatformPerformance } from './types';

const PLATFORM_ICONS: Record<string, string> = {
  tiktok: '🎵',
  youtube: '▶️',
  instagram: '📷',
  twitch: '🎮',
  kick: '⚡',
};

function PlatformCard({ detail }: { detail: PlatformDetail }) {
  return (
    <Card className="overflow-hidden">
      <div
        className="h-1"
        style={{ backgroundColor: detail.color }}
      />
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-xl">{PLATFORM_ICONS[detail.platform]}</span>
          <div>
            <CardTitle className="text-base">{detail.label}</CardTitle>
            <CardDescription>Platform analytics</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 rounded-lg bg-background-surface p-3">
            <Users className="h-4 w-4 text-text-tertiary" />
            <p className="text-lg font-bold text-text-primary">
              {detail.followers >= 1000
                ? `${(detail.followers / 1000).toFixed(0)}K`
                : detail.followers}
            </p>
            <p className="text-2xs text-text-tertiary">Followers</p>
          </div>
          <div className="space-y-1 rounded-lg bg-background-surface p-3">
            <Eye className="h-4 w-4 text-text-tertiary" />
            <p className="text-lg font-bold text-text-primary">
              {detail.views >= 1000
                ? `${(detail.views / 1000).toFixed(0)}K`
                : detail.views}
            </p>
            <p className="text-2xs text-text-tertiary">Views</p>
          </div>
          <div className="space-y-1 rounded-lg bg-background-surface p-3">
            <Heart className="h-4 w-4 text-text-tertiary" />
            <p className="text-lg font-bold text-text-primary">
              {detail.engagement >= 1000
                ? `${(detail.engagement / 1000).toFixed(0)}K`
                : detail.engagement}
            </p>
            <p className="text-2xs text-text-tertiary">Engagement</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformComparisonTable({ platforms }: { platforms: PlatformPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-left text-text-tertiary">
                <th className="pb-3 font-medium">Platform</th>
                <th className="pb-3 font-medium text-right">Followers</th>
                <th className="pb-3 font-medium text-right">Views</th>
                <th className="pb-3 font-medium text-right">Engagement</th>
                <th className="pb-3 font-medium text-right">Eng. Rate</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr
                  key={p.platform}
                  className="border-b border-border-subtle/50 hover:bg-background-elevated/30 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="font-medium capitalize text-text-primary">{p.platform}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-mono text-text-primary">
                    {p.followers.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-text-primary">
                    {p.views.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-text-secondary">
                    {p.engagement.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono text-success">
                    {((p.engagement / p.views) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPlatforms() {
  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Per-platform cards */}
      <MotionDiv
        variants={staggerItem}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        {MOCK_PLATFORM_DETAILS.map((detail) => (
          <PlatformCard key={detail.platform} detail={detail} />
        ))}
      </MotionDiv>

      {/* Platform comparison */}
      <MotionDiv variants={staggerItem}>
        <PlatformComparisonTable platforms={MOCK_PLATFORM_PERFORMANCE} />
      </MotionDiv>
    </MotionDiv>
  );
}
