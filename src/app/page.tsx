import Image from 'next/image';
import { Github, Linkedin, Mail, MapPin, GraduationCap, Code, Briefcase, Send, Award, Users, Database, Wrench, Layers } from 'lucide-react';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SpotifyShell } from '@/components/layout/SpotifyShell';
import { RightNowPlayingPanel } from '@/components/layout/RightNowPlayingPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProjectsGallery, type Project } from '@/components/ProjectsGallery';
import { ExperienceTracklist, type ExperienceEntry } from '@/components/ExperienceTracklist';
import { Section } from '@/components/Section';
import { AnimateIn } from '@/components/AnimateIn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NowPlaying } from '@/components/NowPlaying';
import { getNowPlaying } from '@/lib/spotify';

const projects: Project[] = [
  {
    title: 'PennySprout',
    tagline: 'Turns a messy bank-statement CSV into clear spending insights and a 1–10 financial health score.',
    description: 'A full-stack finance analyzer that parses uploaded statements, routes transactions through the Claude API for categorization, and renders interactive breakdowns with Recharts — backed by Clerk auth and per-user CRUD for persistent data.',
    imageUrl: '/pennysprout_dash.png',
    tags: ['Next.js', 'Claude AI', 'Recharts', 'Clerk'],
    links: [
      { type: 'live', href: 'https://www.pennysprout.online/' },
      { type: 'github', href: 'https://github.com/mel418/PennySprout-v1' },
    ],
    featured: true,
  },
  {
    title: 'Rift Rewind',
    tagline: 'Spotify Wrapped, but for League of Legends — AI-coached season recaps delivered in Discord.',
    description: 'Pulls a full season of Riot match history, aggregates win rate, KDA, and champion stats, then generates personalized coaching via Claude on AWS Bedrock — with DynamoDB caching to stay under Riot API rate limits.',
    imageUrl: '/league-wrapped-1.jpg',
    tags: ['Python', 'AWS Bedrock', 'Claude AI', 'DynamoDB', 'Riot API'],
    links: [{ type: 'devpost', href: 'https://devpost.com/software/league-wrapped' }],
    accolade: 'Riot Hackathon 2025',
  },
  {
    title: 'F1GPT',
    tagline: 'Ask anything about Formula 1 and get real-time answers grounded in live F1 data.',
    description: 'A RAG chatbot that scrapes Wikipedia and the official F1 site, stores vector embeddings in DataStax Astra DB, and streams GPT-4o responses through a LangChain retrieval pipeline.',
    imageUrl: '/f1gpt.png',
    tags: ['Next.js', 'OpenAI', 'LangChain', 'Astra DB'],
    links: [{ type: 'github', href: 'https://github.com/mel418/nextjs-f1gpt' }],
  },
  {
    title: 'Modo Matcha',
    tagline: 'Real-time drink ordering that served 200+ guests with zero fulfillment errors.',
    description: 'A live-event ordering system with synchronized customer- and kitchen-facing screens. I scoped the product, directed the build, and validated Firestore real-time sync end-to-end before deploying for a catering event.',
    imageUrl: '/Modo Matcha menu.png',
    tags: ['TypeScript', 'Firebase', 'Firestore'],
    links: [{ type: 'live', href: 'https://modomatcha.com' }],
  },
  {
    title: 'Cafinity',
    tagline: 'Discover cafes nearby, with AI auto-moderating every community submission.',
    description: 'A cafe discovery platform that cut manual review across 200+ listings with an OpenAI moderation pipeline, and surfaces nearby spots using Google Maps clustering with Haversine distance filtering.',
    imageUrl: '/cafinity.png',
    tags: ['React', 'Firebase', 'Google Maps', 'OpenAI'],
    links: [{ type: 'github', href: 'https://github.com/mel418/cafinity' }],
  },
  {
    title: 'Animals10 Classifier',
    tagline: '85% accuracy across 10 animal species with a VGG16 CNN built from scratch.',
    description: 'Implemented VGG16 from scratch in PyTorch with batch normalization, dropout, and cosine-annealing LR scheduling over 15 epochs — outperforming a ResNet50 baseline that overfit at comparable depth.',
    imageUrl: '/animals10.png',
    tags: ['Python', 'PyTorch', 'Colab'],
    links: [{ type: 'github', href: 'https://github.com/mel418/CECS456_project' }],
  },
];

