import type { Metadata } from 'next';
import { Github, Linkedin, Mail, MapPin, GraduationCap } from 'lucide-react';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SpotifyShell } from '@/components/layout/SpotifyShell';
import { RightNowPlayingPanel } from '@/components/layout/RightNowPlayingPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Discography } from '@/components/projects/Discography';
import { ExperienceTracklist } from '@/components/ExperienceTracklist';
import { SkillGroups } from '@/components/skills/SkillGroups';
import { ReleaseCard } from '@/components/education/ReleaseCard';
import { Section } from '@/components/Section';
import { AnimateIn } from '@/components/AnimateIn';
import { Button } from '@/components/ui/button';
import { SideB } from '@/components/contact/SideB';
import { NowPlaying, type Song } from '@/components/NowPlaying';
import { getNowPlaying } from '@/lib/spotify';
import { site, projects, experience, hackathons, education, getProject } from '@/content';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { ResumeCassette } from '@/components/props/ResumeCassette';
import { CountUp } from '@/components/primitives/CountUp';
import { Sticker } from '@/components/scrapbook/Sticker';
import { ScrollProgress } from '@/components/scrapbook/ScrollProgress';

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
      description: `${site.name}, ${site.title.toLowerCase()}. ${site.headline}`,
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
      <ScrollProgress />

      <div className="pb-24 md:pb-0">

        {/* ── PROFILE HERO ── just the name, one sentence and one prop. */}
        <section id="profile" className="scroll-mt-8">
          <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-28 sm:px-10">
            <div>
              <div className="relative">
                <div className="hero-in" style={{ ['--d' as string]: 0 }}>
                  <Eyebrow live>{site.status} · {site.title}</Eyebrow>
                </div>

                {/* The name arrives letter by letter; the sr-only copy keeps
                    the heading readable as one word for assistive tech. */}
                <h1 className="mt-10 font-headline text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-8xl">
                  <span className="sr-only">{site.name}</span>
                  <span aria-hidden="true">
                    {[...site.name].map((ch, i) => (
                      <span key={i} className="hero-letter" style={{ ['--i' as string]: i }}>{ch}</span>
                    ))}
                  </span>
                </h1>

                <p className="hero-in mt-10 max-w-2xl font-headline text-2xl font-bold leading-snug tracking-tight text-foreground/90 sm:text-4xl" style={{ ['--d' as string]: 700 }}>
                  {site.headline}
                </p>
                <p className="hero-in mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg" style={{ ['--d' as string]: 900 }}>
                  {site.bio}
                </p>

                <div className="hero-in mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground" style={{ ['--d' as string]: 1050 }}>
                  <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4 text-primary" />{education.shortLabel}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{site.location}</span>
                </div>

                <div className="hero-in mt-16 flex flex-wrap items-center gap-x-10 gap-y-8" style={{ ['--d' as string]: 1200 }}>
                  <ResumeCassette href={site.resumeHref} className="w-56 sm:w-64" />
                  <div className="flex items-center gap-2.5">
                    <Button asChild variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <a href={githubHref} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <a href={linkedinHref} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <a href={emailHref} aria-label="Email">
                        <Mail />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Now Playing shown only when the right panel is hidden */}
                <div className="mt-16 max-w-sm xl:hidden">
                  <NowPlaying song={song} />
                </div>

                <Sticker name="bunny" size={140} rotate={4} className="-top-4 right-0 hidden sm:block" float />
              </div>
            </div>
          </div>

          {/* At a glance — each figure comes straight from the resume or transcript. */}
          <div className="mx-auto w-full max-w-4xl px-6 pb-8 sm:px-10">
            <AnimateIn>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-12 border-t border-border pt-16 sm:grid-cols-4">
                {site.highlights.map((h) => (
                  <div key={h.label} className="space-y-2">
                    <dt className="sr-only">{h.label}</dt>
                    <dd>
                      <span className="block font-headline text-5xl font-extrabold leading-none tracking-tight text-accent-ink"><CountUp value={h.value} /></span>
                      <span className="mt-3 block text-sm font-semibold">{h.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{h.detail}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </AnimateIn>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <Section
          id="projects"
          title="Projects"
          eyebrow="Selected Work"
          description="Three I'm proudest of, then everything else. Open any project for the full story."
        >
          <Discography projects={projects} initialTrack={track} />
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section id="experience" title="Experience" eyebrow="Where I've Worked">
          <ExperienceTracklist experience={experience} hackathons={hackathons} />
        </Section>

        {/* ── SKILLS ── */}
        <Section id="skills" title="Technical Skills" eyebrow="Toolbox">
          <SkillGroups />
        </Section>

        {/* ── EDUCATION ── */}
        <Section id="education" title="Education" eyebrow="Background">
          <AnimateIn>
            <ReleaseCard education={education} />
          </AnimateIn>
        </Section>

        {/* ── CONTACT ── */}
        <Section id="contact" title="Let's talk" eyebrow="Side B">
          <AnimateIn>
            <SideB />
          </AnimateIn>
        </Section>

      </div>

      <footer className="pb-16 text-center text-xs text-muted-foreground">
        © 2026 {site.name} · Built with Next.js &amp; too much matcha ☕
      </footer>
    </SpotifyShell>
  );
}
