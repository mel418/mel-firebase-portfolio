import type { NavTrack } from './types';

/**
 * Single source of truth for the six sections. Previously duplicated
 * independently in AppSidebar.tsx, MobileBottomNav.tsx, and the SECTION_IDS
 * array hardcoded inside use-active-section.ts — all three now derive from
 * this list.
 */
export const navTracks: NavTrack[] = [
  { id: 'profile', trackNumber: '01', label: 'Melody Gatan', mobileLabel: 'Profile', sublabel: 'Developer', iconName: 'User', href: '/#profile' },
  { id: 'projects', trackNumber: '02', label: 'Projects', sublabel: 'Playlist', iconName: 'Play', href: '/#projects' },
  { id: 'experience', trackNumber: '03', label: 'Experience', sublabel: 'Playlist', iconName: 'Briefcase', href: '/#experience' },
  { id: 'skills', trackNumber: '04', label: 'Skills', sublabel: 'Collection', iconName: 'Code', href: '/#skills' },
  { id: 'education', trackNumber: '05', label: 'Education', sublabel: 'Playlist', iconName: 'GraduationCap', href: '/#education' },
  { id: 'contact', trackNumber: '06', label: 'Contact', sublabel: 'Playlist', iconName: 'Mail', href: '/#contact' },
];

export type SectionId = (typeof navTracks)[number]['id'];

export const sectionIds: SectionId[] = navTracks.map((t) => t.id);
