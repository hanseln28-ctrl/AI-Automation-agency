// ── Captions Types & Config ──

export type CaptionStyle = 'kinetic' | 'minimal' | 'bold' | 'emoji' | 'custom';
export type CaptionPosition = 'bottom' | 'center' | 'top';
export type CaptionAnimation = 'pop' | 'fade' | 'slide' | 'typewriter';
export type CaptionBackground = 'none' | 'semi' | 'box';
export type CaptionStatus = 'draft' | 'generated' | 'edited' | 'applied';
export type CaptionExportFormat = 'srt' | 'vtt' | 'ass' | 'burned_in';

export interface CaptionLine {
  id: string;
  speakerLabel: string;
  startTime: string; // "mm:ss.ms"
  endTime: string;
  text: string;
  emoji?: string;
}

export interface CaptionSettings {
  fontSize: number; // 12-48
  fontColor: string;
  background: CaptionBackground;
  position: CaptionPosition;
  animation: CaptionAnimation;
}

export interface CaptionProject {
  id: string;
  clipId: string;
  clipTitle: string;
  thumbnailGradient: string;
  style: CaptionStyle;
  language: string;
  wordCount: number;
  status: CaptionStatus;
  lines: CaptionLine[];
  settings: CaptionSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CaptionStyleConfig {
  key: CaptionStyle;
  label: string;
  description: string;
  gradient: string;
  icon: string;
  previewText: string;
}

export const CAPTION_STYLE_CONFIGS: CaptionStyleConfig[] = [
  {
    key: 'kinetic',
    label: 'Kinetic',
    description: 'Word-by-word animated, bold fonts',
    gradient: 'from-[#6C5CE7] via-[#8B7CF7] to-[#A78BFA]',
    icon: 'zap',
    previewText: '⚡ WORD BY WORD',
  },
  {
    key: 'minimal',
    label: 'Minimal',
    description: 'Clean thin text, subtle presence',
    gradient: 'from-[#A1A1AA] via-[#D4D4D8] to-[#E4E4E7]',
    icon: 'minimize-2',
    previewText: 'clean & simple',
  },
  {
    key: 'bold',
    label: 'Bold',
    description: 'Large text, high contrast impact',
    gradient: 'from-[#FAFAFA] via-[#FFFFFF] to-[#E4E4E7]',
    icon: 'maximize-2',
    previewText: 'BOLD STATEMENT',
  },
  {
    key: 'emoji',
    label: 'Emoji',
    description: 'Emoji-rich, playful captions',
    gradient: 'from-[#F59E0B] via-[#F97316] to-[#EC4899]',
    icon: 'smile',
    previewText: '🔥👀💯 SO PLAYFUL',
  },
  {
    key: 'custom',
    label: 'Custom',
    description: 'Your own style, fully configurable',
    gradient: 'from-[#6C5CE7] via-[#10B981] to-[#F59E0B]',
    icon: 'sliders',
    previewText: 'Custom Style ✨',
  },
];

export const CAPTION_POSITION_CONFIG: Record<CaptionPosition, { label: string }> = {
  bottom: { label: 'Bottom' },
  center: { label: 'Center' },
  top: { label: 'Top' },
};

export const CAPTION_ANIMATION_CONFIG: Record<CaptionAnimation, { label: string }> = {
  pop: { label: 'Pop In' },
  fade: { label: 'Fade' },
  slide: { label: 'Slide Up' },
  typewriter: { label: 'Typewriter' },
};

export const CAPTION_BACKGROUND_CONFIG: Record<CaptionBackground, { label: string }> = {
  none: { label: 'None' },
  semi: { label: 'Semi-transparent' },
  box: { label: 'Solid Box' },
};

export const CAPTION_EXPORT_FORMATS: { format: CaptionExportFormat; label: string; extension: string; description: string }[] = [
  { format: 'srt', label: 'SRT', extension: '.srt', description: 'SubRip — YouTube, Vimeo, most editors' },
  { format: 'vtt', label: 'VTT', extension: '.vtt', description: 'WebVTT — HTML5 video, browsers' },
  { format: 'ass', label: 'ASS', extension: '.ass', description: 'Advanced SubStation — styled subtitles' },
  { format: 'burned_in', label: 'Burned-in', extension: '.mp4', description: 'Hard-coded into the video file' },
];
