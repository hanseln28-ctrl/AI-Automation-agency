import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title */
  title: string;
  /** Page description / subtitle */
  description?: string;
  /** Optional action buttons/elements rendered on the right */
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between',
          className,
        )}
        {...props}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
          {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 mt-2 sm:mt-0">{actions}</div>}
      </div>
    );
  },
);
PageHeader.displayName = 'PageHeader';
