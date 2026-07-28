'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import {
  Bell,
  CheckCircle2,
  MessageCircle,
  FileText,
  TrendingUp,
  UserPlus,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { staggerItem } from '@/lib/utils/animations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/* ── Demo notification data ── */
const NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    message: 'Stream processing complete',
    detail: 'Friday Night Gaming — 12 clips ready',
    timeAgo: '2m ago',
    unread: true,
    color: 'text-success',
    bg: 'bg-success-subtle',
  },
  {
    id: 2,
    icon: MessageCircle,
    message: 'New comment on TikTok clip',
    detail: '"Bro your aim is cracked fr fr 🔥"',
    timeAgo: '15m ago',
    unread: true,
    color: 'text-accent',
    bg: 'bg-accent-subtle',
  },
  {
    id: 3,
    icon: FileText,
    message: 'Sponsorship report ready',
    detail: 'Weekly earnings summary available',
    timeAgo: '1h ago',
    unread: true,
    color: 'text-warning',
    bg: 'bg-warning-subtle',
  },
  {
    id: 4,
    icon: TrendingUp,
    message: 'Clip trending on TikTok',
    detail: "'That clutch was insane' — 500K views",
    timeAgo: '3h ago',
    unread: false,
    color: 'text-[#FF004F]',
    bg: 'bg-[#FF004F]/10',
  },
  {
    id: 5,
    icon: UserPlus,
    message: 'Follower milestone reached',
    detail: 'You just hit 5,000 followers! 🎉',
    timeAgo: '5h ago',
    unread: false,
    color: 'text-success',
    bg: 'bg-success-subtle',
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = React.useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false })),
    );
  };

  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-4 w-4 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-accent ring-2 ring-background-card">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            )}
          </div>
          <CardTitle className="text-base font-semibold">
            Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <span className="rounded-full bg-accent-subtle px-1.5 py-0.5 text-2xs font-semibold text-accent">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-text-tertiary transition-colors hover:text-text-primary"
          >
            Mark all read
          </button>
        )}
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <Bell className="mb-2 h-8 w-8 text-text-tertiary/40" />
            <p className="text-sm text-text-tertiary">All caught up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {notifications.map((notif, i) => (
                <MotionDiv
                  key={notif.id}
                  variants={staggerItem}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'group relative flex items-start gap-3 rounded-lg p-2.5',
                    'transition-all duration-200',
                    notif.unread
                      ? 'bg-accent-subtle/30 border border-accent/10'
                      : 'hover:bg-background-elevated/50',
                  )}
                >
                  {/* Unread dot */}
                  {notif.unread && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                      notif.bg,
                    )}
                  >
                    <notif.icon className={cn('h-3.5 w-3.5', notif.color)} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary">
                      {notif.message}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                      {notif.detail}
                    </p>
                    <span className="mt-0.5 block text-2xs text-text-tertiary">
                      {notif.timeAgo}
                    </span>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="shrink-0 rounded p-0.5 text-text-tertiary opacity-0 transition-all hover:text-text-primary group-hover:opacity-100"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function NotificationsPanelSkeleton() {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-background-elevated" />
          <div className="h-5 w-28 animate-pulse rounded bg-background-elevated" />
        </div>
        <div className="h-3 w-20 animate-pulse rounded bg-background-elevated" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3 p-2.5">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-background-elevated" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-40 animate-pulse rounded bg-background-elevated" />
              <div className="h-3 w-32 animate-pulse rounded bg-background-elevated" />
              <div className="h-2.5 w-12 animate-pulse rounded bg-background-elevated" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
