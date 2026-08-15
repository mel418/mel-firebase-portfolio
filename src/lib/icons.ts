import { User, Play, Briefcase, Code, GraduationCap, Mail, type LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';
import {
  SiJavascript, SiTypescript, SiPython, SiOpenjdk, SiCplusplus, SiSharp, SiKotlin,
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiTailwindcss, SiHtml5, SiCss3, SiPhp,
  SiMysql, SiFirebase, SiMongodb, SiGit, SiAmazonwebservices, SiLinux,
} from '@icons-pack/react-simple-icons';

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

/**
 * Resolves src/content/skills.ts's `iconSlug` (or `id` as fallback) to a
 * real local SVG component — replaces 23 hotlinked skillicons.dev <img>
 * requests (Phase 7) with brand icons already shipped by the
 * @icons-pack/react-simple-icons dependency used elsewhere for the
 * Spotify glyph. Simple Icons doesn't ship every brand: "java" maps to
 * OpenJDK's icon (closest available, not a literal coffee cup) and
 * "vscode" has no entry at all — that one skill renders as a text-only
 * chip (Skill.iconSlug is already optional for exactly this case)
 * rather than force-fitting a misleading substitute or keeping a lone
 * external request just for one icon.
 */
export const skillIconRegistry: Record<string, ComponentType<{ className?: string }>> = {
  js: SiJavascript,
  ts: SiTypescript,
  python: SiPython,
  java: SiOpenjdk,
  cpp: SiCplusplus,
  cs: SiSharp,
  kotlin: SiKotlin,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  express: SiExpress,
  tailwind: SiTailwindcss,
  html: SiHtml5,
  css: SiCss3,
  php: SiPhp,
  mysql: SiMysql,
  firebase: SiFirebase,
  mongodb: SiMongodb,
  git: SiGit,
  aws: SiAmazonwebservices,
  linux: SiLinux,
};
