import type {
  HookGenerationResult,
  HookTitleVariation,
  HookVariation,
  HookDescription,
  HookHashtag,
  HookSEOKeyword,
  HookPlatform,
  HookTone,
} from './types';
import { MOCK_CLIPS } from '@/components/clips/mock-data';

// Clip options for the selector
export const MOCK_CLIP_OPTIONS = MOCK_CLIPS.map((c) => ({
  id: c.id,
  title: c.title,
  sourceStreamName: c.sourceStreamName,
  duration: c.duration,
}));

export function getClipOptionById(id: string) {
  return MOCK_CLIP_OPTIONS.find((c) => c.id === id);
}

// ── Generate mock hook results ──

const TITLE_VARIATIONS: Record<string, HookTitleVariation[]> = {
  clutch: [
    { id: 't1', text: 'This 1v5 Clutch Had The ENTIRE Chat Screaming 🔥', platform: 'tiktok', score: 94, impressions: 45000 },
    { id: 't2', text: 'When You Refuse To Lose: The Greatest Clutch Ever', platform: 'youtube', score: 88, impressions: 32000 },
    { id: 't3', text: 'ONE SHOT. ONE KILL. IMPOSSIBLE CLUTCH.', platform: 'twitter', score: 85, impressions: 28000 },
    { id: 't4', text: 'The Clutch That Broke The Internet In 30 Seconds', platform: 'instagram', score: 91, impressions: 38000 },
    { id: 't5', text: 'Watch Until The End... This Clutch Is UNREAL 😳', platform: 'tiktok', score: 92, impressions: 42000 },
    { id: 't6', text: 'POV: You Just Hit The Most Insane 1v5 In Overtime', platform: 'tiktok', score: 89, impressions: 35000 },
    { id: 't7', text: 'How I Clutched A 1v5 While My Team Was SCREAMING', platform: 'youtube', score: 82, impressions: 22000 },
    { id: 't8', text: 'The PLAY That Made Pro Players RAGE QUIT', platform: 'twitter', score: 86, impressions: 30000 },
    { id: 't9', text: '0.1 Seconds Left... And Then THIS Happened', platform: 'tiktok', score: 95, impressions: 52000 },
    { id: 't10', text: 'Top 5 Clutch Plays — #3 Will Make You Uninstall', platform: 'youtube', score: 78, impressions: 18000 },
  ],
  funny: [
    { id: 't11', text: 'When The Hit Registration Just Says NO 💀', platform: 'tiktok', score: 96, impressions: 58000 },
    { id: 't12', text: 'Funniest Rage Moment I\'ve Ever Seen In Gaming', platform: 'youtube', score: 84, impressions: 26000 },
    { id: 't13', text: 'This Streamer\'s Reaction Is EVERYTHING 😂', platform: 'instagram', score: 88, impressions: 34000 },
    { id: 't14', text: 'POV: You\'re Having The Worst Game Of Your Life', platform: 'tiktok', score: 90, impressions: 40000 },
    { id: 't15', text: 'I Can\'t Stop Watching This Clip LMAOOO', platform: 'twitter', score: 82, impressions: 24000 },
    { id: 't16', text: 'The Exact Moment This Streamer Lost His Mind', platform: 'youtube', score: 79, impressions: 20000 },
    { id: 't17', text: 'Chat Went ABSOLUTELY Wild After This 😭', platform: 'tiktok', score: 87, impressions: 31000 },
    { id: 't18', text: 'This Is Why I Love Gaming: Pure Chaos Edition', platform: 'instagram', score: 80, impressions: 22000 },
    { id: 't19', text: '10 Seconds Of Pure Comedy Gold 🎭', platform: 'tiktok', score: 91, impressions: 43000 },
    { id: 't20', text: 'The Funniest Fail In Gaming History (Probably)', platform: 'youtube', score: 76, impressions: 16000 },
  ],
};

