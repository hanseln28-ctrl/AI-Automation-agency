'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Users,
  Hash,
  Activity,
  Shield,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { MockDiscordServer, MockDiscordMessage } from './types';

interface DiscordTabProps {
  servers: MockDiscordServer[];
  moderationQueue: MockDiscordMessage[];
  onApprove: (msg: MockDiscordMessage) => void;
  onDelete: (msg: MockDiscordMessage) => void;
}

export function DiscordTab({
  servers,
  moderationQueue,
  onApprove,
  onDelete,
}: DiscordTabProps) {
  const [selectedServer, setSelectedServer] = React.useState<string | null>(
    servers.length > 0 ? servers[0].id : null,
  );

  const activityColors: Record<string, string> = {
    high: 'text-success bg-success-subtle',
    medium: 'text-warning bg-warning-subtle',
    low: 'text-text-tertiary bg-background-elevated',
  };

  return (
    <div className="space-y-6">
      {/* Connected Servers */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Connected Servers</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {servers.map((server, i) => (
            <motion.div
              key={server.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Card
                className={cn(
                  'cursor-pointer p-4 transition-all hover:border-accent/30',
                  selectedServer === server.id && 'border-accent bg-accent-subtle/20',
                )}
                onClick={() => setSelectedServer(server.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/15">
                    <Server className="h-5 w-5 text-[#5865F2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {server.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-2xs text-text-tertiary">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {server.memberCount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {server.channelCount}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-medium',
                          activityColors[server.activityLevel],
                        )}
                      >
                        <Activity className="h-2.5 w-2.5" />
                        {server.activityLevel.charAt(0).toUpperCase() +
                          server.activityLevel.slice(1)}{' '}
                        Activity
                      </span>
                      {server.connected && (
                        <span className="rounded-full bg-success-subtle px-2 py-0.5 text-2xs text-success">
                          Connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Channel Activity Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-primary">
            Channel Activity Overview
          </h3>
          <Card className="p-4">
            <div className="space-y-3">
              {[
                { channel: '#general-chat', messages: 234, active: true },
                { channel: '#clips-feedback', messages: 89, active: true },
                { channel: '#memes', messages: 456, active: true },
                { channel: '#voice-chat', messages: 0, active: false },
                { channel: '#announcements', messages: 12, active: true },
              ].map((ch) => (
                <div
                  key={ch.channel}
                  className="flex items-center justify-between rounded-lg bg-background-surface p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">{ch.channel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">
                      {ch.messages} msgs today
                    </span>
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        ch.active ? 'bg-success' : 'bg-text-disabled',
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Message Moderation Queue */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Shield className="h-4 w-4 text-warning" />
            Message Moderation Queue
            {moderationQueue.length > 0 && (
              <Badge variant="warning" className="text-2xs">
                {moderationQueue.length}
              </Badge>
            )}
          </h3>
          <Card className="p-0">
            <ScrollArea className="h-[220px]">
              {moderationQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="mb-2 h-6 w-6 text-success" />
                  <p className="text-sm text-text-secondary">All clear!</p>
                  <p className="text-xs text-text-tertiary">No flagged messages</p>
                </div>
              ) : (
                <div className="space-y-0.5 p-2">
                  {moderationQueue.map((msg) => (
                    <div
                      key={msg.id}
                      className="rounded-lg bg-background-surface p-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarFallback className="text-2xs">
                            {msg.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-text-primary">
                              {msg.username}
                            </span>
                            <span className="text-2xs text-text-tertiary">
                              in {msg.channelName}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-text-secondary">{msg.content}</p>
                          {msg.flagReason && (
                            <p className="mt-0.5 text-2xs text-warning">
                              Flag: {msg.flagReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-success hover:text-success hover:bg-success-subtle"
                          onClick={() => onApprove(msg)}
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-danger hover:text-danger hover:bg-danger-subtle"
                          onClick={() => onDelete(msg)}
                        >
                          <XCircle className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
