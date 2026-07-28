'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { ChartPlaceholder } from './chart-placeholder';
import { HeatmapPlaceholder } from './heatmap-placeholder';
import { MOCK_TOP_CLIPS, MOCK_CONTENT_TYPES, MOCK_BEST_POSTING_TIMES } from './mock-data';

type SortField = 'views' | 'engagement' | 'date';
type SortDir = 'asc' | 'desc';

export function AnalyticsContent() {
  const [sortField, setSortField] = React.useState<SortField>('views');
  const [sortDir, setSortDir] = React.useState<SortDir>('desc');

  const sortedClips = React.useMemo(() => {
    return [...MOCK_TOP_CLIPS].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'views') cmp = a.views - b.views;
      else if (sortField === 'engagement') cmp = a.engagement - b.engagement;
      else cmp = 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Clip Performance Grid */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Clip Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-text-tertiary">
                    <th className="pb-3 font-medium">Clip</th>
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium text-right cursor-pointer select-none" onClick={() => toggleSort('views')}>
                      <span className="inline-flex items-center gap-1">
                        Views
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="pb-3 font-medium text-right cursor-pointer select-none" onClick={() => toggleSort('engagement')}>
                      <span className="inline-flex items-center gap-1">
                        Engagement
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="pb-3 font-medium text-right">Eng. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedClips.map((clip) => (
                    <tr key={clip.id} className="border-b border-border-subtle/50 hover:bg-background-elevated/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-16 shrink-0 rounded-md bg-gradient-to-br ${clip.gradient}`}
                          />
                          <span className="font-medium text-text-primary line-clamp-1 max-w-[250px]">{clip.title}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="ghost" className="capitalize">{clip.platform}</Badge>
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

      {/* Best Posting Times Heatmap + Content Type Breakdown */}
      <motion.div variants={staggerItem} className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Best Posting Times</CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapPlaceholder data={MOCK_BEST_POSTING_TIMES} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder
              type="pie"
              height={200}
              data={MOCK_CONTENT_TYPES.map((ct) => ({
                label: ct.type,
                value: ct.percentage,
                color: ct.color,
              }))}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
