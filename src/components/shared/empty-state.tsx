import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon component from lucide-react */
  icon?: LucideIcon;
  /** Heading text */
  title: string;
  /** Description text */
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button click handler */
  onAction?: () => void;
  /** Additional content below CTA */
  children?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon: Icon, title, description, actionLabel, onAction, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-16 text-center',
          className,
        )}
        {...props}
      >
        {Icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-background-elevated">
            <Icon className="h-8 w-8 text-text-tertiary" />
          </div>
        )}
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
        )}
        {actionLabel && onAction && (
          <Button variant="default" size="sm" className="mt-4" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  },
);
EmptyState.displayName = 'EmptyState';
