'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { UsersTable } from '@/components/admin/users-table';
import { MOCK_USERS } from '@/components/admin/mock-data';
import type { AdminUser } from '@/components/admin/types';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = React.useState(MOCK_USERS);

  const handleView = (user: AdminUser) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handleEdit = (user: AdminUser) => {
    toast.info(`Editing ${user.name}`);
  };

  const handleSuspend = (user: AdminUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: u.status === 'suspended' ? ('active' as const) : ('suspended' as const),
            }
          : u,
      ),
    );
    toast(user.status === 'suspended' ? 'User unsuspended' : 'User suspended');
  };

  const handleDelete = (user: AdminUser) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.error(`${user.name} deleted`);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PageHeader title="Users" description="Manage all platform users" />

      <UsersTable
        users={users}
        onView={handleView}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onDelete={handleDelete}
      />
    </motion.div>
  );
}
