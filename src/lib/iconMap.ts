import {
  Monitor,
  Code,
  Palette,
  Globe,
  Smartphone,
  PenTool,
  Layout,
  BarChart3,
  Users,
  Smile,
  Award,
  Settings,
  Star,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Code,
  Palette,
  Globe,
  Smartphone,
  PenTool,
  Layout,
  BarChart3,
  Users,
  Smile,
  Award,
  Settings,
  Star,
  Shield,
}

export function getIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || Monitor // fallback to Monitor if icon not found
}
