import type { MockPost } from './types';

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'post-001',
    clipId: 'clip-004',
    clipTitle: 'INSANE 1v5 Clutch — You Won\'t Believe This',
    thumbnailGradient: 'from-[#53FC18] via-[#10B981] to-[#0A0A0F]',
    platforms: ['tiktok', 'instagram', 'youtube_shorts'],
    platformEntries: [
      { platform: 'tiktok', caption: 'You won\'t believe this 1v5 clutch... 🤯 #Valorant #Gaming #Clutch', hashtags: ['#Valorant', '#Gaming', '#Clutch', '#FYP'], settings: { allowComments: true, allowDuet: true, allowStitch: true } },
      { platform: 'instagram', caption: 'INSANE 1v5 clutch moment! 🤯 Drop a 🔥 if you\'d be shaking!', hashtags: ['#Valorant', '#Gaming', '#Clutch', '#Reels'], settings: { shareToFeed: true, postToReels: true } },
      { platform: 'youtube_shorts', caption: '1v5 clutch you WON\'T believe! #Shorts', hashtags: ['#Valorant', '#Gaming', '#Clutch', '#Shorts'], settings: { category: 'Gaming', madeForKids: false } },
    ],
    primaryCaption: 'INSANE 1v5 Clutch — You Won\'t Believe This',
    scheduledTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    status: 'scheduled',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'post-002',
    clipId: 'clip-001',
    clipTitle: 'Hilarious Rage Quit Reaction Compilation',
    thumbnailGradient: 'from-[#F59E0B] via-[#EF4444] to-[#0A0A0F]',
    platforms: ['tiktok', 'x', 'discord'],
    platformEntries: [
      { platform: 'tiktok', caption: 'The rage quit heard around the world 😂💀 #RageQuit #Gaming #Funny', hashtags: ['#RageQuit', '#Gaming', '#Funny', '#FYP'], settings: { allowComments: true, allowDuet: false, allowStitch: true } },
      { platform: 'x', caption: 'When the game fights back... 😤🎮', hashtags: ['#Gaming', '#Rage', '#Funny'], settings: { threadMode: false } },
      { platform: 'discord', caption: 'Check out this rage quit compilation! 😂', hashtags: [], settings: {} },
    ],
    primaryCaption: 'Hilarious Rage Quit Reaction Compilation',
    scheduledTime: new Date(new Date().setHours(16, 30, 0, 0)).toISOString(),
    status: 'scheduled',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'post-003',
    clipId: 'clip-007',
    clipTitle: 'EPIC Fail Moment — You Had One Job',
    thumbnailGradient: 'from-[#F97316] via-[#EF4444] to-[#0A0A0F]',
    platforms: ['tiktok', 'facebook', 'instagram'],
    platformEntries: [
      { platform: 'tiktok', caption: 'One job. ONE JOB. 💀 #Fail #Funny #Gaming', hashtags: ['#Fail', '#Funny', '#Gaming', '#FYP'], settings: { allowComments: true, allowDuet: true, allowStitch: true } },
      { platform: 'facebook', caption: 'When you had ONE job... 💀😂 Who can relate?', hashtags: ['#Fail', '#Funny', '#Gaming'], settings: {} },
      { platform: 'instagram', caption: 'One job. ONE JOB. 💀', hashtags: ['#Fail', '#Funny', '#Gaming'], settings: { shareToFeed: true, postToReels: true } },
    ],
    primaryCaption: 'EPIC Fail Moment — You Had One Job',
    scheduledTime: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    status: 'scheduled',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'post-004',
    clipId: 'clip-010',
    clipTitle: 'TikTok Behind the Scenes — Creator Meetup',
    thumbnailGradient: 'from-[#333333] via-[#1A1A1A] to-[#0A0A0F]',
    platforms: ['tiktok', 'threads', 'x'],
    platformEntries: [
      { platform: 'tiktok', caption: 'Running into your favorite creator at TwitchCon 😂✨ #TwitchCon #CreatorMeetup', hashtags: ['#TwitchCon', '#CreatorMeetup', '#FYP'], settings: { allowComments: true, allowDuet: true, allowStitch: false } },
      { platform: 'threads', caption: 'When you run into your favorite creator at TwitchCon 😂 The energy was unreal!', hashtags: ['#TwitchCon', '#CreatorMeetup'], settings: {} },
      { platform: 'x', caption: 'TwitchCon meetup energy was UNREAL ⚡️', hashtags: ['#TwitchCon', '#CreatorMeetup'], settings: { threadMode: false } },
    ],
    primaryCaption: 'TikTok Behind the Scenes — Creator Meetup',
    scheduledTime: new Date(new Date().setHours(20, 15, 0, 0)).toISOString(),
    status: 'scheduled',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: 'post-005',
    clipId: 'clip-011',
    clipTitle: 'Podcast Hot Take Goes Viral',
    thumbnailGradient: 'from-[#6B7280] via-[#4B5563] to-[#0A0A0F]',
    platforms: ['linkedin', 'x', 'facebook'],
    platformEntries: [
      { platform: 'linkedin', caption: 'Hot take on the creator economy: "The real money isn\'t in views — it\'s in community ownership." Thoughts? 💭', hashtags: ['#CreatorEconomy', '#ContentStrategy', '#DigitalMedia'], settings: {} },
      { platform: 'x', caption: 'This take on the creator economy is SPICY 🌶️', hashtags: ['#CreatorEconomy', '#Podcast', '#HotTake'], settings: { threadMode: true } },
      { platform: 'facebook', caption: 'Spicy take from our latest podcast episode on the creator economy. What do you think? 🌶️', hashtags: ['#CreatorEconomy', '#Podcast', '#Discussion'], settings: {} },
    ],
    primaryCaption: 'Podcast Hot Take Goes Viral',
    scheduledTime: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    status: 'scheduled',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 'post-006',
    clipId: 'clip-008',
    clipTitle: 'Keyboard Smash Rage Compilation',
    thumbnailGradient: 'from-[#EF4444] via-[#6C5CE7] to-[#0A0A0F]',
    platforms: ['youtube_shorts', 'tiktok'],
    platformEntries: [
      { platform: 'youtube_shorts', caption: 'When the enemy team has aimbot... you SURE about that? 😤 #Shorts', hashtags: ['#Valorant', '#Rage', '#Gaming', '#Shorts'], settings: { category: 'Gaming', madeForKids: false } },
      { platform: 'tiktok', caption: 'You SURE about that aim? 😤🎯 #Valorant #Rage #Gaming', hashtags: ['#Valorant', '#Rage', '#Gaming', '#FYP'], settings: { allowComments: true, allowDuet: true, allowStitch: true } },
    ],
    primaryCaption: 'Keyboard Smash Rage Compilation',
    scheduledTime: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
    status: 'scheduled',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
  },
  // ── Published Posts ──
  {
    id: 'post-007',
    clipId: 'clip-004',
    clipTitle: 'INSANE 1v5 Clutch — You Won\'t Believe This',
    thumbnailGradient: 'from-[#53FC18] via-[#10B981] to-[#0A0A0F]',
    platforms: ['tiktok', 'instagram'],
    platformEntries: [
      { platform: 'tiktok', caption: 'You won\'t believe this 1v5 clutch... 🤯 #Valorant #Gaming #Clutch', hashtags: ['#Valorant', '#Gaming', '#Clutch'], settings: {} },
      { platform: 'instagram', caption: 'INSANE 1v5 clutch! 🤯', hashtags: ['#Valorant', '#Gaming', '#Clutch'], settings: {} },
    ],
    primaryCaption: 'INSANE 1v5 Clutch — You Won\'t Believe This',
    scheduledTime: new Date(Date.now() - 172800000).toISOString(),
    status: 'published',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'post-008',
    clipId: 'clip-003',
    clipTitle: '$500 Donation Reaction — Streamer CRIES',
    thumbnailGradient: 'from-[#06B6D4] via-[#3B82F6] to-[#0A0A0F]',
    platforms: ['tiktok', 'youtube_shorts', 'facebook'],
    platformEntries: [
      { platform: 'tiktok', caption: '$500 donation reaction 😭❤️ #Wholesome #Streamer', hashtags: ['#Wholesome', '#Streamer', '#Donation'], settings: {} },
      { platform: 'youtube_shorts', caption: 'Streamer cries after $500 donation ❤️ #Shorts', hashtags: ['#Wholesome', '#Streamer', '#Shorts'], settings: {} },
      { platform: 'facebook', caption: 'This is what community means ❤️😭', hashtags: ['#Wholesome', '#Streamer', '#Community'], settings: {} },
    ],
    primaryCaption: '$500 Donation Reaction — Streamer CRIES',
    scheduledTime: new Date(Date.now() - 345600000).toISOString(),
    status: 'published',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
  },
  // ── Failed Posts ──
  {
    id: 'post-009',
    clipId: 'clip-002',
    clipTitle: 'Funny Chat Reaction — Chill Stream Moments',
    thumbnailGradient: 'from-[#3B82F6] via-[#EC4899] to-[#0A0A0F]',
    platforms: ['tiktok', 'instagram'],
    platformEntries: [
      { platform: 'tiktok', caption: 'Chat was UNHINGED today 😂💀', hashtags: ['#Streamer', '#Chat', '#Funny'], settings: {} },
      { platform: 'instagram', caption: 'When chat goes wild 😂', hashtags: ['#Streamer', '#Chat', '#Funny'], settings: {} },
    ],
    primaryCaption: 'Funny Chat Reaction — Chill Stream Moments',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'failed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    errorMessage: 'Instagram API rate limit exceeded. Please try again in 15 minutes.',
    retryCount: 1,
  },
  {
    id: 'post-010',
    clipId: 'clip-006',
    clipTitle: 'Victory Dance Compilation — Rank Up Hype',
    thumbnailGradient: 'from-[#6C5CE7] via-[#EC4899] to-[#0A0A0F]',
    platforms: ['youtube_shorts'],
    platformEntries: [
      { platform: 'youtube_shorts', caption: 'RANK UP HYPE! 🎉🏆', hashtags: ['#Gaming', '#RankUp', '#Victory'], settings: {} },
    ],
    primaryCaption: 'Victory Dance Compilation — Rank Up Hype',
    scheduledTime: new Date(Date.now() - 216000000).toISOString(),
    status: 'failed',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    errorMessage: 'YouTube API authentication token expired. Please reconnect your YouTube account.',
    retryCount: 2,
  },
  // ── Drafts ──
  {
    id: 'post-011',
    clipId: 'clip-005',
    clipTitle: 'Emotional End-of-Stream Speech',
    thumbnailGradient: 'from-[#EC4899] via-[#F97316] to-[#0A0A0F]',
    platforms: ['tiktok', 'instagram', 'youtube_shorts', 'x'],
    platformEntries: [
      { platform: 'tiktok', caption: '', hashtags: [], settings: { allowComments: true, allowDuet: true, allowStitch: true } },
      { platform: 'instagram', caption: '', hashtags: [], settings: { shareToFeed: true, postToReels: true } },
      { platform: 'youtube_shorts', caption: '', hashtags: [], settings: { category: 'Gaming', madeForKids: false } },
      { platform: 'x', caption: '', hashtags: [], settings: {} },
    ],
    primaryCaption: '',
    scheduledTime: '',
    status: 'draft',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ── Helper ──
export function getPostById(id: string): MockPost | undefined {
  return MOCK_POSTS.find((p) => p.id === id);
}

export function getPostsByStatus(status: MockPost['status']): MockPost[] {
  return MOCK_POSTS.filter((p) => p.status === status);
}

export function getPostsByDate(date: Date): MockPost[] {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return MOCK_POSTS.filter((p) => {
    if (!p.scheduledTime) return false;
    const t = new Date(p.scheduledTime);
    return t >= start && t <= end;
  });
}

// ── Mock clips for post creation media selector ──
export const MOCK_CLIPS_FOR_POST = [
  { id: 'clip-001', title: 'Hilarious Rage Quit Reaction Compilation', thumbnailGradient: 'from-[#F59E0B] via-[#EF4444] to-[#0A0A0F]', duration: 30 },
  { id: 'clip-002', title: 'Funny Chat Reaction — Chill Stream Moments', thumbnailGradient: 'from-[#3B82F6] via-[#EC4899] to-[#0A0A0F]', duration: 15 },
  { id: 'clip-003', title: '$500 Donation Reaction — Streamer CRIES', thumbnailGradient: 'from-[#06B6D4] via-[#3B82F6] to-[#0A0A0F]', duration: 60 },
  { id: 'clip-004', title: 'INSANE 1v5 Clutch — You Won\'t Believe This', thumbnailGradient: 'from-[#53FC18] via-[#10B981] to-[#0A0A0F]', duration: 30 },
  { id: 'clip-005', title: 'Emotional End-of-Stream Speech', thumbnailGradient: 'from-[#EC4899] via-[#F97316] to-[#0A0A0F]', duration: 60 },
  { id: 'clip-007', title: 'EPIC Fail Moment — You Had One Job', thumbnailGradient: 'from-[#F97316] via-[#EF4444] to-[#0A0A0F]', duration: 15 },
  { id: 'clip-008', title: 'Keyboard Smash Rage Compilation', thumbnailGradient: 'from-[#EF4444] via-[#6C5CE7] to-[#0A0A0F]', duration: 30 },
  { id: 'clip-010', title: 'TikTok Behind the Scenes — Creator Meetup', thumbnailGradient: 'from-[#333333] via-[#1A1A1A] to-[#0A0A0F]', duration: 30 },
  { id: 'clip-011', title: 'Podcast Hot Take Goes Viral', thumbnailGradient: 'from-[#6B7280] via-[#4B5563] to-[#0A0A0F]', duration: 60 },
];