const HOOK_VARIATIONS: HookVariation[] = [
  { id: 'h1', text: 'You won\'t believe what happens at the 15-second mark...', type: 'curiosity_gap', platform: 'tiktok', predictedRetention: 92 },
  { id: 'h2', text: 'What if I told you this was a 1-in-a-million play?', type: 'question', platform: 'tiktok', predictedRetention: 87 },
  { id: 'h3', text: 'This is the greatest clutch in gaming history. Period.', type: 'bold_statement', platform: 'youtube', predictedRetention: 84 },
  { id: 'h4', text: 'Pros are calling this play "impossible." I did it anyway.', type: 'controversial', platform: 'twitter', predictedRetention: 90 },
  { id: 'h5', text: 'I literally cried when this happened. You will too.', type: 'emotional', platform: 'instagram', predictedRetention: 88 },
  { id: 'h6', text: 'Stop scrolling. This clip will change how you play.', type: 'curiosity_gap', platform: 'tiktok', predictedRetention: 85 },
  { id: 'h7', text: 'How did I survive this? Even I don\'t know. 😳', type: 'question', platform: 'instagram', predictedRetention: 82 },
  { id: 'h8', text: 'Every pro player needs to watch this right now.', type: 'bold_statement', platform: 'linkedin', predictedRetention: 78 },
  { id: 'h9', text: 'Hot take: clutches are more luck than skill. Fight me.', type: 'controversial', platform: 'twitter', predictedRetention: 91 },
  { id: 'h10', text: 'After 5 years of gaming, this is my proudest moment.', type: 'emotional', platform: 'youtube', predictedRetention: 80 },
];

const DESCRIPTION_VARIATIONS: HookDescription[] = [
  {
    id: 'd1',
    text: 'This insane 1v5 clutch happened during an overtime match in Valorant. With 0.1 seconds left, an impossible play turned the entire game around. The chat exploded with over 500 messages per second. Want to see more clutch moments? Drop a follow! 🎮🔥 #Valorant #Clutch #Gaming',
    length: 'long',
  },
  {
    id: 'd2',
    text: 'The most insane 1v5 clutch you\'ll see today. Overtime. One life. No room for error. And then... magic happens. 🔥',
    length: 'medium',
  },
  {
    id: 'd3',
    text: '1v5 clutch in overtime. Watch until the end. 😳🔥',
    length: 'short',
  },
];

const HASHTAG_DATA: HookHashtag[] = [
  { text: '#Valorant', category: 'niche', volume: 'high' },
  { text: '#Clutch', category: 'niche', volume: 'high' },
  { text: '#Gaming', category: 'broad', volume: 'high' },
  { text: '#FYP', category: 'trending', volume: 'high' },
  { text: '#Viral', category: 'trending', volume: 'high' },
  { text: '#GamerLife', category: 'broad', volume: 'medium' },
  { text: '#Streamer', category: 'broad', volume: 'medium' },
  { text: '#PlayOfTheDay', category: 'niche', volume: 'medium' },
  { text: '#ProGamer', category: 'niche', volume: 'medium' },
  { text: '#GamingCommunity', category: 'broad', volume: 'medium' },
  { text: '#Esports', category: 'niche', volume: 'high' },
  { text: '#OneTap', category: 'niche', volume: 'low' },
  { text: '#Insane', category: 'trending', volume: 'medium' },
  { text: '#NoScope', category: 'niche', volume: 'low' },
  { text: '#GamingClips', category: 'broad', volume: 'high' },
];

const SEO_KEYWORDS: HookSEOKeyword[] = [
  { keyword: 'valorant clutch compilation', searchVolume: 'high', competition: 'high' },
  { keyword: 'best gaming moments 2026', searchVolume: 'high', competition: 'medium' },
  { keyword: '1v5 clutch overtime', searchVolume: 'medium', competition: 'low' },
  { keyword: 'insane gaming highlights', searchVolume: 'high', competition: 'high' },
  { keyword: 'valorant pro plays', searchVolume: 'medium', competition: 'medium' },
  { keyword: 'gaming clips that went viral', searchVolume: 'medium', competition: 'low' },
  { keyword: 'fps clutch moments', searchVolume: 'medium', competition: 'medium' },
  { keyword: 'streamer highlights 2026', searchVolume: 'low', competition: 'low' },
];

// ── Generate mock result ──

export function generateMockHookResult(
  clipId: string,
  clipTitle: string,
  _platforms: HookPlatform[],
  _tone: HookTone,
): HookGenerationResult {
  // Pick a theme based on clip title keywords
  const theme = clipTitle.toLowerCase().includes('clutch')
    ? 'clutch'
    : clipTitle.toLowerCase().includes('funny') || clipTitle.toLowerCase().includes('rage')
      ? 'funny'
      : 'clutch';

  return {
    id: `hook-${Date.now()}`,
    clipId,
    clipTitle,
    titles: TITLE_VARIATIONS[theme] || TITLE_VARIATIONS.clutch,
    hooks: HOOK_VARIATIONS,
    descriptions: DESCRIPTION_VARIATIONS,
    hashtags: HASHTAG_DATA,
    seoKeywords: SEO_KEYWORDS,
    generatedAt: new Date().toISOString(),
  };
}
