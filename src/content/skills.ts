import type { Skill, SkillGroup } from './types';

/**
 * What the Skills section actually displays — the resume's own four groups,
 * verbatim, plus the languages/tools from coursework that the resume leaves
 * out. Plain strings on purpose: these are things Melody says she can do,
 * while `skills` below is the typed index that project stacks reference.
 */
export const skillGroups: SkillGroup[] = [
  { label: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML', 'CSS'] },
  { label: 'Frameworks & libraries', items: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Recharts'] },
  { label: 'Data & infrastructure', items: ['PostgreSQL (Supabase)', 'Firebase / Firestore', 'Git', 'Vercel', 'Row Level Security'] },
  { label: 'APIs & platforms', items: ['Stripe', 'Plaid', 'Twilio', 'Claude API', 'OpenAI API', 'AWS (Bedrock, DynamoDB)', 'Google Maps API'] },
];

/** Coursework-level exposure, kept visibly secondary to the resume's groups. */
export const alsoWorkedWith = ['Java', 'C++', 'C#', 'Kotlin', 'PHP', 'MySQL', 'MongoDB', 'Linux'];

/**
 * Source of truth for every skill label referenced anywhere on the site —
 * both the visible grid tiles and the tech mentioned only inside project
 * stacks. Project.stack is SkillId[], not string[], so "Played on: N
 * projects" (Phase 7) is a derived count, not a hand-maintained number, and
 * a typo'd stack entry is a TypeScript error instead of a silent mismatch.
 *
 * `showInGrid: true` is exactly the 23 tiles the current site renders today
 * — unchanged, same order, same categories — so Phase 1 doesn't alter the
 * Skills section screenshot. Everything added for the new/updated project
 * stacks (Clerk, Supabase, Claude AI, PyTorch, Docker, etc.) is
 * `showInGrid: false`: real data used for cross-referencing and the Phase 5
 * project-detail stack list, not yet promoted to its own grid tile. That's
 * a Phase 7 design decision, not a Phase 1 one.
 *
 * `iconSlug` defaults to `id` when omitted (see the render fallback in
 * page.tsx) — only set it when it differs, which today is exactly the
 * SQL/MySQL case: both use skillicons.dev's single `mysql` glyph, but
 * previously shared the *same* `id`, which is what let "played on" counts
 * silently conflate the two. They're distinct skills now.
 */
export const skills: Skill[] = [
  // ── Languages ──────────────────────────────────────────────────────────
  { id: 'js', name: 'JavaScript', category: 'languages', showInGrid: true },
  { id: 'ts', name: 'TypeScript', category: 'languages', showInGrid: true },
  { id: 'python', name: 'Python', category: 'languages', showInGrid: true },
  { id: 'java', name: 'Java', category: 'languages', showInGrid: true },
  { id: 'cpp', name: 'C++', category: 'languages', showInGrid: true },
  { id: 'cs', name: 'C#', category: 'languages', showInGrid: true },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', showInGrid: true },
  { id: 'sql', name: 'SQL', category: 'languages', iconSlug: 'mysql', showInGrid: true },

  // ── Web / frameworks ──────────────────────────────────────────────────
  { id: 'react', name: 'React', category: 'frameworks', showInGrid: true },
  { id: 'nextjs', name: 'Next.js', category: 'frameworks', showInGrid: true },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', showInGrid: true },
  { id: 'express', name: 'Express', category: 'frameworks', showInGrid: true },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frameworks', showInGrid: true },
  { id: 'html', name: 'HTML5', category: 'frameworks', showInGrid: true },
  { id: 'css', name: 'CSS3', category: 'frameworks', showInGrid: true },
  { id: 'php', name: 'PHP', category: 'frameworks', showInGrid: true },

  // ── Databases ─────────────────────────────────────────────────────────
  { id: 'mysql', name: 'MySQL', category: 'data', showInGrid: true },
  { id: 'firebase', name: 'Firebase', category: 'data', showInGrid: true },
  { id: 'mongodb', name: 'MongoDB', category: 'data', showInGrid: true },

  // ── Tools ─────────────────────────────────────────────────────────────
  { id: 'git', name: 'Git', category: 'tools', showInGrid: true },
  { id: 'vscode', name: 'VS Code', category: 'tools', showInGrid: true },
  { id: 'aws', name: 'AWS', category: 'tools', showInGrid: true },
  { id: 'linux', name: 'Linux', category: 'tools', showInGrid: true },

  // ── Cross-reference only (project stacks / liner notes — not yet grid tiles) ──
  { id: 'clerk', name: 'Clerk', category: 'frameworks', showInGrid: false },
  { id: 'supabase', name: 'Supabase', category: 'data', iconSlug: 'supabase', showInGrid: false },
  { id: 'claude', name: 'Claude AI', category: 'ai', showInGrid: false },
  { id: 'recharts', name: 'Recharts', category: 'frameworks', showInGrid: false },
  { id: 'dynamodb', name: 'DynamoDB', category: 'data', iconSlug: 'dynamodb', showInGrid: false },
  { id: 'riotapi', name: 'Riot API', category: 'tools', showInGrid: false },
  { id: 'pytorch', name: 'PyTorch', category: 'ai', iconSlug: 'pytorch', showInGrid: false },
  { id: 'colab', name: 'Google Colab', category: 'tools', showInGrid: false },
  { id: 'docker', name: 'Docker', category: 'tools', iconSlug: 'docker', showInGrid: false },
  { id: 'langchain', name: 'LangChain', category: 'ai', showInGrid: false },
  { id: 'astradb', name: 'Astra DB', category: 'data', showInGrid: false },
  { id: 'openai', name: 'OpenAI', category: 'ai', showInGrid: false },
  { id: 'vercelai', name: 'Vercel AI SDK', category: 'ai', showInGrid: false },
  { id: 'googlemaps', name: 'Google Maps API', category: 'tools', showInGrid: false },
  { id: 'puppeteer', name: 'Puppeteer', category: 'tools', showInGrid: false },
  { id: 'discord', name: 'Discord API', category: 'tools', iconSlug: 'discord', showInGrid: false },
  { id: 'spotify', name: 'Spotify API', category: 'tools', showInGrid: false },
  { id: 'vite', name: 'Vite', category: 'tools', iconSlug: 'vite', showInGrid: false },
  { id: 'stripe', name: 'Stripe', category: 'tools', showInGrid: false },
  { id: 'plaid', name: 'Plaid', category: 'tools', showInGrid: false },
  { id: 'twilio', name: 'Twilio', category: 'tools', showInGrid: false },
  { id: 'indexeddb', name: 'IndexedDB', category: 'data', showInGrid: false },
  { id: 'bedrock', name: 'Amazon Bedrock', category: 'ai', showInGrid: false },
  { id: 'strands', name: 'Strands Agents', category: 'ai', showInGrid: false },
  { id: 'tavily', name: 'Tavily', category: 'tools', showInGrid: false },
  { id: 'pywebview', name: 'pywebview', category: 'frameworks', showInGrid: false },
];
