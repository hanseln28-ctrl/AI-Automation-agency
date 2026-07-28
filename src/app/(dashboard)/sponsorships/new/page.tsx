'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { CampaignForm } from '@/components/sponsorships/campaign-form';
import { staggerContainer } from '@/lib/utils/animations';

export default function NewCampaignPage() {
  const router = useRouter();

  const handleSubmit = (data: unknown) => {
    // In production: POST to API
    console.log('New campaign data:', data);
    router.push('/sponsorships');
  };

  return (
    <motion.div
      className="space-y-6 animate-fade-in"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="New Campaign"
        description="Create a new sponsorship campaign."
        actions={null}
      />

      <CampaignForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/sponsorships')}
      />
    </motion.div>
  );
}
