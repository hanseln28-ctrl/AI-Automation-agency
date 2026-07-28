'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { UserDetail } from '@/components/admin/user-detail';
import {
  MOCK_USERS,
  MOCK_BILLING,
  MOCK_ACTIVITY,
  getUserById,
  getActivityByUserId,
} from '@/components/admin/mock-data';
import { EmptyState } from '@/components/shared/empty-state';
import { toast } from 'sonner';
import type { AdminUser } from '@/components/admin/types';

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  const user = getUserById(userId);
  const activity = getActivityByUserId(userId);
  const billing = MOCK_BILLING.filter((b) => b.userId === userId);

  if (!user) {
    return (
      <EmptyState
        title="User not found"
        description="The requested user does not exist"
      />
    );
  }

  const handleChangePlan = (user: AdminUser) => {
    toast.info(`Change plan for ${user.name}`);
  };

  const handleSuspend = (user: AdminUser) => {
    toast(user.status === 'suspended' ? 'User unsuspended' : 'User suspended');
  };

  const handleImpersonate = (user: AdminUser) => {
    toast.info(`Impersonating ${user.name}...`);
  };

  const handleDelete = (user: AdminUser) => {
    toast.error(`Delete account for ${user.name}`);
  };

  return (
    <UserDetail
      user={user}
      activity={activity}
      billing={billing}
      onChangePlan={handleChangePlan}
      onSuspend={handleSuspend}
      onImpersonate={handleImpersonate}
      onDelete={handleDelete}
    />
  );
}