const experience: ExperienceEntry[] = [
  {
    role: 'Web Developer',
    company: 'CSULB Esports Association',
    dateRange: 'Sep 2023 – Jul 2024',
    category: 'Engineering',
    bullets: [
      'Cut tournament site query response time ~60% and reduced manual registration processing ~75% per season by refactoring PHP/MySQL queries with database indexes and building a self-serve signup system that handled 200+ users with automated roster validation.',
    ],
  },
  {
    role: 'Secretary',
    company: 'Women in Computing (WiC) – CSULB',
    dateRange: 'Aug 2023 – Apr 2024',
    category: 'Leadership',
    bullets: [
      'Grew workshop attendance ~45% over the year by running a monthly MailChimp newsletter to 150+ members with event spotlights and recap content.',
    ],
  },
  {
    role: 'Fulfillment Expert',
    company: 'Target',
    dateRange: 'Aug 2021 – Present',
    category: 'Operations',
    bullets: [
      'Met daily fulfillment deadlines in a high-volume store by accurately processing online orders, tracking inventory, restocking shelves, and coordinating shipping handoffs with team members.',
    ],
  },
];

const skillGroups = [
  {
    label: 'Languages',
    icon: Code,
    items: [
      { id: 'js', name: 'JavaScript' },
      { id: 'ts', name: 'TypeScript' },
      { id: 'python', name: 'Python' },
      { id: 'java', name: 'Java' },
      { id: 'cpp', name: 'C++' },
      { id: 'cs', name: 'C#' },
      { id: 'kotlin', name: 'Kotlin' },
      { id: 'mysql', name: 'SQL' },
    ],
  },
  {
    label: 'Web',
    icon: Layers,
    items: [
      { id: 'react', name: 'React' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'nodejs', name: 'Node.js' },
      { id: 'express', name: 'Express' },
      { id: 'tailwind', name: 'Tailwind CSS' },
      { id: 'html', name: 'HTML5' },
      { id: 'css', name: 'CSS3' },
      { id: 'php', name: 'PHP' },
    ],
  },
  {
    label: 'Databases',
    icon: Database,
    items: [
      { id: 'mysql', name: 'MySQL' },
      { id: 'firebase', name: 'Firebase' },
      { id: 'mongodb', name: 'MongoDB' },
    ],
  },
  {
    label: 'Tools',
    icon: Wrench,
    items: [
      { id: 'git', name: 'Git' },
      { id: 'vscode', name: 'VS Code' },
      { id: 'aws', name: 'AWS' },
      { id: 'linux', name: 'Linux' },
    ],
  },
];

