import type { ExperienceEntry } from './types';

/**
 * Role/company/dateRange/bullets preserved verbatim from the current site.
 * `start`/`end` are new sortable ISO fields alongside the authored
 * `dateRange` (kept as-is so "Present" still reads naturally). `summary` is
 * the one-line hover/collapsed state Phase 6's tracklist rows use.
 *
 * Array order matches the current site exactly — not strict chronological
 * order (Target's 2021 start is earliest but listed last) — since Phase 1
 * must not change the rendered order. Revisit in Phase 6.
 */
export const experience: ExperienceEntry[] = [
  {
    slug: 'csulb-esports-web-developer',
    trackNumber: 1,
    role: 'Web Developer',
    company: 'CSULB Esports Association',
    dateRange: 'Sep 2023 – Jul 2024',
    start: '2023-09',
    end: '2024-07',
    category: 'Engineering',
    summary: 'Refactored tournament infrastructure and built a self-serve registration system for 200+ users.',
    bullets: [
      'Cut tournament site query response time ~60% and reduced manual registration processing ~75% per season by refactoring PHP/MySQL queries with database indexes and building a self-serve signup system that handled 200+ users with automated roster validation.',
    ],
    stack: ['php', 'mysql'],
  },
  {
    slug: 'wic-secretary',
    trackNumber: 2,
    role: 'Secretary',
    company: 'Women in Computing (WiC) – CSULB',
    dateRange: 'Aug 2023 – Apr 2024',
    start: '2023-08',
    end: '2024-04',
    category: 'Leadership',
    summary: 'Grew workshop attendance ~45% with a monthly newsletter to 150+ members.',
    bullets: [
      'Grew workshop attendance ~45% over the year by running a monthly MailChimp newsletter to 150+ members with event spotlights and recap content.',
    ],
  },
  {
    slug: 'target-fulfillment-expert',
    trackNumber: 3,
    role: 'Fulfillment Expert',
    company: 'Target',
    dateRange: 'Aug 2021 – Present',
    start: '2021-08',
    end: 'present',
    category: 'Operations',
    summary: 'Processed high-volume online orders while hitting same-day fulfillment goals.',
    bullets: [
      'Met daily fulfillment deadlines in a high-volume store by accurately processing online orders, tracking inventory, restocking shelves, and coordinating shipping handoffs with team members.',
    ],
  },
];
