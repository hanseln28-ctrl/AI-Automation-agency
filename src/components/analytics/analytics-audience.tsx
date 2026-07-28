'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { staggerContainer, staggerItem } from '@/lib/utils/animations';
import { ChartPlaceholder } from './chart-placeholder';
import { MOCK_FOLLOWER_GROWTH, MOCK_DEMOGRAPHICS, MOCK_GEOGRAPHY } from './mock-data';

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸',
  GB: '🇬🇧',
  DE: '🇩🇪',
  CA: '🇨🇦',
  BR: '🇧🇷',
  FR: '🇫🇷',
  AU: '🇦🇺',
  JP: '🇯🇵',
  OTHER: '🌍',
};

const GENDER_COLORS = {
  male: '#3B82F6',
  female: '#EC4899',
  other: '#6C5CE7',
};

export function AnalyticsAudience() {
  return (
    <MotionDiv
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Follower Growth */}
      <MotionDiv variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPlaceholder type="area" height={260} />
          </CardContent>
        </Card>
      </MotionDiv>

      {/* Demographics + Geography */}
      <MotionDiv variants={staggerItem} className="grid gap-6 lg:grid-cols-2">
        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {MOCK_DEMOGRAPHICS.map((demo) => {
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
                        style={{
                          width: `${demo.male}%`,
                          backgroundColor: GENDER_COLORS.male,
                        }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${demo.female}%`,
                          backgroundColor: GENDER_COLORS.female,
                        }}
                      />
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${demo.other}%`,
                          backgroundColor: GENDER_COLORS.other,
                        }}
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

        {/* Geography */}
        <Card>
          <CardHeader>
            <CardTitle>Top Geographies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_GEOGRAPHY.map((geo) => (
                <div
                  key={geo.code}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-background-elevated/30"
                >
                  <span className="text-xl">{COUNTRY_FLAGS[geo.code] ?? '🌍'}</span>
                  <span className="flex-1 text-sm text-text-primary">{geo.country}</span>
                  <div className="flex w-32 items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-surface">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${Math.min(geo.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-mono text-text-secondary">
                      {geo.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </MotionDiv>
    </MotionDiv>
  );
}
