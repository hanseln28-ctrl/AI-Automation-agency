'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { SubscriptionsTable } from '@/components/admin/subscriptions-table';
import { MOCK_BILLING } from '@/components/admin/mock-data';

export default function AdminSubscriptionsPage() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <PageHeader
        title="Subscriptions"
        description="Manage billing, plans, and subscription status"
      />

      <SubscriptionsTable subscriptions={MOCK_BILLING} />
    </motion.div>
  );
}
