'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface ChartPlaceholderProps {
  type: 'area' | 'line' | 'bar' | 'stacked-area' | 'pie';
  data?: { label?: string; value: number; color?: string }[];
  height?: number;
  className?: string;
  showAxis?: boolean;
}

function generateBars(count: number, maxValue: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * maxValue * 0.7 + maxValue * 0.3));
}

const barColors = [
  'bg-accent',
  'bg-success',
  'bg-warning',
  'bg-[#EF4444]',
  'bg-[#9146FF]',
  'bg-[#FF0050]',
  'bg-[#EC4899]',
  'bg-[#3B82F6]',
];

export function ChartPlaceholder({ type, data, height = 240, className, showAxis = true }: ChartPlaceholderProps) {
  const bars = React.useMemo(() => generateBars(24, height - 40), []);

  if (type === 'pie' && data) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;
    const segments = data.map((d) => {
      const percent = (d.value / total) * 100;
      const start = cumulativePercent;
      cumulativePercent += percent;
      return { ...d, percent, start };
    });

    const gradientStops = segments
      .map((s, i) => {
        const color = s.color ?? ['#6C5CE7', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#9146FF', '#53FC18'][i % 8];
        return `${color} ${s.start}% ${s.start + s.percent}%`;
      })
      .join(', ');

    return (
      <div className={cn('flex items-center gap-8', className)}>
        <div
          className="relative shrink-0 rounded-full"
          style={{
            width: height,
            height,
            background: `conic-gradient(${gradientStops})`,
          }}
        >
          <div
            className="absolute inset-[25%] rounded-full bg-background-card"
          />
        </div>
        <div className="space-y-2">
          {segments.map((s, i) => (
            <div key={s.label ?? i} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: s.color ?? barColors[i % barColors.length] }}
              />
              <span className="text-sm text-text-secondary">{s.label ?? `Segment ${i + 1}`}</span>
              <span className="ml-auto text-sm font-medium text-text-primary">{s.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'bar' && data) {
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex items-end gap-2" style={{ height }}>
          {data.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${(d.value / maxVal) * 100}%`,
                  backgroundColor: d.color ?? barColors[i % barColors.length],
                  minHeight: 4,
                }}
              />
            </div>
          ))}
        </div>
        {showAxis && (
          <div className="mt-2 flex justify-between">
            {data.map((d, i) => (
              <span key={i} className="text-2xs text-text-tertiary truncate max-w-[50px] text-center">
                {d.label ?? ''}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Area / line / stacked-area: render gradient bars as placeholder
  return (
    <div className={cn('relative', className)} style={{ height }}>
      {/* Y-axis labels */}
      {showAxis && (
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pr-2">
          {[4, 3, 2, 1, 0].map((i) => (
            <span key={i} className="text-2xs text-text-tertiary tabular-nums">
              {i === 0 ? '0' : `${i * 25}%`}
            </span>
          ))}
        </div>
      )}

      {/* Chart area */}
      <div className={cn('ml-8 h-full', !showAxis && 'ml-0')}>
        <div className="relative flex h-full items-end gap-px">
          {bars.map((value, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-300"
              style={{
                height: `${(value / (height - 40)) * 100}%`,
                background: `linear-gradient(180deg, ${type === 'stacked-area' ? '#6C5CE7' : '#6C5CE7'}99 0%, #6C5CE7${type === 'area' ? '30' : '10'} 100%)`,
              }}
            />
          ))}
        </div>
        {/* Gradient overlay for area effect */}
        {(type === 'area' || type === 'stacked-area') && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent-subtle/40 to-transparent" />
        )}
      </div>

      {/* X-axis labels */}
      {showAxis && (
        <div className="ml-8 mt-2 flex justify-between">
          {['7d', '14d', '21d', '30d'].map((label) => (
            <span key={label} className="text-2xs text-text-tertiary">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Sparkline mini-chart for stat cards */
export function Sparkline({ width = 80, height = 28, color = '#6C5CE7' }: { width?: number; height?: number; color?: string }) {
  const points = React.useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const segments = 12;
    let val = height * 0.5;
    for (let i = 0; i <= segments; i++) {
      val = Math.max(height * 0.1, Math.min(height * 0.9, val + (Math.random() - 0.5) * height * 0.5));
      pts.push({
        x: (i / segments) * width,
        y: height - val,
      });
    }
    return pts;
  }, [width, height]);

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fill area under line */}
      <path
        d={`${pathD} L ${width} ${height} L 0 ${height} Z`}
        fill={color}
        fillOpacity={0.12}
      />
    </svg>
  );
}
