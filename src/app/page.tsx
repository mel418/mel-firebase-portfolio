import type { Metadata } from 'next';
import { Github, Linkedin, Mail, MapPin, GraduationCap, Code, Briefcase, Send, Award, Users, Database, Wrench, Layers, type LucideIcon } from 'lucide-react';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SpotifyShell } from '@/components/layout/SpotifyShell';
import { RightNowPlayingPanel } from '@/components/layout/RightNowPlayingPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Discography } from '@/components/projects/Discography';
import { ExperienceTracklist } from '@/components/ExperienceTracklist';
import { Section } from '@/components/Section';
import { AnimateIn } from '@/components/AnimateIn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NowPlaying, type Song } from '@/components/NowPlaying';
import { getNowPlaying } from '@/lib/spotify';
import { site, projects, experience, skills, education, getProject, type SkillCategory } from '@/content';
import { HeroRecord } from '@/components/hero/HeroRecord';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { TrackNumber } from '@/components/primitives/TrackNumber';

// ── Skills grid grouping ───────────────────────────────────────────────────
// Content (src/content/skills.ts) is pure data — category labels/icons for
// display live here instead. Order matches the categories as they've always
// rendered (Languages / Web / Databases / Tools); only grid-visible skills
// (showInGrid: true) appear — see skills.ts for why the newer project-stack
// skills aren't shown yet.
const skillGroupConfig: { category: SkillCategory; label: string; icon: LucideIcon }[] = [
  { category: 'languages', label: 'Languages', icon: Code },
  { category: 'frameworks', label: 'Web', icon: Layers },
  { category: 'data', label: 'Databases', icon: Database },
  { category: 'tools', label: 'Tools', icon: Wrench },
];

const githubHref = site.socials.find((s) => s.type === 'github')!.href;
const linkedinHref = site.socials.find((s) => s.type === 'linkedin')!.href;
const emailHref = site.socials.find((s) => s.type === 'email')!.href;

type PageProps = {
  searchParams: Promise<{ track?: string }>;
};

// A shared ?track=<slug> link (or a search-engine crawl) renders the
// project's own title/description/OG image server-side, already
// expanded — no client-side reveal needed for it to work as a share card.
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { track } = await searchParams;
  const project = track ? getProject(track) : undefined;

  if (!project) {
    return {
      title: `${site.name} - ${site.title}`,
      description: `Portfolio of ${site.name}, a ${site.title.toLowerCase()} and full-stack developer.`,
    };
  }

  const title = `${project.title} — ${site.name}`;
  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      images: project.artwork
        ? [{ url: project.artwork.src, width: project.artwork.width, height: project.artwork.height, alt: project.artwork.alt }]
        : undefined,
    },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const { track } = await searchParams;

  let song: Song = { isPlaying: false };
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
            <AnimateIn direction="up" className="space-y-7">
              <Eyebrow live className="tracking-[0.28em]">Now Playing</Eyebrow>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-7">
                <HeroRecord artwork={site.heroArtwork} />

                {/* Name / tagline / meta */}
                <div className="space-y-4 pb-1">
                  <Eyebrow className="tracking-[0.28em]">{site.status} · {site.title}</Eyebrow>
                  <h1 className="text-5xl sm:text-7xl font-bold font-headline tracking-tight leading-[0.95]">
                    {site.name}
                  </h1>
                  <p className="text-sm sm:text-lg font-semibold animate-shimmer-text">
                    {site.roles.join(' · ')}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
                    <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />{education.shortLabel}</span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{site.location}</span>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* Bio + social + NowPlaying (visible below xl where right panel is hidden) */}
          <div className="px-4 sm:px-8 py-8 space-y-5 border-b border-border/60">
            <AnimateIn delay={100} direction="up">
              <TrackNumber n={1} label="INTRO" className="mb-3" />
              <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
                {site.bio}
              </p>
            </AnimateIn>
            <AnimateIn delay={150} direction="up">
              <div className="flex flex-wrap items-center gap-2.5">
                <a href={site.resumeHref} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <Send className="mr-2 h-4 w-4" /> View Resume
                  </Button>
                </a>
                <a href={githubHref} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                    <Github />
                  </Button>
                </a>
                <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                    <Linkedin />
                  </Button>
                </a>
                <a href={emailHref}>
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
              Things I&apos;ve built end-to-end — from AI-powered products to a CNN trained from scratch. Tap any card to open the liner notes, or jump straight to the code or a live demo.
            </p>
          </AnimateIn>
          <Discography projects={projects} initialTrack={track} />
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" icon={Briefcase} title="Experience" eyebrow="Where I've Worked">
          <ExperienceTracklist experience={experience} />
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" icon={Code} title="Technical Skills" eyebrow="Toolbox">
          <TooltipProvider>
            <div className="divide-y divide-border/60 border-y border-border/60">
              {skillGroupConfig.map((group, gi) => {
                const items = skills.filter((s) => s.showInGrid && s.category === group.category);
                if (items.length === 0) return null;
                return (
                  <AnimateIn key={group.category} delay={gi * 80}>
                    <div className="grid gap-4 py-7 sm:grid-cols-[180px_1fr]">
                      <div className="flex items-center gap-2.5">
                        <group.icon className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {group.label}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                        {items.map((skill) => (
                          <Tooltip key={skill.id}>
                            <TooltipTrigger>
                              <img
                                src={`https://skillicons.dev/icons?i=${skill.iconSlug ?? skill.id}`}
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
                );
              })}
            </div>
          </TooltipProvider>
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" icon={GraduationCap} title="Education" eyebrow="Background">
          <AnimateIn>
            <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1.5 pb-6 mb-6 border-b border-border/60">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-headline tracking-tight">{education.school}</h3>
                  <p className="text-sm sm:text-base text-primary font-medium mt-1">{education.degree} · GPA {education.gpa}</p>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground shrink-0 whitespace-nowrap">Graduated {education.graduated}</p>
              </div>

              <dl className="grid gap-6 sm:grid-cols-[140px_1fr]">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-0.5">Coursework</dt>
                <dd className="text-sm sm:text-base leading-relaxed text-foreground/80">
                  {education.coursework.join(', ')}.
                </dd>

                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-0.5 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />Honors
                </dt>
                <dd className="text-sm sm:text-base text-foreground/80">{education.honors.join(' · ')}</dd>

                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground pt-1 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />Affiliations
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {education.affiliations.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
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
                  <a href={githubHref} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Github />
                    </Button>
                  </a>
                  <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Linkedin />
                    </Button>
                  </a>
                  <a href={emailHref}>
                    <Button variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <Mail />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
                {/* NOTE: mailto: form submission is unsupported in modern
                    browsers — messages sent through this are silently lost.
                    Deleted and replaced in Phase 8 (SIDE B). */}
                <form action={emailHref} method="post" encType="text/plain" className="space-y-4">
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
        © 2026 {site.name} · Built with Next.js &amp; too much matcha ☕
      </footer>
    </SpotifyShell>
  );
}
