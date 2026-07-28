'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { Check, Copy } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Text to copy to clipboard */
  value: string;
  /** Label shown in tooltip after copying */
  copiedLabel?: string;
  /** Label shown in tooltip before copying */
  copyLabel?: string;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      copiedLabel = 'Copied!',
      copyLabel = 'Copy to clipboard',
      className,
      size = 'icon',
      variant = 'ghost',
      ...props
    },
    ref,
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    const handleCopy = React.useCallback(async () => {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available
      }
    }, [value]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <TooltipProvider>
        <Tooltip open={copied ? true : undefined}>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant={variant}
              size={size}
              className={cn('relative', className)}
              onClick={handleCopy}
              aria-label={copied ? copiedLabel : copyLabel}
              {...props}
            >
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-200',
                  copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
                )}
              >
                <Copy className="h-4 w-4" />
              </span>
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-center transition-all duration-200',
                  copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                )}
              >
                <Check className="h-4 w-4 text-success" />
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? copiedLabel : copyLabel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);
CopyButton.displayName = 'CopyButton';
