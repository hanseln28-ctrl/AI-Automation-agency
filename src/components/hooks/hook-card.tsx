'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/icon';
import { toast } from 'sonner';
import type { HookVariation } from './types';
import { HOOK_TYPE_CONFIG } from './types';

interface HookCardProps {
  hook: HookVariation;
  index: number;
}

export function HookCard({ hook, index }: HookCardProps) {
  const [copied, setCopied] = React.useState(false);
  const typeConfig = HOOK_TYPE_CONFIG[hook.type];

  function handleCopy() {
    navigator.clipboard.writeText(hook.text).then(() => {
      setCopied(true);
      toast.success('Hook copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group flex items-start gap-3 rounded-xl border border-border-subtle bg-background-card p-3 hover:border-border hover:shadow-card transition-all"
    >
      {/* Retention indicator */}
      <div className="relative shrink-0 mt-1">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-background-surface" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none"
            stroke="currentColor"
            className="text-accent"
            strokeWidth="3"
            strokeDasharray={`${(hook.predictedRetention / 100) * 94.2} 94.2`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xs font-bold text-text-primary">
          {hook.predictedRetention}%
        </span>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Hook type badge */}
        <Badge
          className={cn('text-2xs border', typeConfig.bgClass)}
        >
          {typeConfig.label}
        </Badge>

        {/* Hook text */}
        <p className="text-sm text-text-primary leading-relaxed">{hook.text}</p>

        {/* Platform */}
        <p className="text-2xs text-text-tertiary">
          Optimized for {hook.platform.charAt(0).toUpperCase() + hook.platform.slice(1)}
        </p>
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
        <Icon name={copied ? 'check' : 'copy'} size="sm" color={copied ? 'text-success' : 'text-text-tertiary'} />
      </Button>
    </motion.div>
  );
}
