import Image from 'next/image';
import { Github, Linkedin, Mail, MapPin, Play, GraduationCap, Code, Briefcase, User, Send, Award, Users } from 'lucide-react';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SpotifyShell } from '@/components/layout/SpotifyShell';
import { RightNowPlayingPanel } from '@/components/layout/RightNowPlayingPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ProjectsTracklist } from '@/components/ProjectsTracklist';
import { ExperienceTracklist, type ExperienceEntry } from '@/components/ExperienceTracklist';
import { Section } from '@/components/Section';
import { AnimateIn } from '@/components/AnimateIn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NowPlaying } from '@/components/NowPlaying';
import { getNowPlaying } from '@/lib/spotify';

const projects = [
  {
    title: 'F1GPT',
    description: 'RAG chatbot for Formula One enthusiasts — scrapes F1 data from Wikipedia and the official F1 site, stores vector embeddings in DataStax Astra DB, and streams real-time answers via GPT-4o using LangChain-powered retrieval.',
    imageUrl: '/f1gpt.png',
    href: 'https://github.com/mel418/nextjs-f1gpt',
    tags: ['Next.js', 'OpenAI', 'LangChain', 'Astra DB', 'Vercel AI SDK'],
    dataAiHint: 'formula 1 chatbot',
  },
  {
    title: 'Animals10 Image Classifier',
    description: 'Hit 85% test accuracy on a 10-class animal image dataset by building VGG16 from scratch in PyTorch with batch normalization, dropout, and cosine annealing LR scheduling — outperforming a ResNet50 baseline that overfit.',
    imageUrl: '/animals10.png',
    href: 'https://github.com/mel418/CECS456_project',
    tags: ['Python', 'PyTorch', 'Google Colab'],
    dataAiHint: 'animal image classifier training batch',
  },
  {
    title: 'Rift Rewind — League Wrapped',
    description: 'Spotify Wrapped-style Discord bot for League of Legends — retrieves full 2025 match history via Riot API, aggregates stats (win rate, KDA, champion picks), generates personalized coaching via Claude 3 Haiku on AWS Bedrock, with DynamoDB caching to handle Riot API rate limits. Built for Riot Games Hackathon: Rift Rewind 2025.',
    imageUrl: '/league-wrapped-1.jpg',
    href: 'https://devpost.com/software/league-wrapped',
    tags: ['Python', 'AWS Bedrock', 'Claude AI', 'DynamoDB', 'Riot Games API'],
    dataAiHint: 'discord bot league of legends stats',
  },
  {
    title: 'Modo Matcha',
    description: 'Shipped a TypeScript drink-ordering app handling 200+ guests with zero fulfillment errors by scoping features, directing Firebase Studio to generate the build, and validating real-time order sync across customer and kitchen screens.',
    imageUrl: '/Modo Matcha menu.png',
    href: 'https://modomatcha.com',
    tags: ['TypeScript', 'Firebase Studio', 'Firestore'],
    dataAiHint: 'drink ordering app',
  },
  {
    title: 'PennySprout 🌱',
    description: 'Built a full-stack web app turning bank-statement CSVs into spending insights by parsing uploads, sending transactions to the Claude API, and rendering category breakdowns and a 1–10 health score with Recharts.',
    imageUrl: '/pennysprout_dash.png',
    href: 'https://github.com/mel418/PennySprout-v1',
    tags: ['Next.js', 'Claude AI', 'Recharts', 'Clerk'],
    dataAiHint: 'finance dashboard charts',
  },
  {
    title: 'Cafinity ☕',
    description: 'Cut manual review ~70% across 200+ cafe listings by building an OpenAI moderation pipeline that auto-flagged user submissions. Enabled location search via Google Maps clustering with Haversine distance filtering.',
    imageUrl: '/cafinity.png',
    href: 'https://github.com/mel418/cafinity',
    tags: ['React', 'Firebase', 'Google Maps API', 'OpenAI API'],
    dataAiHint: 'coffee shop map',
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

const skills = {
  languages: [
    { id: 'js', name: 'JavaScript' },
    { id: 'ts', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
    { id: 'cs', name: 'C#' },
    { id: 'kotlin', name: 'Kotlin' },
    { id: 'mysql', name: 'SQL' },
  ],
  web: [
    { id: 'react', name: 'React' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'express', name: 'Express' },
    { id: 'tailwind', name: 'Tailwind CSS' },
    { id: 'html', name: 'HTML5' },
    { id: 'css', name: 'CSS3' },
    { id: 'php', name: 'PHP' },
  ],
  databases: [
    { id: 'mysql', name: 'MySQL' },
    { id: 'firebase', name: 'Firebase' },
    { id: 'mongodb', name: 'MongoDB' },
  ],
  tools: [
    { id: 'git', name: 'Git' },
    { id: 'vscode', name: 'VS Code' },
    { id: 'aws', name: 'AWS' },
    { id: 'linux', name: 'Linux' },
  ],
};

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
        <section id="profile" className="scroll-mt-20">
          <div className="relative px-6 pt-16 pb-10 playlist-header-gradient">
            <AnimateIn direction="up">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Profile photo — square album-art style */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/30">
                  <div className="absolute inset-0 bg-primary/10 blur-xl" />
                  <Image
                    src="/PFP2.JPG"
                    alt="Melody Gatan"
                    fill
                    className="relative z-10 object-cover"
                    sizes="(max-width: 640px) 144px, 176px"
                    priority
                  />
                </div>

                {/* Name / tagline / meta */}
                <div className="space-y-3 pb-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Developer</p>
                  <h1 className="text-4xl sm:text-6xl font-bold font-headline leading-none">Melody Gatan</h1>
                  <p className="text-sm sm:text-base font-semibold animate-shimmer-text">
                    Software Engineer · Full-Stack Dev · Matcha Connoisseur
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">🎓 CSULB CS Grad &apos;25</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">☕ Matcha Connoisseur</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Bellflower, CA</span>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Bio + social + NowPlaying (visible below xl where right panel is hidden) */}
          <div className="px-6 py-6 space-y-4">
            <AnimateIn delay={100} direction="up">
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
                I build full-stack apps by day and drink way too much matcha by night. Fresh CS grad from CSULB, 2nd place at MarinaHacks, and always looking for the next thing to build. Open to work! 👋
              </p>
            </AnimateIn>
            <AnimateIn delay={150} direction="up">
              <div className="flex gap-2">
                <a href="https://github.com/mel418" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="hover:border-primary hover:text-primary transition-colors">
                    <Github />
                  </Button>
                </a>
                <a href="https://linkedin.com/in/melody-gatan" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="hover:border-primary hover:text-primary transition-colors">
                    <Linkedin />
                  </Button>
                </a>
                <a href="mailto:melodygatan@gmail.com">
                  <Button variant="outline" size="icon" className="hover:border-primary hover:text-primary transition-colors">
                    <Mail />
                  </Button>
                </a>
                <a href="/Melody_Gatan_Resume.pdf" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary transition-colors">
                    Resume
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

        {/* ── EXPERIENCE ── */}
        <Section id="experience" icon={Briefcase} title="Experience">
          <ExperienceTracklist experience={experience} />
        </Section>

        {/* ── PROJECTS ── */}
        <Section id="projects" icon={Code} title="Projects">
          <ProjectsTracklist projects={projects} />
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" icon={Code} title="Technical Skills">
          <TooltipProvider>
            <div className="space-y-10">
              {/* Languages */}
              <AnimateIn>
                <div>
                  <h3 className="text-base sm:text-xl font-semibold mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.languages.map((s) => (
                      <Badge key={s.name} variant="outline" className="cursor-default hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.languages.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger>
                          <img
                            src={`https://skillicons.dev/icons?i=${skill.id}`}
                            alt={`${skill.name} icon`}
                            className="h-12 w-12 sm:h-16 sm:w-16 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent><p>{skill.name}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Web Development */}
              <AnimateIn delay={100}>
                <div>
                  <h3 className="text-base sm:text-xl font-semibold mb-3">Web Development</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.web.map((s) => (
                      <Badge key={s.name} variant="outline" className="cursor-default hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.web.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger>
                          <img
                            src={`https://skillicons.dev/icons?i=${skill.id}`}
                            alt={`${skill.name} icon`}
                            className="h-12 w-12 sm:h-16 sm:w-16 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent><p>{skill.name}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Databases */}
              <AnimateIn delay={200}>
                <div>
                  <h3 className="text-base sm:text-xl font-semibold mb-3">Databases</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.databases.map((s) => (
                      <Badge key={s.name} variant="outline" className="cursor-default hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.databases.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger>
                          <img
                            src={`https://skillicons.dev/icons?i=${skill.id}`}
                            alt={`${skill.name} icon`}
                            className="h-12 w-12 sm:h-16 sm:w-16 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent><p>{skill.name}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </AnimateIn>

              {/* Tools */}
              <AnimateIn delay={300}>
                <div>
                  <h3 className="text-base sm:text-xl font-semibold mb-3">Tools &amp; Technologies</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skills.tools.map((s) => (
                      <Badge key={s.name} variant="outline" className="cursor-default hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
                        {s.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.tools.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger>
                          <img
                            src={`https://skillicons.dev/icons?i=${skill.id}`}
                            alt={`${skill.name} icon`}
                            className="h-12 w-12 sm:h-16 sm:w-16 transition-transform duration-200 hover:scale-110 hover:-translate-y-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent><p>{skill.name}</p></TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </AnimateIn>
            </div>
          </TooltipProvider>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" icon={GraduationCap} title="Education">
          <div className="space-y-6">
            <AnimateIn>
              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <CardTitle className="text-lg sm:text-2xl text-primary">California State University, Long Beach</CardTitle>
                      <CardDescription className="text-sm sm:text-base">B.S. in Computer Science (GPA: 3.66)</CardDescription>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground shrink-0">Graduated December 2025</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2">Relevant Coursework:</h4>
                    <p className="text-sm sm:text-base">Data Structures, Algorithms, Discrete Structures, Database Fundamentals, Object-Oriented Programming, System Programming, Operating Systems, Mobile App Development.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />Honors:
                    </h4>
                    <p className="text-sm sm:text-base">President&apos;s List (3x) | Dean&apos;s List (2x)</p>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>

            <AnimateIn delay={150}>
              <Card className="bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <h4 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />Affiliations:
                  </h4>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">WiC — Women in Computing</Badge>
                    <Badge variant="secondary">ACM</Badge>
                    <Badge variant="secondary">SWE — Society of Women Engineers</Badge>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          </div>
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact" icon={Mail} title="Contact Me">
          <AnimateIn>
            <Card className="max-w-2xl mx-auto bg-card">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>Have a question or want to work together? Send me a message!</CardDescription>
              </CardHeader>
              <CardContent>
                <form action="mailto:melodygatan@gmail.com" method="post" encType="text/plain" className="space-y-4">
                  <Input type="text" name="name" placeholder="Your Name" required />
                  <Input type="email" name="email" placeholder="Your Email" required />
                  <Textarea name="message" placeholder="Your Message" rows={5} required />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimateIn>
        </Section>

      </div>

      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border">
        © 2025 Melody Gatan. All Rights Reserved.
      </footer>
    </SpotifyShell>
  );
}
