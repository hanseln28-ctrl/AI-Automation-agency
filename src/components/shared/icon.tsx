'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Bell,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clipboard,
  Clock,
  Cloud,
  Code,
  Command,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Flame,
  Folder,
  Globe,
  Grid,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Key,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Link,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquare,
  Mic,
  Minimize2,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Music,
  Palette,
  Pause,
  PenTool,
  Pencil,
  PieChart,
  Play,
  PlayCircle,
  Plus,
  Power,
  Radio,
  RefreshCw,
  Rocket,
  Save,
  Scissors,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShoppingCart,
  Sliders,
  Smile,
  Sparkles,
  Star,
  Sun,
  Tag,
  Target,
  Terminal,
  ThumbsDown,
  ThumbsUp,
  Timer,
  TrendingDown,
  TrendingUp,
  Trash2,
  Trophy,
  Tv2,
  Upload,
  User,
  Users,
  Video,
  Volume2,
  Wand2,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Map of all supported icon names to their lucide-react components.
 */
const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-up-right': ArrowUpRight,
  'bar-chart-2': BarChart2,
  'bar-chart-3': BarChart3,
  bell: Bell,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  'check-circle': CheckCircle,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  clipboard: Clipboard,
  clock: Clock,
  cloud: Cloud,
  code: Code,
  command: Command,
  copy: Copy,
  'credit-card': CreditCard,
  'dollar-sign': DollarSign,
  download: Download,
  edit: Edit,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  'file-text': FileText,
  filter: Filter,
  flame: Flame,
  folder: Folder,
  globe: Globe,
  grid: Grid,
  heart: Heart,
  'help-circle': HelpCircle,
  home: Home,
  image: Image,
  info: Info,
  key: Key,
  layers: Layers,
  'layout-dashboard': LayoutDashboard,
  lightbulb: Lightbulb,
  link: Link,
  list: List,
  'loader-2': Loader2,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  'maximize-2': Maximize2,
  menu: Menu,
  'message-circle': MessageCircle,
  'message-square': MessageSquare,
  mic: Mic,
  'minimize-2': Minimize2,
  monitor: Monitor,
  moon: Moon,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  music: Music,
  palette: Palette,
  pause: Pause,
  'pen-tool': PenTool,
  pencil: Pencil,
  'pie-chart': PieChart,
  play: Play,
  'play-circle': PlayCircle,
  plus: Plus,
  power: Power,
  radio: Radio,
  'refresh-cw': RefreshCw,
  rocket: Rocket,
  save: Save,
  scissors: Scissors,
  search: Search,
  send: Send,
  settings: Settings,
  'share-2': Share2,
  shield: Shield,
  'shopping-cart': ShoppingCart,
  sliders: Sliders,
  smile: Smile,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  tag: Tag,
  target: Target,
  terminal: Terminal,
  'thumbs-down': ThumbsDown,
  'thumbs-up': ThumbsUp,
  timer: Timer,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  'trash-2': Trash2,
  trophy: Trophy,
  'tv-2': Tv2,
  upload: Upload,
  user: User,
  users: Users,
  video: Video,
  'volume-2': Volume2,
  'wand-2': Wand2,
  x: X,
  zap: Zap,
};

export type IconName = keyof typeof iconMap;

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** The icon name (kebab-case matching lucide-react exports) */
  name: IconName;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Color token class (e.g. "text-accent", "text-success", "text-text-primary") */
  color?: string;
}

const sizeMap: Record<string, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
};

/**
 * Dynamic icon component — loads any icon by name from lucide-react.
 *
 * @example
 *   <Icon name="sparkles" size="lg" color="text-accent" />
 *   <Icon name="home" />
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 'md', color, className, ...props }, ref) => {
    const IconComponent = iconMap[name];

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in icon map.`);
      return null;
    }

    const sizeClass = typeof size === 'number' ? undefined : sizeMap[size];
    const numericSize = typeof size === 'number' ? size : undefined;
    const defaultColor = color ?? 'text-text-primary';

    return (
      <IconComponent
        ref={ref}
        className={cn(sizeClass, defaultColor, className)}
        style={numericSize ? { width: numericSize, height: numericSize } : undefined}
        {...props}
      />
    );
  },
);
Icon.displayName = 'Icon';

/**
 * Helper to check if an icon name is valid.
 */
export function isValidIconName(name: string): name is IconName {
  return name in iconMap;
}

export { iconMap };
