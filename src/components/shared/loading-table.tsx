import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingTableProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of rows to render */
  rows?: number;
  /** Number of columns per row */
  columns?: number;
}

export const LoadingTable = React.forwardRef<HTMLDivElement, LoadingTableProps>(
  ({ rows = 5, columns = 4, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-xl border border-border-subtle bg-background-card overflow-hidden', className)}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border-subtle px-6 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`h-${i}`} className="h-4 rounded" style={{ width: `${100 / columns}%` }} />
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-4 px-6 py-4">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Skeleton
                  key={`${rowIdx}-${colIdx}`}
                  className="h-4 rounded"
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
LoadingTable.displayName = 'LoadingTable';
