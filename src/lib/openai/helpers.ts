// OpenAI helper utilities
// Centralized OpenAI client and AI pipeline helpers

import OpenAI from 'openai';
import { db } from '@/lib/db/prisma';

// ── Configuration ──

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.warn('[OpenAI] OPENAI_API_KEY is not set — AI features will be unavailable');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey || 'sk-placeholder',
});

/**
 * Available AI models used across the platform
 */
export const AI_MODELS = {
  momentDetection: 'gpt-4o',
  captionGeneration: 'gpt-4o',
  hookGeneration: 'gpt-4o',
  thumbnailSelection: 'gpt-4o',
  transcription: 'whisper-1',
  budget: 'gpt-4o-mini', // For free/starter tiers
} as const;

// ── Rate Limiting & Error Handling ──

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (retries > 0 && error instanceof Error) {
      const isRateLimit =
        error.message.includes('rate_limit') ||
        error.message.includes('429');

      if (isRateLimit) {
        const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1) * 2;
        console.warn(`[OpenAI] Rate limited, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1);
      }

      if (error.message.includes('500') || error.message.includes('503')) {
        const delay = RETRY_DELAY_MS * (MAX_RETRIES - retries + 1);
        console.warn(`[OpenAI] Server error, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1);
      }
    }
    throw error;
  }
}

// ── AI Pipeline Functions ──

export interface ClipMoment {
  startOffset: number;
  endOffset: number;
  category: string;
  viralityScore: number;
  confidence: number;
  explanation: string;
  transcriptSnippet: string;
  keywords: string[];
}

export interface GeneratedCaption {
  lines: Array<{
    text: string;
    startMs: number;
    endMs: number;
    emphasis?: 'normal' | 'bold' | 'highlight';
  }>;
  language: string;
  style: string;
}

export interface GeneratedHook {
  hookText: string;
  hookType: string;
  platformOptimizedFor: string;
  aiScore: number;
  hashtags: string[];
  seoKeywords: string[];
}

/**
 * Analyze a transcript for viral clip moments.
 * Uses GPT-4o to identify high-engagement segments with timestamps.
 */
export async function generateClipMoments(
  transcript: string,
  options?: {
    clipCount?: number;
    durationRange?: [number, number];
    categoryFilter?: string[];
  },
): Promise<ClipMoment[]> {
  const clipCount = options?.clipCount || 10;
  const durRange = options?.durationRange || [30, 60];
  const categories =
    options?.categoryFilter?.join(', ') ||
    'highlight, funny, clutch, rage, educational, wholesome, fail';

  const prompt = `You are an expert content editor for gaming/esports clips.
Analyze the following livestream transcript with timestamps. 

Identify the top ${clipCount} most viral-worthy moments (${durRange[0]}-${durRange[1]} seconds each).
Look for: ${categories}.

For each moment, provide:
- start_offset: seconds from stream start
- end_offset: seconds from stream start  
- category: one of [highlight, funny, clutch, rage, educational, wholesome, fail]
- virality_score: 0.0-1.0 (how viral this will be)
- confidence: 0.0-1.0 (how confident you are in this selection)
- explanation: why this moment is viral-worthy
- transcript_snippet: the key dialogue from this moment
- keywords: 3-5 relevant search keywords

Transcript:
${transcript.slice(0, 15000)}`;

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: AI_MODELS.momentDetection,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    }),
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned empty response');

  const parsed = JSON.parse(content);
  return (parsed.moments || parsed.moment || []).map((m: Record<string, unknown>) => ({
    startOffset: m.start_offset as number,
    endOffset: m.end_offset as number,
    category: m.category as string,
    viralityScore: m.virality_score as number,
    confidence: m.confidence as number,
    explanation: m.explanation as string,
    transcriptSnippet: m.transcript_snippet as string,
    keywords: (m.keywords as string[]) || [],
  }));
}

/**
 * Generate styled captions for a clip.
 * In production, this would also call Whisper for transcription.
 */
