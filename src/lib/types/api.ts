// ── API Response Types ──
// These reflect the actual shapes returned by our API routes,
// which use Prisma includes under the hood.

// ── Common Wrapper ──

export interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: {
    nextCursor?: string;
    hasMore: boolean;
    limit: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Stream Shapes ──

export interface StreamSummary {
  id: string;
  userId: string;
  teamId: string | null;
  source: string;
  sourceUrl: string | null;
  sourceId: string | null;
  title: string | null;
  gameOrCategory: string | null;
  durationSeconds: number | null;
  resolution: string | null;
  fps: number | null;
  fileSizeBytes: bigint | null;
  status: string;
  progressPct: number | null;
  errorMessage: string | null;
  rawVodUrl: string | null;
  thumbnailUrl: string | null;
  chatLogUrl: string | null;
  transcriptJson: unknown | null;
  momentsJson: unknown | null;
  aiMetadata: unknown;
  clipCount: number;
  totalViews: bigint;
  jobId: string | null;
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  deletedAt: string | null;
  _count?: { clips: number };
}

export interface StreamDetail extends StreamSummary {
  clips: ClipSummary[];
  _count: { clips: number };
}

// ── Clip Shapes ──

export interface ClipSummary {
  id: string;
  userId: string;
  teamId: string | null;
  streamId: string;
  title: string | null;
  description: string | null;
  startOffset: number;
  endOffset: number;
  status: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  gifPreviewUrl: string | null;
  category: string | null;
  tags: string[];
  aiScore: number | null;
  aiMetadata: unknown;
  publishCount: number;
  totalViews: bigint;
  totalLikes: bigint;
  totalComments: bigint;
  totalShares: bigint;
  engagementRate: number;
  jobId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  stream?: { id: string; title: string | null };
  _count?: {
    captions: number;
    hooks: number;
    scheduledPosts: number;
  };
}

export interface ClipDetail extends ClipSummary {
  captions: unknown[];
  hooks: unknown[];
  scheduledPosts: unknown[];
}

// ── Generate Clips Response ──

export interface GenerateClipsResponse {
  clips: ClipSummary[];
  streamId: string;
  status: string;
  estimatedClips: number;
}
