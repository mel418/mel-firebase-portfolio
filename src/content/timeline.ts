import { experience } from './experience';
import type { TimelineEntry } from './types';

const work = (slug: string) => experience.find((e) => e.slug === slug)!;
const target = work('target-fulfillment-expert');
const esports = work('csulb-esports-web-developer');

/**
 * The career timeline. Work entries reuse the résumé wording and dates from
 * experience.ts; the CSULB span starts at Fall 2022, the first CSULB term on
 * the transcript (the exact start month is approximate) and ends at the Dec
 * 2025 degree; project and hackathon dates come from the projects list.
 * Order doesn't matter here — the component sorts by start date.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'target',
    kind: 'work',
    start: target.start,
    end: target.end,
    short: 'Target',
    title: target.role,
    subtitle: `${target.company} · ${target.dateRange}`,
    detail: target.bullets[0],
  },
  {
    id: 'esports',
    kind: 'work',
    start: esports.start,
    end: esports.end,
    short: 'Esports',
    title: esports.role,
    subtitle: `${esports.company} · ${esports.dateRange}`,
    detail: esports.bullets[0],
  },
  {
    id: 'csulb',
    kind: 'school',
    start: '2022-08',
    end: '2025-12',
    short: 'CSULB',
    title: 'B.S. in Computer Science',
    subtitle: 'California State University, Long Beach · Fall 2022 – Dec 2025',
    detail: "3.66 GPA, President's List three times and Dean's List twice.",
  },
  {
    id: 'marinahacks',
    kind: 'hackathon',
    start: '2023-04',
    short: 'MarinaHacks',
    title: 'MarinaHacks · 2nd place',
    subtitle: 'Ser Tibbles, a Discord music bot · Apr 2023',
    detail: 'Built with a teammate in one all-nighter: a Discord bot that recommends five songs from a genre or a Spotify link.',
    projectSlug: 'ser-tibbles',
  },
  {
    id: 'cafinity',
    kind: 'project',
    start: '2025-01',
    end: '2025-05',
    short: 'Cafinity',
    title: 'Cafinity',
    subtitle: 'Senior capstone, team of five · Jan – May 2025',
    detail: 'A cafe discovery app with map search, amenity filters and AI-moderated reviews. I built the notification system and the admin dashboard.',
    projectSlug: 'cafinity',
  },
  {
    id: 'pennysprout',
    kind: 'project',
    start: '2025-06',
    end: 'present',
    short: 'PennySprout',
    title: 'PennySprout',
    subtitle: 'Solo · Jun 2025 – Present',
    detail: 'A finance app where Claude reads bank statements, with Plaid bank linking, Stripe subscriptions and Row Level Security on every table.',
    projectSlug: 'pennysprout',
  },
  {
    id: 'kiosk',
    kind: 'project',
    start: '2025-07',
    end: 'present',
    short: 'Matcha Kiosk',
    title: 'Matcha Order Kiosk',
    subtitle: 'Solo · Jul 2025 – Present',
    detail: 'A real-time ordering system that handled 200+ orders at a corporate event, re-architected in 2026 on Supabase Realtime and built offline-first.',
    projectSlug: 'modo-matcha',
  },
  {
    id: 'rift-rewind',
    kind: 'hackathon',
    start: '2025-09',
    short: 'Rift Rewind',
    title: 'Rift Rewind hackathon',
    subtitle: 'AWS Bedrock · Sep 2025',
    detail: 'AI-coached League of Legends season recaps delivered in Discord, using Claude on AWS Bedrock with DynamoDB caching.',
    projectSlug: 'rift-rewind',
  },
  {
    id: 'sales-scout',
    kind: 'hackathon',
    start: '2026-09',
    short: 'AWS Agents',
    title: 'AWS Agents for Humans',
    subtitle: 'Modo Matcha Sales Scout · 2026',
    detail: 'An AI sales agent on the Strands Agents SDK and Amazon Bedrock that finds a real prospect, scores the fit and drafts the outreach email.',
    projectSlug: 'modo-matcha-sales-scout',
  },
];
