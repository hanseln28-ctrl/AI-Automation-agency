'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Flag, ToggleRight, ToggleLeft, Globe, User, Percent } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/shared/empty-state';
import type { AdminFeatureFlag } from './types';

interface FeatureFlagsListProps {
  flags: AdminFeatureFlag[];
  onToggle: (flagId: string) => void;
  onRolloutChange: (flagId: string, percentage: number) => void;
}

const SCOPE_ICONS: Record<string, React.ReactNode> = {
  global: <Globe className="h-3 w-3" />,
  per_user: <User className="h-3 w-3" />,
  percentage: <Percent className="h-3 w-3" />,
};

export function FeatureFlagsList({
  flags,
  onToggle,
  onRolloutChange,
}: FeatureFlagsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">Feature Flags</h3>
          </div>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Toggle features on/off and control rollout percentages
          </p>
        </div>
        <Badge variant="accent" className="text-2xs">
          {flags.filter((f) => f.enabled).length}/{flags.length} Enabled
        </Badge>
      </div>

      {flags.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No feature flags configured"
          description="Feature flags will appear here once configured"
        />
      ) : (
        <div className="space-y-3">
          {flags.map((flag, i) => (
            <motion.div
              key={flag.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-text-primary">{flag.name}</h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-2xs gap-1',
                          flag.enabled
                            ? 'bg-success-subtle/30 text-success border-success/20'
                            : 'bg-background-elevated text-text-disabled border-border',
                        )}
                      >
                        {flag.enabled ? (
                          <ToggleRight className="h-3 w-3" />
                        ) : (
                          <ToggleLeft className="h-3 w-3" />
                        )}
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Badge
                        variant="ghost"
                        className="text-2xs gap-1 bg-background-elevated text-text-secondary"
                      >
                        {SCOPE_ICONS[flag.scope]}
                        {flag.scope === 'global'
                          ? 'Global'
                          : flag.scope === 'per_user'
                            ? 'Per User'
                            : 'Percentage'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary">{flag.description}</p>

                    {/* Key identifier */}
                    <p className="mt-1 font-mono text-2xs text-text-tertiary">
                      key: {flag.key}
                    </p>

                    {/* Rollout slider for percentage-based flags */}
                    {flag.scope === 'percentage' && flag.enabled && (
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-2xs text-text-tertiary">Rollout</span>
                          <span className="text-xs font-semibold text-text-primary tabular-nums">
                            {flag.rolloutPercentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={flag.rolloutPercentage}
                            onChange={(e) =>
                              onRolloutChange(flag.id, parseInt(e.target.value))
                            }
                            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-background-elevated accent-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
                          />
                        </div>
                      </div>
                    )}

                    {/* Last modified */}
                    <p className="mt-2 text-2xs text-text-tertiary">
                      Last modified:{' '}
                      {new Date(flag.lastModified).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Toggle */}
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => onToggle(flag.id)}
                    className="mt-1 shrink-0"
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
