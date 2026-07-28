// IRON Creator OS — Type definitions
// This file exports shared types used across the application

export type Tier = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';

export type UserRole = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise' | 'admin';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency' | 'enterprise';

export type PlatformType = 'twitch' | 'kick' | 'youtube' | 'tiktok';

export type ClipStatus =
  | 'queued'
  | 'rendering'
  | 'rendered'
  | 'reviewing'
  | 'approved'
  | 'published'
  | 'failed'
  | 'archived';

export type StreamStatus =
  | 'importing'
  | 'imported'
  | 'transcribing'
  | 'analyzing'
  | 'generating_clips'
  | 'completed'
  | 'failed';

export type HookType =
  | 'curiosity_gap'
  | 'question'
  | 'bold_statement'
  | 'controversial'
  | 'emotional';

export type CaptionStyle = 'kinetic' | 'minimal' | 'bold' | 'emoji' | 'custom';

export type CaptionFormat = 'srt' | 'vtt' | 'ass' | 'burned_in';

// =============================================================================
// Clerk Extended Metadata Types
// =============================================================================

/**
 * Public metadata stored on Clerk user objects.
 * Accessible to both client and server via sessionClaims / user.publicMetadata.
 */
export interface UserPublicMetadata {
  tier?: SubscriptionTier;
  displayName?: string;
  platformConnections?: PlatformType[];
}

/**
 * Private metadata stored on Clerk user objects.
 * Only accessible server-side via Clerk Backend API.
 */
export interface UserPrivateMetadata {
  stripeCustomerId?: string;
  lastLoginIp?: string;
  referralCode?: string;
  referredBy?: string;
}

/**
 * Unsafe metadata stored on Clerk user objects.
 * Accessible to both client and server via session claims.
 * Used for role-based access control.
 */
export interface UserUnsafeMetadata {
  role?: UserRole;
  features?: string[];
}

/**
 * Clerk session claims shape (what auth() returns in sessionClaims).
 */
export interface ClerkSessionClaims {
  metadata?: {
    role?: UserRole;
    tier?: SubscriptionTier;
  };
  email?: string;
  userId?: string;
}

// =============================================================================
// User Profile
// =============================================================================

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  tier: Tier;
  clipsUsedThisMonth: number;
  clipsLimit: number;
  timezone: string;
}

// =============================================================================
// API Response Types
// =============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// =============================================================================
// Navigation Types
// =============================================================================

export interface Breadcrumb {
  href: string;
  label: string;
}

// =============================================================================
// Auth Helper Return Types
// =============================================================================

export interface AuthCheckResult {
  isAuthenticated: boolean;
  role: UserRole | null;
  tier: SubscriptionTier;
  userId: string | null;
}
