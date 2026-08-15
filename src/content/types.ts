/**
 * Content layer type definitions.
 *
 * Hard rule: everything in src/content/ is pure, serializable data.
 * No React elements, no component references (icons are string keys
 * resolved by a client-side registry), no functions except the small
 * derivation helpers in index.ts. This is what lets content flow across
 * the server/client boundary anywhere it's needed without restriction.
 */

export type SocialLink = {
  type: 'github' | 'linkedin' | 'email' | 'devpost';
  label: string;
  href: string;
};

export type Artwork = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** HSL triplet, e.g. '142 34% 22%' — drives --album-tint on cards/detail */
  tint: string;
};

export type SkillCategory = 'languages' | 'frameworks' | 'data' | 'ai' | 'tools';

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  /** skillicons.dev slug today; swapped for a local icon registry key in Phase 7 */
  iconSlug?: string;
  /** false = exists for cross-referencing (e.g. "Played on: N projects") but not shown as its own tile in the grid */
  showInGrid: boolean;
};

export type SkillId = Skill['id'];

export type ProjectLink = {
  type: 'github' | 'live' | 'devpost';
  href: string;
};

export type ProjectStatus = 'live' | 'archived' | 'wip';

export type Project = {
  slug: string;
  trackNumber: number;
  title: string;
  tagline: string;
  description: string;
  /** Human-readable date range, authored (not computed) so "Present" reads naturally */
  year: string;
  role: string;
  /** Present for every project except CECS-327 — absence renders the text-forward card variant */
  artwork?: Artwork;
  /** HSL triplet — always present, even for artwork-less cards, so color still tracks the project */
  tint: string;
  stack: SkillId[];
  links: ProjectLink[];
  accolade?: string;
  featured?: boolean;
  status?: ProjectStatus;
};

export type LinerNotes = {
  built: string;
  why: string;
  challenges: string[];
  learned: string[];
};

export type ExperienceEntry = {
  slug: string;
  trackNumber: number;
  role: string;
  company: string;
  dateRange: string;
  /** ISO 'YYYY-MM' — sortable, distinct from the authored dateRange */
  start: string;
  end: string | 'present';
  category: string;
  /** One-line summary shown before a row is expanded */
  summary: string;
  bullets: string[];
  stack?: SkillId[];
};

export type Education = {
  school: string;
  degree: string;
  /** Compact chip form, e.g. "CSULB CS Grad '25" — used in the hero meta line and the context panel badges */
  shortLabel: string;
  location: string;
  graduated: string;
  gpa: string;
  coursework: string[];
  honors: string[];
  affiliations: string[];
};

export type SiteIdentity = {
  name: string;
  /** Short professional title — "Software Engineer" — used in the status pill and page metadata, distinct from the rotating `roles` line */
  title: string;
  roles: string[];
  location: string;
  status: string;
  bio: string;
  bioShort: string;
  email: string;
  resumeHref: string;
  avatar: Artwork;
  heroArtwork: Artwork;
  socials: SocialLink[];
};

export type NavTrack = {
  id: string;
  trackNumber: string;
  label: string;
  /** Shorter label for the mobile tab bar, where "Melody Gatan" would truncate — falls back to `label` when absent */
  mobileLabel?: string;
  sublabel: string;
  /** lucide-react icon name, resolved by the icon registry — never a component reference */
  iconName: string;
  href: string;
};
