'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP, AnimatePresence } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PostTabs } from '@/components/publisher/post-tabs';
import { CalendarStrip } from '@/components/publisher/calendar-strip';
import { CalendarView } from '@/components/publisher/calendar-view';
import { QueueList } from '@/components/publisher/queue-list';
import { FailedPosts } from '@/components/publisher/failed-posts';
import { MOCK_POSTS, getPostsByStatus, getPostsByDate } from '@/components/publisher/mock-data';
import type { PublisherTab, MockPost } from '@/components/publisher';
import { isToday, isSameDay, startOfDay } from 'date-fns';

export default function PublishingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<PublisherTab>('queue');
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [selectedPosts, setSelectedPosts] = React.useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState(MOCK_POSTS);

  // Filter posts
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled');
  const todayPosts = scheduledPosts.filter((p) => {
    if (!p.scheduledTime) return false;
    return isToday(new Date(p.scheduledTime));
  });
  const calendarDayPosts = scheduledPosts.filter((p) => {
    if (!p.scheduledTime) return false;
    return isSameDay(new Date(p.scheduledTime), selectedDate);
  });
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const failedPosts = posts.filter((p) => p.status === 'failed');
  const failedCount = failedPosts.length;

  // Show toast briefly
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEdit = (id: string) => {
    router.push(`/publishing/post/${id}`);
  };

  const handleCreatePost = () => {
    router.push('/publishing/post/new');
  };

  const handlePostNow = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'posting' as const } : p)),
    );
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: 'published' as const } : p)),
      );
      showToast('Post published!');
    }, 1500);
  };

  const handleReschedule = (id: string) => {
    // For mock purposes: push to editor with reschedule mode
    router.push(`/publishing/post/${id}?mode=reschedule`);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget));
      setSelectedPosts((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget);
        return next;
      });
      showToast('Post deleted');
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const handleRetry = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: 'posting' as const, errorMessage: undefined } : p,
      ),
    );
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'published' as const } : p,
        ),
      );
      showToast('Post retried and published!');
    }, 2000);
  };

  const handleRetryAll = () => {
    failedPosts.forEach((p) => {
      setPosts((prev) =>
        prev.map((pp) =>
          pp.id === p.id ? { ...pp, status: 'posting' as const } : pp,
        ),
      );
    });
    setTimeout(() => {
      setPosts((prev) =>
        prev.map((pp) =>
          pp.status === 'posting' ? { ...pp, status: 'published' as const } : pp,
        ),
      );
      showToast(`Retried ${failedPosts.length} posts`);
    }, 3000);
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedPosts((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const bulkDelete = () => {
    setPosts((prev) => prev.filter((p) => !selectedPosts.has(p.id)));
    showToast(`${selectedPosts.size} posts deleted`);
    setSelectedPosts(new Set());
    setBulkMode(false);
  };

  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toastMessage}
          </MotionDiv>
        )}
      </AnimatePresence>

      <PageHeader
        title="Social Publisher"
        description="Schedule and manage posts across all your social platforms."
        actions={
          <div className="flex items-center gap-2">
            {selectedPosts.size > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setSelectedPosts(new Set())}>
                  Clear ({selectedPosts.size})
                </Button>
                <Button variant="destructive" size="sm" onClick={bulkDelete}>
                  <Icon name="trash-2" size="xs" className="mr-1.5" />
                  Delete Selected
                </Button>
              </>
            )}
            <Button variant={bulkMode ? 'default' : 'outline'} size="sm" onClick={() => { setBulkMode(!bulkMode); setSelectedPosts(new Set()); }}>
              <Icon name="check" size="xs" className="mr-1.5" />
              {bulkMode ? 'Done' : 'Select'}
            </Button>
            <Button onClick={handleCreatePost}>
              <Icon name="plus" size="sm" color="text-white" className="mr-2" />
              Create Post
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <PostTabs
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setBulkMode(false);
          setSelectedPosts(new Set());
        }}
        failedCount={failedCount}
        queueCount={scheduledPosts.length}
      />

      <AnimatePresence mode="wait">
        {/* Queue View */}
        {activeTab === 'queue' && (
          <MotionDiv
            key="queue"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Calendar Strip */}
            <CalendarStrip
              posts={scheduledPosts}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            {/* Today's Queue */}
            {isToday(selectedDate) ? (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-text-secondary">
                  Today&apos;s Queue &mdash; {todayPosts.length} post{todayPosts.length !== 1 ? 's' : ''}
                </h3>
                <QueueList
                  posts={todayPosts}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onPostNow={handlePostNow}
                  onReschedule={handleReschedule}
                  onDelete={handleDelete}
                  onRetry={handleRetry}
                  selected={selectedPosts}
                  onSelect={toggleSelect}
                  showCheckbox={bulkMode}
                />
              </div>
            ) : (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-text-secondary">
                  Queue for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
                <QueueList
                  posts={calendarDayPosts}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onPostNow={handlePostNow}
                  onReschedule={handleReschedule}
                  onDelete={handleDelete}
                  onRetry={handleRetry}
                  selected={selectedPosts}
                  onSelect={toggleSelect}
                  showCheckbox={bulkMode}
                />
              </div>
            )}
          </MotionDiv>
        )}

        {/* Calendar View */}
        {activeTab === 'calendar' && (
          <MotionDiv
            key="calendar"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <CalendarView
              posts={scheduledPosts}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              sidebarPosts={calendarDayPosts}
              onEdit={handleEdit}
              onPostNow={handlePostNow}
              onDelete={handleDelete}
            />
          </MotionDiv>
        )}

        {/* Posted View */}
        {activeTab === 'posted' && (
          <MotionDiv
            key="posted"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <h3 className="mb-3 text-sm font-semibold text-text-secondary">
              Published Posts &mdash; {publishedPosts.length} post{publishedPosts.length !== 1 ? 's' : ''}
            </h3>
            <QueueList
              posts={publishedPosts.sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime())}
              isLoading={isLoading}
              onEdit={handleEdit}
              onPostNow={() => {}}
              onReschedule={() => {}}
              onDelete={handleDelete}
              onRetry={() => {}}
              selected={selectedPosts}
              onSelect={toggleSelect}
              showCheckbox={bulkMode}
            />
          </MotionDiv>
        )}

        {/* Failed View */}
        {activeTab === 'failed' && (
          <MotionDiv
            key="failed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FailedPosts
              posts={failedPosts}
              onRetry={handleRetry}
              onRetryAll={handleRetryAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </MotionDiv>
  );
}
