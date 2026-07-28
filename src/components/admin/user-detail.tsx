'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit,
  Ban,
  Trash2,
  UserCheck,
  CreditCard,
  Activity,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PLAN_CONFIG, STATUS_CONFIG } from './types';
import type { AdminUser, AdminActivityLog, AdminBillingRecord } from './types';

interface UserDetailProps {
  user: AdminUser;
  activity: AdminActivityLog[];
  billing: AdminBillingRecord[];
  onChangePlan: (user: AdminUser) => void;
  onSuspend: (user: AdminUser) => void;
  onImpersonate: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UserDetail({
  user,
  activity,
  billing,
  onChangePlan,
  onSuspend,
  onImpersonate,
  onDelete,
}: UserDetailProps) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Back button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Avatar className="h-16 w-16 shrink-0">
            <AvatarFallback className="bg-accent-subtle text-xl font-bold text-accent">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-text-primary">{user.name}</h1>
              <Badge variant={STATUS_CONFIG[user.status].variant}>
                {STATUS_CONFIG[user.status].label}
              </Badge>
              <Badge variant="outline" className={cn(PLAN_CONFIG[user.plan].badgeClass)}>
                {PLAN_CONFIG[user.plan].label} Plan
              </Badge>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-text-tertiary">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.joinedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                Last active{' '}
                {new Date(user.lastActive).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => onChangePlan(user)}>
              <CreditCard className="mr-1.5 h-4 w-4" />
              Change Plan
            </Button>
            <Button variant="outline" size="sm" onClick={() => onSuspend(user)}>
              <Ban className="mr-1.5 h-4 w-4" />
              {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onImpersonate(user)}>
              <UserCheck className="mr-1.5 h-4 w-4" />
              Impersonate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-danger border-danger/30 hover:bg-danger-subtle"
              onClick={() => onDelete(user)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Usage Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Clips Generated</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {user.clipsGenerated.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Streams Imported</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {user.streamsImported.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Posts Scheduled</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {user.postsScheduled.toLocaleString()}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Total Spend</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            ${user.totalSpend.toLocaleString()}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subscription */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <CreditCard className="h-4 w-4" />
            Subscription
          </h3>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between rounded-lg bg-background-surface p-3">
              <span className="text-xs text-text-secondary">Current Plan</span>
              <Badge variant="outline" className={cn('text-2xs', PLAN_CONFIG[user.plan].badgeClass)}>
                {PLAN_CONFIG[user.plan].label} ({PLAN_CONFIG[user.plan].price})
              </Badge>
            </div>
            {billing.length > 0 && (
              <div className="rounded-lg bg-background-surface p-3">
                <p className="text-xs font-medium text-text-primary mb-2">Billing History</p>
                <div className="space-y-1.5">
                  {billing.slice(0, 3).map((bill) => (
                    <div key={bill.id} className="flex justify-between text-xs">
                      <span className="text-text-secondary">
                        {new Date(bill.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-text-primary font-medium">
                        ${bill.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Activity Log */}
        <Card className="p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Activity className="h-4 w-4" />
            Activity Log
          </h3>
          <div className="mt-3 space-y-2">
            {activity.length === 0 ? (
              <p className="text-xs text-text-tertiary text-center py-4">No recent activity</p>
            ) : (
              activity.slice(0, 6).map((act) => (
                <div
                  key={act.id}
                  className="rounded-lg bg-background-surface p-2.5 flex items-start gap-3"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background-card">
                    <Activity className="h-3.5 w-3.5 text-text-tertiary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary">{act.action}</p>
                    <p className="text-2xs text-text-tertiary">{act.details}</p>
                    <p className="mt-0.5 text-2xs text-text-tertiary">
                      {new Date(act.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {act.ip && ` • IP: ${act.ip}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
