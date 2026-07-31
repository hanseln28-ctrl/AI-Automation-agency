'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  ApiSuccess,
  StreamSummary,
  StreamDetail,
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

export const streamKeys = {
  all: ['streams'] as const,
  lists: () => [...streamKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | undefined>) =>
    [...streamKeys.lists(), filters] as const,
  details: () => [...streamKeys.all, 'detail'] as const,
  detail: (id: string) => [...streamKeys.details(), id] as const,
};

// ── useStreams ──

interface UseStreamsOptions {
  status?: string;
  limit?: number;
}

export function useStreams(options?: UseStreamsOptions) {
  const params = new URLSearchParams();
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', String(options.limit));

  const qs = params.toString();

  return useQuery<StreamSummary[]>({
    queryKey: streamKeys.list(
      options?.status || options?.limit ? { status: options?.status } : undefined,
    ),
    queryFn: () => fetchApi<StreamSummary[]>(`/api/streams${qs ? `?${qs}` : ''}`),
  });
}

// ── useStream ──

export function useStream(id: string) {
  return useQuery<StreamDetail>({
    queryKey: streamKeys.detail(id),
    queryFn: () => fetchApi<StreamDetail>(`/api/streams/${id}`),
    enabled: !!id,
  });
}

// ── useCreateStream ──

interface CreateStreamInput {
  title?: string;
  source: string;
  sourceUrl?: string;
  sourceId?: string;
  gameOrCategory?: string;
  durationSeconds?: number;
}

export function useCreateStream() {
  const queryClient = useQueryClient();

  return useMutation<StreamSummary, Error, CreateStreamInput>({
    mutationFn: (input) =>
      fetchApi<StreamSummary>('/api/streams', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: streamKeys.lists() });
      toast.success('Stream imported successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to import stream');
    },
  });
}

// ── useDeleteStream ──

export function useDeleteStream() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetchApi<void>(`/api/streams/${id}`, { method: 'DELETE' }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: streamKeys.lists() });
      queryClient.removeQueries({ queryKey: streamKeys.detail(id) });
      toast.success('Stream deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete stream');
    },
  });
}
