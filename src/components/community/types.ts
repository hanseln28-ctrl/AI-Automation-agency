// ── Community Manager Types & Config ──

export type CommunityPlatform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'x';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type CommentStatus = 'new' | 'replied' | 'flagged' | 'archived';
export type ModerationAction = 'approved' | 'deleted' | 'banned' | 'ignored';
export type AutoReplyTrigger = 'keyword' | 'faq' | 'sentiment';

export interface MockComment {
  id: string;
  userAvatar: string;
  username: string;
  platform: CommunityPlatform;
  commentText: string;
  timestamp: string;
  sentiment: Sentiment;
  status: CommentStatus;
  likes: number;
  postTitle?: string;
  postUrl?: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  senderName: string;
  senderAvatar: string;
  platform: CommunityPlatform;
  content: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
}

export interface MockConversation {
  id: string;
  userName: string;
  userAvatar: string;
  platform: CommunityPlatform;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: MockMessage[];
}

export interface MockFlaggedContent {
  id: string;
  type: 'comment' | 'message';
  content: string;
  reason: string;
  username: string;
  userAvatar: string;
  platform: CommunityPlatform;
  date: string;
  status: 'pending' | 'reviewed';
}

export interface MockModerationLogEntry {
  id: string;
  action: ModerationAction;
  target: string;
  targetType: 'comment' | 'message' | 'user';
  reason: string;
  moderator: string;
  date: string;
}

export interface MockAutoReplyRule {
  id: string;
  name: string;
  triggerType: AutoReplyTrigger;
  triggerKeywords: string[];
  response: string;
  platform: CommunityPlatform | 'all';
  enabled: boolean;
  usageCount: number;
}

export interface MockDiscordServer {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
  channelCount: number;
  connected: boolean;
  activityLevel: 'low' | 'medium' | 'high';
}

export interface MockDiscordMessage {
  id: string;
  serverId: string;
  channelName: string;
  username: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  flagged: boolean;
  flagReason?: string;
}

// ── Config Constants ──

export const PLATFORM_CONFIG: Record<
  CommunityPlatform,
  { label: string; color: string; badgeClass: string; iconClass: string }
> = {
  tiktok: {
    label: 'TikTok',
    color: '#FF0050',
    badgeClass: 'bg-[#FF0050]/15 text-[#FF6B8A] border-[#FF0050]/30',
    iconClass: 'text-[#FF0050]',
  },
  instagram: {
    label: 'Instagram',
    color: '#E1306C',
    badgeClass: 'bg-[#E1306C]/15 text-[#F48FB1] border-[#E1306C]/30',
    iconClass: 'text-[#E1306C]',
  },
  youtube: {
    label: 'YouTube',
    color: '#FF0000',
    badgeClass: 'bg-[#FF0000]/15 text-[#FF6B6B] border-[#FF0000]/30',
    iconClass: 'text-[#FF0000]',
  },
  facebook: {
    label: 'Facebook',
    color: '#1877F2',
    badgeClass: 'bg-[#1877F2]/15 text-[#6BA3F7] border-[#1877F2]/30',
    iconClass: 'text-[#1877F2]',
  },
  x: {
    label: 'X',
    color: '#E7E9EA',
    badgeClass: 'bg-white/10 text-[#CCCCCC] border-white/20',
    iconClass: 'text-white',
  },
};

export const SENTIMENT_CONFIG: Record<
  Sentiment,
  { label: string; badgeClass: string; emoji: string }
> = {
  positive: {
    label: 'Positive',
    badgeClass: 'bg-success-subtle text-success border-success/30',
    emoji: '😊',
  },
  neutral: {
    label: 'Neutral',
    badgeClass: 'bg-background-elevated text-text-secondary border-border',
    emoji: '😐',
  },
  negative: {
    label: 'Negative',
    badgeClass: 'bg-danger-subtle text-danger border-danger/30',
    emoji: '😟',
  },
};

export const COMMENT_STATUS_CONFIG: Record<
  CommentStatus,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' }
> = {
  new: { label: 'New', variant: 'accent' },
  replied: { label: 'Replied', variant: 'success' },
  flagged: { label: 'Flagged', variant: 'warning' },
  archived: { label: 'Archived', variant: 'ghost' },
};

export const MODERATION_ACTION_CONFIG: Record<
  ModerationAction,
  { label: string; variant: 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost' }
> = {
  approved: { label: 'Approved', variant: 'success' },
  deleted: { label: 'Deleted', variant: 'danger' },
  banned: { label: 'Banned User', variant: 'danger' },
  ignored: { label: 'Ignored', variant: 'ghost' },
};
