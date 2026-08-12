import type { Project } from './types';

/**
 * The discography. Ordered by trackNumber (chronological, earliest first) —
 * that's the ordering Phase 5's Discography component uses. `featured`
 * controls the separate featured-project slot the current gallery renders
 * up top and is independent of track order (PennySprout is the most recent
 * production work, not the earliest, and stays featured).
 *
 * Tagline/description text for the six pre-existing projects is preserved
 * verbatim from the current site — untouched in this phase. Ser Tibbles and
 * CECS-327 are newly drafted in the same voice; both are placeholder-depth
 * until Phase 5's liner notes go deeper.
 *
 * `artwork` is optional — CECS-327 has no screenshot and no top-level
 * README in its repo, so it has none. `tint` is present on every project
 * regardless, so even an artwork-less card still carries project-specific
 * color (Phase 5's text-forward card variant).
 */
export const projects: Project[] = [
  {
    slug: 'ser-tibbles',
    trackNumber: 1,
    title: 'Ser Tibbles',
    tagline: 'A Discord bot that recommends new music by genre or Spotify link — built in one hackathon all-nighter.',
    description: "Built with a teammate for MarinaHacks: a Discord bot using the Spotify API (via Spotipy) to generate five song recommendations from a genre or a Spotify track/artist URL, authenticated through Spotify's client-credentials flow.",
    year: 'Apr 2023',
    role: 'Full-Stack Developer · Team of 2',
    artwork: {
      src: '/serTibbles.png',
      alt: 'Ser Tibbles Discord music recommendation bot',
      width: 1137,
      height: 728,
      tint: '235 30% 55%',
    },
    tint: '235 30% 55%',
    stack: ['python', 'discord', 'spotify'],
    links: [
      { type: 'devpost', href: 'https://devpost.com/software/discord-music-rec-bot-ser-tibbles' },
      { type: 'github', href: 'https://github.com/mel418/Discord-Music-Rec-Bot' },
    ],
    accolade: 'MarinaHacks 2023 · 2nd Place',
  },
  {
    slug: 'cafinity',
    trackNumber: 2,
    title: 'Cafinity',
    tagline: 'Discover cafes nearby, with AI auto-moderating every community submission.',
    description: 'A cafe discovery platform that cut manual review across 200+ listings with an OpenAI moderation pipeline, and surfaces nearby spots using Google Maps clustering with Haversine distance filtering.',
    year: 'Jan – May 2025',
    role: 'Full-Stack Developer · Team of 5',
    artwork: {
      src: '/cafinity.png',
      alt: 'Cafinity cafe discovery app',
      width: 1904,
      height: 918,
      tint: '25 35% 40%',
    },
    tint: '25 35% 40%',
    stack: ['react', 'vite', 'firebase', 'googlemaps', 'openai', 'tailwind', 'python'],
    links: [{ type: 'github', href: 'https://github.com/mel418/cafinity' }],
  },
  {
    slug: 'pennysprout',
    trackNumber: 3,
    title: 'PennySprout',
    tagline: 'Turns a messy bank-statement CSV into clear spending insights and a 1–10 financial health score.',
    description: "A full-stack finance analyzer that parses uploaded statements, routes transactions through the Claude API for categorization, and renders interactive breakdowns with Recharts — backed by Clerk auth and per-user CRUD for persistent data.",
    year: 'Jun 2025 – Present',
    role: 'Full-Stack Developer · Solo',
    artwork: {
      src: '/pennysprout_dash.png',
      alt: 'PennySprout finance dashboard',
      width: 1919,
      height: 912,
      tint: '100 30% 45%',
    },
    tint: '100 30% 45%',
    stack: ['nextjs', 'ts', 'claude', 'supabase', 'clerk', 'recharts', 'tailwind'],
    links: [
      { type: 'live', href: 'https://www.pennysprout.online/' },
      { type: 'github', href: 'https://github.com/mel418/PennySprout-v1' },
    ],
    featured: true,
    status: 'live',
  },
  {
    slug: 'rift-rewind',
    trackNumber: 4,
    title: 'Rift Rewind',
    tagline: 'Spotify Wrapped, but for League of Legends — AI-coached season recaps delivered in Discord.',
    description: 'Pulls a full season of Riot match history, aggregates win rate, KDA, and champion stats, then generates personalized coaching via Claude on AWS Bedrock — with DynamoDB caching to stay under Riot API rate limits.',
    year: 'Sep 2025',
    role: 'Full-Stack Developer · Solo',
    artwork: {
      src: '/league-wrapped-1.jpg',
      alt: 'Rift Rewind League of Legends season recap',
      width: 806,
      height: 508,
      tint: '45 60% 45%',
    },
    tint: '45 60% 45%',
    stack: ['python', 'aws', 'claude', 'dynamodb', 'riotapi'],
    links: [{ type: 'devpost', href: 'https://devpost.com/software/league-wrapped' }],
    accolade: 'Riot Hackathon 2025',
  },
  {
    slug: 'animals10-classifier',
    trackNumber: 5,
    title: 'Animals10 Classifier',
    tagline: '85% accuracy across 10 animal species with a VGG16 CNN built from scratch.',
    description: 'Implemented VGG16 from scratch in PyTorch with batch normalization, dropout, and cosine-annealing LR scheduling over 15 epochs — outperforming a ResNet50 baseline that overfit at comparable depth.',
    year: 'Dec 2025',
    role: 'Machine Learning Engineer · Solo',
    artwork: {
      src: '/animals10.webp',
      alt: 'Animals10 CNN classifier',
      width: 1169,
      height: 593,
      tint: '35 40% 42%',
    },
    tint: '35 40% 42%',
    stack: ['python', 'pytorch', 'colab'],
    links: [{ type: 'github', href: 'https://github.com/mel418/CECS456_project' }],
  },
  {
    slug: 'cecs-327-distributed-systems',
    trackNumber: 6,
    title: 'Distributed Systems Labs',
    tagline: 'Containerized client/server messaging and multicast/anycast networking, built from raw sockets up.',
    description: "Two Docker-based systems programming labs for CSULB's Distributed Computing course: a containerized client/server file-transfer app, and a from-scratch implementation of multicast and anycast group messaging over raw sockets, each documented in a full technical report.",
    year: 'Sep – Dec 2025',
    role: 'Systems Engineer',
    // No artwork — the repo has no screenshot or top-level README. Renders
    // via Phase 5's text-forward card variant instead of a placeholder image.
    tint: '210 25% 42%',
    stack: ['python', 'docker'],
    links: [{ type: 'github', href: 'https://github.com/mel418/CECS-327' }],
  },
  {
    slug: 'f1gpt',
    trackNumber: 7,
    title: 'F1GPT',
    tagline: 'Ask anything about Formula 1 and get real-time answers grounded in live F1 data.',
    description: 'A RAG chatbot that scrapes Wikipedia and the official F1 site, stores vector embeddings in DataStax Astra DB, and streams GPT-4o responses through a LangChain retrieval pipeline.',
    year: 'May 2026',
    role: 'Full-Stack Developer · Solo',
    artwork: {
      src: '/f1gpt.png',
      alt: 'F1GPT Formula 1 RAG chatbot',
      width: 1919,
      height: 914,
      tint: '355 55% 42%',
    },
    tint: '355 55% 42%',
    stack: ['nextjs', 'ts', 'openai', 'langchain', 'astradb', 'vercelai', 'puppeteer', 'tailwind'],
    links: [{ type: 'github', href: 'https://github.com/mel418/nextjs-f1gpt' }],
  },
  {
    slug: 'modo-matcha',
    trackNumber: 8,
    title: 'Modo Matcha',
    tagline: 'Real-time drink ordering that served 200+ guests with zero fulfillment errors.',
    description: 'A live-event ordering system with synchronized customer- and kitchen-facing screens. I scoped the product, directed the build, and validated Firestore real-time sync end-to-end before deploying for a catering event.',
    year: 'Jul 2026',
    role: 'Product Lead & Developer · Solo',
    artwork: {
      src: '/Modo Matcha menu.webp',
      alt: 'Modo Matcha live ordering system',
      width: 1919,
      height: 912,
      tint: '90 35% 38%',
    },
    tint: '90 35% 38%',
    stack: ['ts', 'firebase'],
    links: [
      { type: 'live', href: 'https://modomatcha.com' },
      { type: 'github', href: 'https://github.com/mel418/modo-matcha-order-system' },
    ],
    status: 'live',
  },
];
