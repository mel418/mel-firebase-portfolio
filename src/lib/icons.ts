import { User, Play, Briefcase, Code, GraduationCap, Mail, type LucideIcon } from 'lucide-react';

/**
 * Resolves the string icon names stored in src/content/nav.ts (content is
 * pure serializable data — no component references allowed) to actual
 * lucide-react components. Keep in sync with NavTrack['iconName'] values.
 */
export const navIconRegistry: Record<string, LucideIcon> = {
  User,
  Play,
  Briefcase,
  Code,
  GraduationCap,
  Mail,
};
