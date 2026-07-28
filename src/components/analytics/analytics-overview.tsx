'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { ChartPlaceholder } from './chart-placeholder';
import { MOCK_VIEWS_OVER_TIME, MOCK_TOP_CLIPS, MOCK_PLATFORM_PERFORMANCE } from './mock-data';

export function AnalyticsOverview() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Views Over Time */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder type="area" height={280} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Watch Time Trend + Performance by Platform */}
      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Watch Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder type="line" height={240} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder
              type="bar"
              height={240}
              data={MOCK_PLATFORM_PERFORMANCE.map((p) => ({
                label: p.platform,
                value: p.views,
                color: p.color,
              }))}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Performing Clips */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Clips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-text-tertiary">
                    <th className="pb-3 font-medium">Clip</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium text-right">Views</th>
                    <th className="pb-3 font-medium text-right">Engagement</th>
                    <th className="pb-3 font-medium text-right">Eng. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TOP_CLIPS.map((clip) => (
                    <tr key={clip.id} className="border-b border-border-subtle/50 hover:bg-background-elevated/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-16 shrink-0 rounded-md bg-gradient-to-br ${clip.gradient}`}
                          />
                          <span className="font-medium text-text-primary line-clamp-1">{clip.title}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-background-elevated px-2 py-0.5 text-xs capitalize text-text-secondary">
                          {clip.platform}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-text-primary">
                        {clip.views.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-text-secondary">
                        {clip.engagement.toLocaleString()}
                      </td>
                      <td className="py-3 text-right font-mono text-success">
                        {((clip.engagement / clip.views) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
