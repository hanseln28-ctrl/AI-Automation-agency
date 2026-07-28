'use client';

import * as React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportGeneratorProps {
  campaignName: string;
  brandName: string;
}

export function ReportGenerator({ campaignName, brandName }: ReportGeneratorProps) {
  return (
    <div className="space-y-6">
      {/* Report Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Report</CardTitle>
          <CardDescription>
            Generate a professional PDF report for {brandName} — {campaignName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview placeholder */}
          <div className="rounded-lg border border-border-subtle bg-background-surface p-8">
            <div className="mx-auto max-w-md space-y-6">
              {/* Report header */}
              <div className="border-b border-border-subtle pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-hover text-xl font-bold text-white">
                    {brandName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{brandName}</h3>
                    <p className="text-sm text-text-secondary">{campaignName}</p>
                  </div>
                </div>
              </div>

              {/* Report sections preview */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-text-primary">Executive Summary</h4>
                <div className="space-y-1">
                  <div className="h-2 w-full rounded bg-background-elevated" />
                  <div className="h-2 w-4/5 rounded bg-background-elevated" />
                  <div className="h-2 w-3/5 rounded bg-background-elevated" />
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-text-primary">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Views', 'CTR', 'Conversions', 'Revenue'].map((metric) => (
                    <div key={metric} className="rounded-md bg-background-card p-2">
                      <p className="text-2xs text-text-tertiary">{metric}</p>
                      <div className="mt-1 h-3 w-16 rounded bg-background-elevated" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold text-text-primary">Deliverables</h4>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="mb-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent" />
                    <div className="h-2 flex-1 rounded bg-background-elevated" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report options */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2">
              <input type="checkbox" id="include-summary" defaultChecked className="accent-accent" />
              <label htmlFor="include-summary" className="text-sm text-text-secondary">Executive Summary</label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2">
              <input type="checkbox" id="include-metrics" defaultChecked className="accent-accent" />
              <label htmlFor="include-metrics" className="text-sm text-text-secondary">Key Metrics</label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2">
              <input type="checkbox" id="include-deliverables" defaultChecked className="accent-accent" />
              <label htmlFor="include-deliverables" className="text-sm text-text-secondary">Deliverables</label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border-subtle px-4 py-2">
              <input type="checkbox" id="include-audience" defaultChecked className="accent-accent" />
              <label htmlFor="include-audience" className="text-sm text-text-secondary">Audience</label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate PDF Report
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="ghost">
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
