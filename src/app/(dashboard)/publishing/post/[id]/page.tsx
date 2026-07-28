'use client';

import * as React from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { PostComposer } from '@/components/publisher/post-composer';
import { getPostById } from '@/components/publisher/mock-data';
import type { PostFormData } from '@/components/publisher/post-composer';
import type { MockPost } from '@/components/publisher';

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params.id as string;
  const isNew = postId === 'new';
  const mode = searchParams.get('mode'); // 'reschedule' if coming from reschedule action

  const [isLoading, setIsLoading] = React.useState(true);
  const [post, setPost] = React.useState<MockPost | undefined>(undefined);
  const [isSaving, setIsSaving] = React.useState(false);

  // Simulate loading
  React.useEffect(() => {
    if (!isNew) {
      const timer = setTimeout(() => {
        setPost(getPostById(postId));
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [isNew, postId]);

  const handleSubmit = (data: PostFormData) => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      router.push('/publishing');
    }, 1000);
  };

  const handleSaveDraft = (data: PostFormData) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/publishing');
    }, 800);
  };

  const title = isNew ? 'Create Post' : mode === 'reschedule' ? 'Reschedule Post' : 'Edit Post';
  const description = isNew
    ? 'Compose and schedule your post across multiple platforms.'
    : 'Edit your post details and settings.';

  return (
    <MotionDiv
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <Icon name="arrow-left" size="sm" className="mr-1.5" />
              Back
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-background-card p-4">
                <Skeleton className="mb-3 h-5 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-border bg-background-card p-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      ) : (
        <PostComposer
          post={post}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />
      )}
    </MotionDiv>
  );
}
