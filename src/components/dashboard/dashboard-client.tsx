'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeIn } from '@/lib/utils/animations';
import {
  WelcomeBar,
  KpiRow,
  KpiRowSkeleton,
  QuickActions,
  QuickActionsSkeleton,
  TopClips,
  TopClipsSkeleton,
  UpcomingSchedule,
  UpcomingScheduleSkeleton,
  RecentActivity,
  RecentActivitySkeleton,
  NotificationsPanel,
  NotificationsPanelSkeleton,
} from '@/components/dashboard';

interface DashboardClientProps {
  userName: string;
}

export function DashboardClient({ userName }: DashboardClientProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Section */}
      <WelcomeBar userName={userName} />

      {/* Loading State */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="space-y-6"
          >
            <KpiRowSkeleton />
            <QuickActionsSkeleton />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <TopClipsSkeleton />
                <RecentActivitySkeleton />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <UpcomingScheduleSkeleton />
                <NotificationsPanelSkeleton />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* KPI Row */}
            <section>
              <KpiRow />
            </section>

            {/* Quick Actions */}
            <section>
              <QuickActions />
            </section>

            {/* Main Grid: Top Clips + Sidebar */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left: Top Clips (spans 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                <TopClips />
                <RecentActivity />
              </div>

              {/* Right side: Schedule + Notifications */}
              <div className="lg:col-span-1 space-y-6">
                <UpcomingSchedule />
                <NotificationsPanel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
