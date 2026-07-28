// OpenAI helper utilities
// Centralized OpenAI client and AI pipeline helpers

import OpenAI from 'openai';

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY is not set');
}

export const openai = new OpenAI({
  apiKey: openaiApiKey,
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
