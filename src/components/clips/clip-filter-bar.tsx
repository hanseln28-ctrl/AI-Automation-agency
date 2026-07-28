'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icon } from '@/components/shared/icon';
import type { MomentType } from './types';

interface ClipFilterBarProps {
  onSearch?: (value: string) => void;
  onPlatformChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onMomentTypeChange?: (value: string) => void;
  platformFilter: string;
  statusFilter: string;
  momentTypeFilter: string;
}

export function ClipFilterBar({
  onSearch,
  onPlatformChange,
  onStatusChange,
  onMomentTypeChange,
  platformFilter = 'all',
  statusFilter = 'all',
  momentTypeFilter = 'all',
}: ClipFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Icon
          name="search"
          size="sm"
          color="text-text-tertiary"
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
        <Input
          placeholder="Search clips..."
          className="pl-9"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Platform Filter */}
      <Select value={platformFilter} onValueChange={(v) => onPlatformChange?.(v)}>
        <SelectTrigger className="w-[140px] shrink-0">
          <Icon name="tv-2" size="sm" color="text-text-tertiary" className="mr-2" />
          <SelectValue placeholder="Platform" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Platforms</SelectItem>
          <SelectItem value="twitch">Twitch</SelectItem>
          <SelectItem value="kick">Kick</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="tiktok">TikTok</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusChange?.(v)}>
        <SelectTrigger className="w-[130px] shrink-0">
          <Icon name="filter" size="sm" color="text-text-tertiary" className="mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="queued">Queued</SelectItem>
          <SelectItem value="rendering">Rendering</SelectItem>
          <SelectItem value="ready">Ready</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      {/* Moment Type Filter */}
      <Select value={momentTypeFilter} onValueChange={(v) => onMomentTypeChange?.(v)}>
        <SelectTrigger className="w-[140px] shrink-0">
          <Icon name="tag" size="sm" color="text-text-tertiary" className="mr-2" />
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="funny">Funny</SelectItem>
          <SelectItem value="clutch">Clutch</SelectItem>
          <SelectItem value="rage">Rage</SelectItem>
          <SelectItem value="emotional">Emotional</SelectItem>
          <SelectItem value="fail">Fail</SelectItem>
          <SelectItem value="victory">Victory</SelectItem>
          <SelectItem value="donation">Donation</SelectItem>
          <SelectItem value="chat_reaction">Chat Reaction</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
