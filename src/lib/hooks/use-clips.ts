'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  ApiSuccess,
  ClipSummary,
  ClipDetail,
  GenerateClipsResponse,
} from '@/lib/types/api';

// ── Helpers ──

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return (json as ApiSuccess<T>).data;
}

// ── Query Key Factory ──

export const clipKeys = {
  all: ['clips'] as const,
  lists: () => [...clipKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | undefined>) =>
    [...clipKeys.lists(), filters] as const,
  details: () => [...clipKeys.all, 'detail'] as const,
  detail: (id: string) => [...clipKeys.details(), id] as const,
};

// ── useClips ──

export interface ClipFilters {
  status?: string;
  category?: string;
  streamId?: string;
  limit?: number;
  sort?: string;
  q?: string;
}

export function useClips(filters?: ClipFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.category) params.set('category', filters.category);
  if (filters?.streamId) params.set('streamId', filters.streamId);
  if (filters?.limit) params.set('limit', String(filters.limit));
  if (filters?.sort) params.set('sort', filters.sort);
  if (filters?.q) params.set('q', filters.q);

  const qs = params.toString();

  return useQuery<ClipSummary[]>({
    queryKey: clipKeys.list(filters || {}),
    queryFn: () => fetchApi<ClipSummary[]>(`/api/clips${qs ? `?${qs}` : ''}`),
  });
}

// ── useClip ──

export function useClip(id: string) {
  return useQuery<ClipDetail>({
    queryKey: clipKeys.detail(id),
    queryFn: () => fetchApi<ClipDetail>(`/api/clips/${id}`),
    enabled: !!id,
  });
}

// ── useCreateClip ──

export interface GenerateClipsInput {
  streamId: string;
  clipCount?: number;
  durationRange?: [number, number];
  captionStyle?: string;
  hookVariants?: number;
  platformTargets?: string[];
  categoryFilter?: string[];
}

export function useCreateClip() {
  const queryClient = useQueryClient();

  return useMutation<GenerateClipsResponse, Error, GenerateClipsInput>({
    mutationFn: (input) =>
      fetchApi<GenerateClipsResponse>('/api/clips', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      toast.success('Clip generation started');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate clips');
    },
  });
}

// ── useDeleteClip ──

export function useDeleteClip() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetchApi<void>(`/api/clips/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: clipKeys.lists() });
      queryClient.removeQueries({ queryKey: clipKeys.detail(id) });
      toast.success('Clip deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete clip');
    },
  });
}
