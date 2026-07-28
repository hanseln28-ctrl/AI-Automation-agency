'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/shared/empty-state';
import { PLATFORM_CONFIG } from './types';
import type { MockAutoReplyRule, CommunityPlatform } from './types';

interface AutoRepliesProps {
  rules: MockAutoReplyRule[];
  onToggle: (ruleId: string) => void;
  onEdit: (rule: MockAutoReplyRule) => void;
  onDelete: (ruleId: string) => void;
  onCreate: () => void;
}

export function AutoReplies({
  rules,
  onToggle,
  onEdit,
  onDelete,
  onCreate,
}: AutoRepliesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <h3 className="text-sm font-semibold text-text-primary">Auto-Replies</h3>
          </div>
          <p className="mt-0.5 text-xs text-text-tertiary">
            Configure automatic responses to common questions and comments
          </p>
        </div>
        <Button size="sm" onClick={onCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Rule
        </Button>
      </div>

      {/* FAQ AI Configuration */}
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">AI-Powered FAQ Responses</p>
              <p className="mt-0.5 text-xs text-text-secondary">
                Automatically detect and answer frequently asked questions using AI. Learns from
                your response patterns.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="accent" className="text-2xs">
                  Beta
                </Badge>
                <span className="text-2xs text-text-tertiary">
                  328 questions answered this week
                </span>
              </div>
            </div>
          </div>
          <Switch defaultChecked className="mt-1" />
        </div>
      </Card>

      {/* Rule List */}
      {rules.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No auto-reply rules set"
          description="Create your first rule to start automating responses"
          actionLabel="Create Rule"
          onAction={onCreate}
        />
      ) : (
        <div className="space-y-3">
          {rules.map((rule, i) => {
            const platformCfg =
              rule.platform !== 'all'
                ? PLATFORM_CONFIG[rule.platform as CommunityPlatform]
                : null;

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div
                      className={cn(
                        'mt-1 h-2.5 w-2.5 rounded-full shrink-0',
                        rule.enabled ? 'bg-success' : 'bg-text-disabled',
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-text-primary">{rule.name}</h4>
                        <Badge
                          variant="outline"
                          className="text-2xs bg-background-elevated text-text-secondary border-border"
                        >
                          {rule.triggerType === 'keyword'
                            ? '🔑 Keyword'
                            : rule.triggerType === 'faq'
                              ? '❓ FAQ'
                              : '🎭 Sentiment'}
                        </Badge>
                        {rule.platform !== 'all' && platformCfg && (
                          <Badge
                            variant="outline"
                            className={cn('text-2xs', platformCfg.badgeClass)}
                          >
                            {platformCfg.label}
                          </Badge>
                        )}
                        {rule.platform === 'all' && (
                          <Badge
                            variant="outline"
                            className="text-2xs bg-background-elevated text-text-secondary border-border"
                          >
                            All Platforms
                          </Badge>
                        )}
                      </div>

                      {/* Trigger keywords */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rule.triggerKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-full bg-background-surface px-2 py-0.5 text-2xs text-text-secondary border border-border-subtle"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* Response preview */}
                      <div className="mt-2 rounded-lg bg-background-surface p-3 border border-border-subtle">
                        <p className="text-xs text-text-secondary">{rule.response}</p>
                      </div>

                      {/* Footer */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-2xs text-text-tertiary">
                          <MessageSquare className="mr-1 inline h-3 w-3" />
                          Used {rule.usageCount.toLocaleString()} times
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onToggle(rule.id)}
                            className="text-text-secondary hover:text-text-primary transition-colors"
                            title={rule.enabled ? 'Disable' : 'Enable'}
                          >
                            {rule.enabled ? (
                              <ToggleRight className="h-5 w-5 text-success" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-text-tertiary" />
                            )}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => onEdit(rule)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-text-tertiary hover:text-danger"
                            onClick={() => onDelete(rule.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Canned Responses */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-text-primary">Canned Response Templates</h4>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            {
              title: 'Welcome Message',
              preview: 'Hey! Welcome to the community. Feel free to ask any questions! 💜',
            },
            {
              title: 'Thank You',
              preview:
                'Thanks so much for your support! It means the world to me! 🙏✨',
            },
            {
              title: 'Stream Schedule',
              preview:
                'I stream Tue/Thu/Sat at 7PM EST. See you there! 🎮',
            },
            {
              title: 'Business Inquiry',
              preview:
                "Thanks for your interest! Please email partnerships@ironcreator.com and we'll get back to you. 📧",
            },
          ].map((tpl) => (
            <Card
              key={tpl.title}
              className="flex items-center justify-between p-3 cursor-pointer hover:border-accent/30 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary">{tpl.title}</p>
                <p className="text-2xs text-text-tertiary truncate">{tpl.preview}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
