'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { MessageSquare, MessageCircle, Server, Shield, Settings, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';
import {
  staggerContainer,
  staggerItem,
  fadeIn,
} from '@/lib/utils/animations';
import { CommunityStats } from '@/components/community/community-stats';
import { CommentsList } from '@/components/community/comments-list';
import { MessagesPanel } from '@/components/community/messages-panel';
import { DiscordTab } from '@/components/community/discord-tab';
import { ModerationQueue } from '@/components/community/moderation-queue';
import { ModerationLog } from '@/components/community/moderation-log';
import { AutoReplies } from '@/components/community/auto-replies';
import {
  MOCK_COMMENTS,
  MOCK_CONVERSATIONS,
  MOCK_FLAGGED_CONTENT,
  MOCK_MODERATION_LOG,
  MOCK_AUTO_REPLY_RULES,
  MOCK_DISCORD_SERVERS,
  MOCK_DISCORD_MESSAGES,
} from '@/components/community/mock-data';
import type {
  MockComment,
  MockFlaggedContent,
  MockAutoReplyRule,
  MockDiscordMessage,
} from '@/components/community/types';

export default function CommunityPage() {
  const [comments, setComments] = React.useState(MOCK_COMMENTS);
  const [conversations, setConversations] = React.useState(MOCK_CONVERSATIONS);
  const [flaggedContent, setFlaggedContent] = React.useState(MOCK_FLAGGED_CONTENT);
  const [moderationLog, setModerationLog] = React.useState(MOCK_MODERATION_LOG);
  const [autoReplyRules, setAutoReplyRules] = React.useState(MOCK_AUTO_REPLY_RULES);
  const [discordMessages, setDiscordMessages] = React.useState(MOCK_DISCORD_MESSAGES);
  const [showAutoReplies, setShowAutoReplies] = React.useState(false);

  const unreadCount = conversations.reduce((sum, c) => sum + (c.unread ? 1 : 0), 0);
  const pendingModeration = flaggedContent.filter((f) => f.status === 'pending').length;

  // ── Comment Handlers ──
  const handleReply = (comment: MockComment) => {
    // In production: open reply dialog / inline reply
  };

  const handleLike = (comment: MockComment) => {
    setComments((prev) =>
      prev.map((c) => (c.id === comment.id ? { ...c, likes: c.likes + 1 } : c)),
    );
  };

  const handleFlag = (comment: MockComment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id ? { ...c, status: 'flagged' as const } : c,
      ),
    );
  };

  const handleArchive = (comment: MockComment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === comment.id ? { ...c, status: 'archived' as const } : c,
      ),
    );
  };

  const handleBulkArchive = (ids: string[]) => {
    setComments((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, status: 'archived' as const } : c)),
    );
  };

  // ── Message Handlers ──
  const handleSendReply = (conversationId: string, message: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          unread: false,
          lastMessage: message,
          lastMessageTime: new Date().toISOString(),
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              conversationId,
              senderName: 'You',
              senderAvatar: '',
              platform: conv.platform,
              content: message,
              timestamp: new Date().toISOString(),
              isOwn: true,
              read: true,
            },
          ],
        };
      }),
    );
  };

  // ── Discord Handlers ──
  const handleDiscordApprove = (msg: MockDiscordMessage) => {
    setDiscordMessages((prev) => prev.filter((m) => m.id !== msg.id));
  };

  const handleDiscordDelete = (msg: MockDiscordMessage) => {
    setDiscordMessages((prev) => prev.filter((m) => m.id !== msg.id));
    setModerationLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'deleted',
        target: msg.content.slice(0, 50),
        targetType: 'message',
        reason: msg.flagReason || 'Flagged content',
        moderator: 'You',
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // ── Moderation Handlers ──
  const handleModApprove = (item: MockFlaggedContent) => {
    setFlaggedContent((prev) => prev.filter((f) => f.id !== item.id));
    setModerationLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'approved',
        target: item.content.slice(0, 50),
        targetType: item.type,
        reason: 'Reviewed and approved',
        moderator: 'You',
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleModDelete = (item: MockFlaggedContent) => {
    setFlaggedContent((prev) => prev.filter((f) => f.id !== item.id));
    setModerationLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'deleted',
        target: item.content.slice(0, 50),
        targetType: item.type,
        reason: item.reason,
        moderator: 'You',
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleModBan = (item: MockFlaggedContent) => {
    setFlaggedContent((prev) => prev.filter((f) => f.id !== item.id));
    setModerationLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'banned',
        target: item.username,
        targetType: 'user',
        reason: item.reason,
        moderator: 'You',
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleModIgnore = (item: MockFlaggedContent) => {
    setFlaggedContent((prev) => prev.filter((f) => f.id !== item.id));
    setModerationLog((prev) => [
      {
        id: `log-${Date.now()}`,
        action: 'ignored',
        target: item.content.slice(0, 50),
        targetType: item.type,
        reason: 'Within acceptable range',
        moderator: 'You',
        date: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // ── Auto-Reply Handlers ──
  const handleToggleRule = (ruleId: string) => {
    setAutoReplyRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const handleEditRule = (rule: MockAutoReplyRule) => {
    // In production: open edit modal
  };

  const handleDeleteRule = (ruleId: string) => {
    setAutoReplyRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleCreateRule = () => {
    // In production: open create modal
  };

  return (
    <MotionDiv
      className="animate-fade-in space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <MotionDiv variants={staggerItem}>
        <PageHeader
          title="Community"
          description="Unified inbox for messages across all your platforms"
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAutoReplies(!showAutoReplies)}
                className={cn(showAutoReplies && 'border-accent text-accent')}
              >
                <Settings className="mr-1.5 h-4 w-4" />
                Auto-Replies
              </Button>
              <Button size="sm">
                <Sparkles className="mr-1.5 h-4 w-4" />
                AI Assistant
              </Button>
            </div>
          }
        />
      </MotionDiv>

      {/* Quick Stats */}
      <MotionDiv variants={staggerItem}>
        <CommunityStats
          stats={{
            unreadCount,
            pendingModeration,
          }}
        />
      </MotionDiv>

      {/* Tabs */}
      <MotionDiv variants={staggerItem}>
        <Tabs defaultValue="comments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="comments" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Comments
              <Badge variant="accent" className="ml-1 text-2xs px-1.5">
                {comments.filter((c) => c.status === 'new').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5">
              <MessageCircle className="h-4 w-4" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="accent" className="ml-1 text-2xs px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discord" className="gap-1.5">
              <Server className="h-4 w-4" />
              Discord
            </TabsTrigger>
            <TabsTrigger value="moderation" className="gap-1.5">
              <Shield className="h-4 w-4" />
              Moderation
              {pendingModeration > 0 && (
                <Badge variant="warning" className="ml-1 text-2xs px-1.5">
                  {pendingModeration}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <CommentsList
              comments={comments}
              onReply={handleReply}
              onLike={handleLike}
              onFlag={handleFlag}
              onArchive={handleArchive}
              onBulkArchive={handleBulkArchive}
            />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <MessagesPanel
              conversations={conversations}
              onSendReply={handleSendReply}
            />
          </TabsContent>

          {/* Discord Tab */}
          <TabsContent value="discord" className="space-y-4">
            <DiscordTab
              servers={MOCK_DISCORD_SERVERS}
              moderationQueue={discordMessages}
              onApprove={handleDiscordApprove}
              onDelete={handleDiscordDelete}
            />
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <ModerationQueue
              items={flaggedContent}
              onApprove={handleModApprove}
              onDelete={handleModDelete}
              onBan={handleModBan}
              onIgnore={handleModIgnore}
            />
            <ModerationLog entries={moderationLog} />
          </TabsContent>
        </Tabs>
      </MotionDiv>

      {/* Auto-Replies section (toggled) */}
      <AnimatePresence>
        {showAutoReplies && (
          <MotionDiv
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <AutoReplies
              rules={autoReplyRules}
              onToggle={handleToggleRule}
              onEdit={handleEditRule}
              onDelete={handleDeleteRule}
              onCreate={handleCreateRule}
            />
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
}
