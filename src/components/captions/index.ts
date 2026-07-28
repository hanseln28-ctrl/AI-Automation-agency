export { CaptionStylePicker } from './caption-style-picker';
export { CaptionPreview } from './caption-preview';
export { CaptionEditor } from './caption-editor';
export { CaptionSettingsPanel } from './caption-settings';
export { SpeakerDetection } from './speaker-detection';
export { CaptionExport } from './caption-export';

// Types
export type {
  CaptionStyle,
  CaptionPosition,
  CaptionAnimation,
  CaptionBackground,
  CaptionStatus,
  CaptionExportFormat,
  CaptionLine,
  CaptionSettings,
  CaptionProject,
  CaptionStyleConfig,
} from './types';

export {
  CAPTION_STYLE_CONFIGS,
  CAPTION_POSITION_CONFIG,
  CAPTION_ANIMATION_CONFIG,
  CAPTION_BACKGROUND_CONFIG,
  CAPTION_EXPORT_FORMATS,
} from './types';

export {
  MOCK_CAPTION_PROJECTS,
  getCaptionProjectById,
  getCaptionProjectsByClipId,
} from './mock-data';