export default async function Home() {
  let song = { isPlaying: false as const };
  try {
    song = await getNowPlaying();
  } catch {
    // Spotify API unavailable — show "not playing" fallback
  }

  return (
    <SpotifyShell
      leftPanel={<AppSidebar />}
      rightPanel={<RightNowPlayingPanel song={song} />}
    >
      <MobileBottomNav />

      <div className="space-y-0 pb-24 md:pb-0">

        {/* ── PROFILE HERO ── */}
        <section id="profile" className="scroll-mt-24">
          <div className="relative px-4 sm:px-8 pt-16 sm:pt-20 pb-12 playlist-header-gradient">
            <AnimateIn direction="up">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-7">
                {/* Profile photo — square album-art style */}
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/20">
                  <div className="absolute inset-0 bg-primary/10 blur-xl" />
                  <Image
                    src="/lofiPFP.png"
                    alt="Melody Gatan"
                    fill
                    className="relative z-10 object-cover"
                    sizes="(max-width: 640px) 144px, 192px"
                    priority
                  />
                </div>

                {/* Name / tagline / meta */}
                <div className="space-y-4 pb-1">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      Open to Work · Software Engineer
                    </p>
                  </div>
                  <h1 className="text-5xl sm:text-7xl font-bold font-headline tracking-tight leading-[0.95]">
                    Melody Gatan
                  </h1>
                  <p className="text-sm sm:text-lg font-semibold animate-shimmer-text">
                    Full-Stack Developer · AI Tinkerer · Matcha Connoisseur
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />CSULB CS Grad &apos;25</span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />Bellflower, CA</span>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Bio + social + NowPlaying (visible below xl where right panel is hidden) */}
          <div className="px-4 sm:px-8 py-8 space-y-6 border-b border-border/60">
            <AnimateIn delay={100} direction="up">
              <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
                I build full-stack apps by day and drink way too much matcha by night. Fresh CS grad
                from CSULB, 2nd place at MarinaHacks, and always looking for the next thing to build.
              </p>
            </AnimateIn>
            <AnimateIn delay={150} direction="up">
              <div className="flex flex-wrap items-center gap-2.5">
                <a href="/Melody_Gatan_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <Send className="mr-2 h-4 w-4" /> View Resume
                  </Button>
                </a>
                <a href="https://github.com/mel418" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                    <Github />
                  </Button>
                </a>
                <a href="https://linkedin.com/in/melody-gatan" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                    <Linkedin />
                  </Button>
                </a>
                <a href="mailto:melodygatan@gmail.com">
                  <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                    <Mail />
                  </Button>
                </a>
              </div>
            </AnimateIn>
            {/* Now Playing shown only when right panel is hidden */}
            <AnimateIn delay={200} direction="up" className="xl:hidden max-w-sm">
              <NowPlaying song={song} />
            </AnimateIn>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <Section id="projects" icon={Code} title="Projects" eyebrow="Selected Work">
          <AnimateIn>
            <p className="-mt-4 mb-8 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Things I&apos;ve built end-to-end — from AI-powered products to a CNN trained from scratch. Tap any card to dive into the code or a live demo.
            </p>
          </AnimateIn>
          <ProjectsGallery projects={projects} />
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" icon={Briefcase} title="Experience" eyebrow="Where I've Worked">
          <ExperienceTracklist experience={experience} />
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" icon={Code} title="Technical Skills" eyebrow="Toolbox">
          <TooltipProvider>
            <div className="divide-y divide-border/60 border-y border-border/60">
              {skillGroups.map((group, gi) => (
                <AnimateIn key={group.label} delay={gi * 80}>
                  <div className="grid gap-4 py-7 sm:grid-cols-[180px_1fr]">
                    <div className="flex items-center gap-2.5">
                      <group.icon className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {group.label}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                      {group.items.map((skill) => (
                        <Tooltip key={skill.id}>
                          <TooltipTrigger>
                            <img
                              src={`https://skillicons.dev/icons?i=${skill.id}`}
                              alt={`${skill.name} icon`}
                              className="h-11 w-11 sm:h-12 sm:w-12 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                            />
                          </TooltipTrigger>
                          <TooltipContent><p>{skill.name}</p></TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </TooltipProvider>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" icon={GraduationCap} title="Education" eyebrow="Background">
          <AnimateIn>
            <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1.5 pb-6 mb-6 border-b border-border/60">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">California State University, Long Beach</h3>
                  <p className="text-sm sm:text-base text-primary font-medium mt-1">B.S. in Computer Science · GPA 3.66</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground shrink-0 whitespace-nowrap">Graduated Dec 2025</p>
              </div>

              <dl className="grid gap-6 sm:grid-cols-[140px_1fr]">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-0.5">Coursework</dt>
                <dd className="text-sm sm:text-base leading-relaxed text-foreground/80">
                  Data Structures, Algorithms, Discrete Structures, Database Fundamentals, Object-Oriented Programming, System Programming, Operating Systems, Mobile App Development.
                </dd>

                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-0.5 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />Honors
                </dt>
                <dd className="text-sm sm:text-base text-foreground/80">President&apos;s List (3×) · Dean&apos;s List (2×)</dd>

                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-1 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />Affiliations
                </dt>
                <dd className="flex flex-wrap gap-2">
                  <Badge variant="secondary">WiC — Women in Computing</Badge>
                  <Badge variant="secondary">ACM</Badge>
                  <Badge variant="secondary">SWE — Society of Women Engineers</Badge>
                </dd>
              </dl>
            </div>
          </AnimateIn>
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact" icon={Mail} title="Let's Connect" eyebrow="Contact">
          <AnimateIn>
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
              <div className="space-y-5">
                <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-md">
                  Have a question or want to build something together? My inbox is always open — I&apos;ll get back to you as soon as I can.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <a href="https://github.com/mel418" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Github />
                    </Button>
                  </a>
                  <a href="https://linkedin.com/in/melody-gatan" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Linkedin />
                    </Button>
                  </a>
                  <a href="mailto:melodygatan@gmail.com">
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Mail />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
                <form action="mailto:melodygatan@gmail.com" method="post" encType="text/plain" className="space-y-4">
                  <Input type="text" name="name" placeholder="Your Name" required />
                  <Input type="email" name="email" placeholder="Your Email" required />
                  <Textarea name="message" placeholder="Your Message" rows={5} required />
                  <Button type="submit" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </div>
            </div>
          </AnimateIn>
        </Section>

      </div>

      <footer className="text-center py-8 text-xs text-muted-foreground border-t border-border/60">
        © 2025 Melody Gatan · Built with Next.js &amp; too much matcha ☕
      </footer>
    </SpotifyShell>
  );
}
