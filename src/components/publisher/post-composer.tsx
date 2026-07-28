'use client';

import * as React from 'react';
import { MotionDiv, MotionButton, MotionSpan, MotionTr, MotionP } from '@/components/shared/motion';
import { cn } from '@/lib/utils/cn';
import { Icon } from '@/components/shared/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MockPost, PublisherPlatform, PostPlatformEntry, PostPlatformSettings } from './types';
import { PUBLISHER_PLATFORM_CONFIG, SUGGESTED_HASHTAGS } from './types';
import { MOCK_CLIPS_FOR_POST } from './mock-data';
import { PlatformSelector } from './platform-selector';
import { SchedulePicker } from './schedule-picker';
import { PlatformSettings } from './platform-settings';
import { PostPreview } from './post-preview';
import { format, isToday, isTomorrow } from 'date-fns';

interface PostComposerProps {
  post?: MockPost; // if editing existing post
  onSubmit: (data: PostFormData) => void;
  onSaveDraft: (data: PostFormData) => void;
  isSaving?: boolean;
}

export interface PostFormData {
  clipId: string;
  platforms: PublisherPlatform[];
  platformEntries: PostPlatformEntry[];
  primaryCaption: string;
  scheduledTime: string;
  postNow: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  post,
  onSubmit,
  onSaveDraft,
  isSaving = false,
}) => {
  const isEditing = !!post;

  // State
  const [selectedClipId, setSelectedClipId] = React.useState(post?.clipId || '');
  const [platforms, setPlatforms] = React.useState<PublisherPlatform[]>(post?.platforms || []);
  const [captions, setCaptions] = React.useState<Record<PublisherPlatform, string>>(() => {
    const map: Record<string, string> = {};
    if (post?.platformEntries) {
      post.platformEntries.forEach((e) => { map[e.platform] = e.caption; });
    }
    return map as Record<PublisherPlatform, string>;
  });
  const [hashtags, setHashtags] = React.useState<Record<PublisherPlatform, string[]>>(() => {
    const map: Record<string, string[]> = {};
    if (post?.platformEntries) {
      post.platformEntries.forEach((e) => { map[e.platform] = e.hashtags || []; });
    }
    return map as Record<PublisherPlatform, string[]>;
  });
  const [settings, setSettings] = React.useState<Record<PublisherPlatform, PostPlatformSettings>>(() => {
    const map: Record<string, PostPlatformSettings> = {};
    if (post?.platformEntries) {
      post.platformEntries.forEach((e) => { map[e.platform] = e.settings || {}; });
    }
    return map as Record<PublisherPlatform, PostPlatformSettings>;
  });
  const [scheduledTime, setScheduledTime] = React.useState(post?.scheduledTime || '');
  const [postNow, setPostNow] = React.useState(false);
  const [hashtagInputs, setHashtagInputs] = React.useState<Record<string, string>>({});
  const [activePreviewPlatform, setActivePreviewPlatform] = React.useState<PublisherPlatform | null>(null);
  const [expandedSettings, setExpandedSettings] = React.useState<Set<PublisherPlatform>>(new Set());

  // Derived
  const selectedClip = MOCK_CLIPS_FOR_POST.find((c) => c.id === selectedClipId);
  const primaryCaption = platforms.length > 0 ? (captions[platforms[0]!] || '') : '';

  const toggleSettings = (p: PublisherPlatform) => {
    setExpandedSettings((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  };

  const updateCaption = (platform: PublisherPlatform, value: string) => {
    setCaptions((prev) => ({ ...prev, [platform]: value }));
  };

  const addHashtag = (platform: PublisherPlatform, tag: string) => {
    const cleaned = tag.startsWith('#') ? tag : `#${tag}`;
    const current = hashtags[platform] || [];
    if (!current.includes(cleaned)) {
      setHashtags((prev) => ({ ...prev, [platform]: [...current, cleaned] }));
    }
    setHashtagInputs((prev) => ({ ...prev, [platform]: '' }));
  };

  const removeHashtag = (platform: PublisherPlatform, tag: string) => {
    setHashtags((prev) => ({
      ...prev,
      [platform]: (prev[platform] || []).filter((t) => t !== tag),
    }));
  };

  const buildFormData = (): PostFormData => {
    const platformEntries: PostPlatformEntry[] = platforms.map((p) => ({
      platform: p,
      caption: captions[p] || '',
      hashtags: hashtags[p] || [],
      settings: settings[p] || {},
    }));
    return {
      clipId: selectedClipId,
      platforms,
      platformEntries,
      primaryCaption,
      scheduledTime: postNow ? new Date().toISOString() : scheduledTime,
      postNow,
    };
  };

  const handleSubmit = () => onSubmit(buildFormData());
  const handleSaveDraft = () => onSaveDraft(buildFormData());

  const formatScheduled = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
    if (isTomorrow(d)) return `Tomorrow at ${format(d, 'h:mm a')}`;
    return format(d, 'MMM d — h:mm a');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Composer */}
      <div className="space-y-6 lg:col-span-2">
        {/* Clip Selection */}
        <div className="rounded-xl border border-border bg-background-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Select Clip/Media</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {MOCK_CLIPS_FOR_POST.map((clip) => (
              <MotionButton
                key={clip.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedClipId(clip.id)}
                className={cn(
                  'relative overflow-hidden rounded-lg border text-left transition-all',
                  selectedClipId === clip.id
                    ? 'border-accent ring-1 ring-accent'
                    : 'border-border hover:border-text-tertiary',
                )}
              >
                <div className={cn('aspect-video w-full bg-gradient-to-br', clip.thumbnailGradient)} />
                <div className="p-2">
                  <p className="truncate text-xs font-medium text-text-primary">{clip.title}</p>
                  <p className="text-2xs text-text-tertiary">{clip.duration}s</p>
                </div>
                {selectedClipId === clip.id && (
                  <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                    <Icon name="check" size="xs" color="text-white" />
                  </div>
                )}
              </MotionButton>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div className="rounded-xl border border-border bg-background-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Platforms</h3>
          <PlatformSelector selected={platforms} onChange={setPlatforms} />
        </div>

        {/* Captions per platform */}
        {platforms.map((platform) => {
          const cfg = PUBLISHER_PLATFORM_CONFIG[platform];
          const charCount = (captions[platform] || '').length;
          const limit = cfg.charLimit;
          const isOverLimit = charCount > limit;

          return (
            <div key={platform} className="rounded-xl border border-border bg-background-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('flex h-6 w-6 items-center justify-center rounded-md', cfg.bgClass)}>
                    <Icon name={cfg.icon as any} size="xs" color={cfg.textClass} />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{cfg.label}</span>
                </div>
                <span className={cn('text-xs', isOverLimit ? 'text-danger' : 'text-text-tertiary')}>
                  {charCount}/{limit.toLocaleString()}
                </span>
              </div>
              <textarea
                value={captions[platform] || ''}
                onChange={(e) => updateCaption(platform, e.target.value)}
                placeholder={`Write your ${cfg.label} caption...`}
                rows={3}
                className={cn(
                  'w-full resize-none rounded-lg border bg-background-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none',
                  isOverLimit ? 'border-danger' : 'border-border focus:border-accent',
                )}
              />

              {/* Hashtags */}
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {(hashtags[platform] || []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="ghost"
                      className="cursor-pointer gap-1 border-border hover:border-danger"
                      onClick={() => removeHashtag(platform, tag)}
                    >
                      {tag}
                      <Icon name="x" size="xs" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={hashtagInputs[platform] || ''}
                    onChange={(e) => setHashtagInputs((prev) => ({ ...prev, [platform]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = (hashtagInputs[platform] || '').replace(/,/g, '').trim();
                        if (val) addHashtag(platform, val);
                      }
                    }}
                    placeholder="Add hashtag..."
                    className="flex-1 rounded-lg border border-border bg-background-surface px-2 py-1 text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                  />
                </div>
                {/* Hashtag suggestions */}
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_HASHTAGS.filter((h) => !(hashtags[platform] || []).includes(h)).slice(0, 5).map((s) => (
                    <button
                      key={s}
                      onClick={() => addHashtag(platform, s.replace('#', ''))}
                      className="rounded-full border border-border px-2 py-0.5 text-2xs text-text-tertiary hover:border-accent hover:text-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle settings */}
              <button
                onClick={() => toggleSettings(platform)}
                className="mt-2 flex items-center gap-1 text-xs text-text-tertiary hover:text-text-primary transition-colors"
              >
                <Icon name="settings" size="xs" />
                {cfg.label} Settings
                <Icon name={expandedSettings.has(platform) ? 'chevron-up' : 'chevron-down'} size="xs" />
              </button>
              {expandedSettings.has(platform) && (
                <div className="mt-2">
                  <PlatformSettings
                    platform={platform}
                    settings={settings[platform] || {}}
                    onChange={(s) => setSettings((prev) => ({ ...prev, [platform]: s }))}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Schedule */}
        <div className="rounded-xl border border-border bg-background-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Schedule</h3>
          <SchedulePicker
            scheduledTime={scheduledTime}
            onChange={setScheduledTime}
            onPostNow={() => setPostNow(!postNow)}
            postNow={postNow}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving} className="flex-1">
            <Icon name="save" size="sm" className="mr-2" />
            Save Draft
          </Button>
          {postNow ? (
            <Button onClick={handleSubmit} disabled={isSaving} className="flex-1">
              <Icon name="send" size="sm" className="mr-2" />
              {isSaving ? 'Posting...' : 'Post Now'}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSaving} className="flex-1">
              <Icon name="calendar" size="sm" className="mr-2" />
              {isSaving ? 'Scheduling...' : scheduledTime ? `Schedule — ${formatScheduled(scheduledTime)}` : 'Schedule'}
            </Button>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4 lg:col-span-1">
        <div className="sticky top-20 rounded-xl border border-border bg-background-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Preview</h3>

          {platforms.length === 0 ? (
            <div className="py-12 text-center">
              <Icon name="eye" size="lg" color="text-text-tertiary" className="mx-auto mb-2" />
              <p className="text-xs text-text-secondary">Select platforms to preview</p>
            </div>
          ) : (
            <>
              {/* Platform tabs for preview */}
              <div className="mb-3 flex flex-wrap gap-1">
                {platforms.map((p) => {
                  const cfg = PUBLISHER_PLATFORM_CONFIG[p];
                  const isActive = activePreviewPlatform === p || (!activePreviewPlatform && platforms[0] === p);
                  return (
                    <button
                      key={p}
                      onClick={() => setActivePreviewPlatform(p)}
                      className={cn(
                        'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-all',
                        isActive
                          ? cn(cfg.bgClass, cfg.textClass)
                          : 'text-text-tertiary hover:text-text-secondary',
                      )}
                    >
                      <Icon name={cfg.icon as any} size="xs" color={isActive ? cfg.textClass : 'text-text-tertiary'} />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Active preview */}
              {(() => {
                const displayPlatform = activePreviewPlatform || platforms[0]!;
                return (
                  <PostPreview
                    platform={displayPlatform}
                    caption={captions[displayPlatform] || primaryCaption}
                    hashtags={hashtags[displayPlatform] || []}
                    thumbnailGradient={selectedClip?.thumbnailGradient || 'from-[#6C5CE7] via-[#3B82F6] to-[#0A0A0F]'}
                    clipTitle={selectedClip?.title || 'Select a clip'}
                  />
                );
              })()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
