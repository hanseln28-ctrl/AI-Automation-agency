import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-accent text-accent-foreground hover:bg-accent-hover',
        accent:
          'border-transparent bg-accent-subtle text-accent hover:bg-accent-muted',
        success:
          'border-transparent bg-success-subtle text-success',
        warning:
          'border-transparent bg-warning-subtle text-warning',
        danger:
          'border-transparent bg-danger-subtle text-danger',
        outline:
          'border-border text-text-secondary hover:bg-background-card hover:text-text-primary',
        ghost:
          'border-transparent bg-background-elevated text-text-secondary hover:text-text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