export async function generateCaptions(
  clipId: string,
  style: string = 'kinetic',
): Promise<GeneratedCaption & { captionId: string }> {
  const clip = await db.clip.findUnique({
    where: { id: clipId },
    select: {
      id: true,
      title: true,
      stream: { select: { transcriptJson: true } },
    },
  });

  if (!clip) throw new Error('Clip not found');

  const transcript = (clip.stream?.transcriptJson as { text?: string })?.text || '';
  if (!transcript) throw new Error('No transcript available for this clip');

  const prompt = `Generate captions in "${style}" style for the following video content.
Style guide:
- kinetic: dynamic, color-changing, word-by-word emphasis
- minimal: clean, small font, bottom-center
- bold: large text, high contrast, pop-up animations
- emoji: emoji-rich, fun, casual
- custom: default kinetic style

For each line, include:
- text: the caption text
- start_ms: start time in milliseconds
- end_ms: end time in milliseconds
- emphasis: "normal", "bold", or "highlight"

Content context: "${clip.title}"
Transcript excerpt: "${transcript.slice(0, 3000)}"

Return as JSON: { "lines": [...], "style": "..." }`;

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: AI_MODELS.captionGeneration,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 2000,
    }),
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned empty response');

  const parsed = JSON.parse(content);

  // Store in DB
  const caption = await db.caption.create({
    data: {
      clipId,
      style,
      language: 'en',
      format: 'vtt',
      content: JSON.stringify(parsed.lines),
      aiModel: AI_MODELS.captionGeneration,
      wordCount: parsed.lines?.length || 0,
    },
  });

  return {
    captionId: caption.id,
    lines: parsed.lines || [],
    language: 'en',
    style,
  };
}

/**
 * Generate hooks (titles, captions, hashtags) for a clip.
 * Creates multiple variants optimized for different platforms.
 */
export async function generateHooks(
  clipTitle: string,
  platform: string = 'tiktok',
  options?: {
    clipId?: string;
    count?: number;
    types?: string[];
  },
): Promise<GeneratedHook[]> {
  const count = options?.count || 3;
  const types = options?.types || ['curiosity_gap', 'question', 'bold_statement'];

  const prompt = `You are an expert social media strategist specializing in viral gaming/esports clips.
Generate ${count} hooks for a clip with context: "${clipTitle}"

Platform: ${platform}
Hook types to generate: ${types.join(', ')}

For each hook, provide:
- hook_text: the hook (15-150 characters, attention-grabbing)
- hook_type: one of [curiosity_gap, question, bold_statement, controversial, emotional]
- ai_score: 0.0-1.0 (your confidence in this hook's effectiveness)
- hashtags: 3-5 relevant hashtags (without # symbol)
- seo_keywords: 3-5 search keywords

Platform guidelines:
- TikTok: short, punchy, emoji-friendly, current trends
- youtube_shorts: more descriptive, SEO-focused, less emoji-heavy

Return as JSON: { "hooks": [...] }`;

  const response = await withRetry(() =>
    openai.chat.completions.create({
      model: AI_MODELS.hookGeneration,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 2000,
    }),
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('OpenAI returned empty response');

  const parsed = JSON.parse(content);
  const hooks: GeneratedHook[] = (parsed.hooks || []).map((h: Record<string, unknown>) => ({
    hookText: h.hook_text as string,
    hookType: h.hook_type as string,
    platformOptimizedFor: platform,
    aiScore: h.ai_score as number,
    hashtags: (h.hashtags as string[]) || [],
    seoKeywords: (h.seo_keywords as string[]) || [],
  }));

  // Store in DB if clipId provided
  if (options?.clipId) {
    for (const hook of hooks) {
      await db.clipHook.create({
        data: {
          clipId: options.clipId,
          hookText: hook.hookText,
          hookType: hook.hookType,
          platformOptimizedFor: hook.platformOptimizedFor,
          aiScore: hook.aiScore,
          aiModel: AI_MODELS.hookGeneration,
        },
      });
    }
  }

  return hooks;
}

/**
 * Track AI usage for billing.
 */
export async function trackAiUsage(params: {
  userId: string;
  operation: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  costCents: number;
  streamId?: string;
  clipId?: string;
  processingMs: number;
}) {
  return db.aiUsage.create({
    data: {
      userId: params.userId,
      operation: params.operation,
      model: params.model,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      costCents: params.costCents,
      streamId: params.streamId,
      clipId: params.clipId,
      processingMs: params.processingMs,
    },
  });
}

/**
 * Calculate OpenAI cost in cents.
 * Approximate costs per 1K tokens:
 * - GPT-4o: $0.005 input, $0.015 output
 * - GPT-4o-mini: $0.00015 input, $0.0006 output
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const rates: Record<string, { input: number; output: number }> = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'whisper-1': { input: 0.006, output: 0 }, // $0.006/min, roughly
  };

  const rate = rates[model] || rates['gpt-4o'];
  return ((inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output) * 100;
}
