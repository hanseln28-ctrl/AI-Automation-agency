import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of skeleton lines to show in the card body */
  lines?: number;
  /** Show header skeleton area? */
  showHeader?: boolean;
}

export const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ lines = 3, showHeader = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('rounded-xl border border-border-subtle bg-background-card p-6 shadow-card', className)}
        {...props}
      >
        {showHeader && (
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        )}
        <div className="space-y-2.5">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-3 rounded"
              style={{ width: `${Math.max(40, 100 - i * 15)}%` }}
            />
          ))}
        </div>
      </div>
    );
  },
);
LoadingCard.displayName = 'LoadingCard';
