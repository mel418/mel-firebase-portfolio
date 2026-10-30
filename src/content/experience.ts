import type { ExperienceEntry } from './types';

/**
 * Wording follows the resume (Melody_Gatan_Resume.pdf), in the resume's
 * order. The earlier site carried extra numbers that the resume does not —
 * "~60% faster queries", "~75% less manual processing", "~45% attendance
 * growth" — and a Women in Computing secretary role. They were dropped so the
 * portfolio and resume never disagree; restore from git history if they can
 * be backed up.
 */
export const experience: ExperienceEntry[] = [
  {
    slug: 'target-fulfillment-expert',
    trackNumber: 1,
    role: 'Fulfillment Expert',
    company: 'Target',
    dateRange: 'Aug 2021 – Present',
    start: '2021-08',
    end: 'present',
    category: 'Operations',
    summary: 'Same-day order fulfillment under tight time windows for 4+ years.',
    bullets: [
      'Fulfilled same-day orders under tight time windows for 4+ years, keeping inventory accurate through busy stretches.',
    ],
  },
  {
    slug: 'csulb-esports-web-developer',
    trackNumber: 2,
    role: 'Web Developer',
    company: 'CSULB Esports Association',
    dateRange: 'Sep 2023 – Jul 2024',
    start: '2023-09',
    end: '2024-07',
    category: 'Engineering',
    summary: 'Replaced manual tournament sign-up with a self-service registration page.',
    bullets: [
      'Developed a self-service registration page to replace manual tournament sign-up, so organizers no longer entered player info by hand, and restructured the underlying PHP/MySQL queries.',
    ],
    stack: ['php', 'mysql'],
  },
];
