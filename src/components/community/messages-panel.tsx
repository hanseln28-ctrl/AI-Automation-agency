'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { Search, Send, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/shared/empty-state';
import { PLATFORM_CONFIG } from './types';
import type { MockConversation, CommunityPlatform } from './types';

interface MessagesPanelProps {
  conversations: MockConversation[];
  onSendReply: (conversationId: string, message: string) => void;
}

export function MessagesPanel({ conversations, onSendReply }: MessagesPanelProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null,
  );
  const [replyText, setReplyText] = React.useState('');
  const [aiSuggest, setAiSuggest] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const selected = conversations.find((c) => c.id === selectedId);

  const filteredConversations = search
    ? conversations.filter(
        (c) =>
          c.userName.toLowerCase().includes(search.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(search.toLowerCase()),
      )
    : conversations;

  const handleSend = () => {
    if (!replyText.trim() || !selectedId) return;
    onSendReply(selectedId, replyText.trim());
    setReplyText('');
    setAiSuggest(false);
  };

  const aiSuggestedReply = aiSuggest
    ? 'Thanks for reaching out! I appreciate your support and would love to connect further. 🎮✨'
    : '';

  return (
    <div className="flex h-[600px] overflow-hidden rounded-xl border border-border-subtle bg-background-card">
      {/* Left: Conversation list */}
      <div className="w-80 shrink-0 border-r border-border-subtle flex flex-col">
        <div className="p-3 border-b border-border-subtle">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <Input
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-text-tertiary">
              No conversations found
            </div>
          ) : (
            <div className="space-y-0.5 p-1">
              {filteredConversations.map((conv) => {
                const platformCfg = PLATFORM_CONFIG[conv.platform as CommunityPlatform];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={cn(
                      'w-full rounded-lg p-3 text-left transition-colors',
                      selectedId === conv.id
                        ? 'bg-accent-subtle'
                        : 'hover:bg-background-surface',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-background-elevated text-xs text-text-secondary">
                            {conv.userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread && (
                          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-background-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'text-sm truncate',
                              conv.unread ? 'font-semibold text-text-primary' : 'text-text-secondary',
                            )}
                          >
                            {conv.userName}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn('text-2xs shrink-0', platformCfg.badgeClass)}
                          >
                            {platformCfg.label}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-text-tertiary truncate">
                          {conv.lastMessage}
                        </p>
                        <span className="mt-0.5 text-2xs text-text-tertiary">
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right: Conversation view */}
      <div className="flex flex-1 flex-col">
        {selected ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border-subtle px-4 py-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-background-elevated text-xs text-text-secondary">
                  {selected.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{selected.userName}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-2xs',
                    PLATFORM_CONFIG[selected.platform as CommunityPlatform].badgeClass,
                  )}
                >
                  {PLATFORM_CONFIG[selected.platform as CommunityPlatform].label}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex gap-3', msg.isOwn && 'flex-row-reverse')}
                  >
                    {!msg.isOwn && (
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-background-elevated text-2xs text-text-secondary">
                          {msg.senderName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-xl px-4 py-2.5',
                        msg.isOwn
                          ? 'bg-accent text-white rounded-tr-sm'
                          : 'bg-background-surface text-text-primary rounded-tl-sm',
                      )}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span
                        className={cn(
                          'mt-1 block text-2xs',
                          msg.isOwn ? 'text-white/60' : 'text-text-tertiary',
                        )}
                      >
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Reply input */}
            <div className="border-t border-border-subtle p-4 space-y-3">
              {aiSuggest && aiSuggestedReply && (
                <MotionDiv
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg border border-accent-muted bg-accent-subtle/30 px-3 py-2"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <span className="text-2xs text-accent font-medium">AI Suggestion</span>
                  </div>
                  <p className="text-xs text-text-secondary">{aiSuggestedReply}</p>
                </MotionDiv>
              )}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={aiSuggest ? 'AI will suggest a reply...' : 'Type your reply...'}
                    className="w-full resize-none rounded-lg border border-border bg-background-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-9 w-9',
                      aiSuggest && 'text-accent bg-accent-subtle',
                    )}
                    onClick={() => setAiSuggest(!aiSuggest)}
                    title="Toggle AI suggestion"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="h-9 w-9"
                    onClick={handleSend}
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No conversation selected"
            description="Select a conversation from the left panel to view messages"
          />
        )}
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
