import type { Metadata } from 'next';
import { Github, Linkedin, Mail, MapPin, GraduationCap, Code, Briefcase, Send } from 'lucide-react';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { SpotifyShell } from '@/components/layout/SpotifyShell';
import { RightNowPlayingPanel } from '@/components/layout/RightNowPlayingPanel';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Discography } from '@/components/projects/Discography';
import { ExperienceTracklist } from '@/components/ExperienceTracklist';
import { SoundPalette } from '@/components/skills/SoundPalette';
import { ReleaseCard } from '@/components/education/ReleaseCard';
import { Section } from '@/components/Section';
import { AnimateIn } from '@/components/AnimateIn';
import { Button } from '@/components/ui/button';
import { SideB } from '@/components/contact/SideB';
import { NowPlaying, type Song } from '@/components/NowPlaying';
import { getNowPlaying } from '@/lib/spotify';
import { site, projects, experience, education, getProject } from '@/content';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { MagneticWrap } from '@/components/primitives/MagneticWrap';
import { Sticker } from '@/components/scrapbook/Sticker';
import { Tape } from '@/components/scrapbook/Tape';
import { StickyNote } from '@/components/scrapbook/StickyNote';
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
      <ScrollProgress />

      <div className="space-y-0 pb-24 md:pb-0">

        {/* ── PROFILE HERO ── */}
        <section id="profile" className="scroll-mt-24">
          {/* The hero is a taped paper card with a few stickers. Stickers are
              decorative (aria-hidden) and never carry content. (The old
              spinning-record album art was removed at the owner's request —
              HeroRecord.tsx is still in the repo, just not rendered.) */}
          <div className="relative px-4 sm:px-8 pt-14 sm:pt-16 pb-16">
            <AnimateIn direction="up">
              <div className="paper-card relative rounded-[2rem] border-2 border-primary/30 bg-card/90 p-6 pb-24 sm:p-10 sm:pb-24 xl:pb-14">
                <Tape variant="gingham" width={150} rotate={7} className="-top-4 right-8 sm:right-16" />
                <Sticker name="heart" size={54} rotate={-10} className="-left-3 -top-5" float />
                <Sticker name="sparkle" size={26} className="right-24 top-10 hidden sm:block" float />
                <Sticker name="sparkle" size={18} className="right-40 top-24 hidden md:block" float />
                <StickyNote rotate={4} className="absolute right-10 top-20 hidden w-52 2xl:block">
                  good music for a good day ♡
                </StickyNote>

                <div className="space-y-7">
                  <Eyebrow live className="tracking-[0.28em]">Now Playing</Eyebrow>

                  {/* Name / tagline / meta */}
                  <div className="max-w-3xl space-y-4">
                    <Eyebrow className="tracking-[0.28em]">{site.status} · {site.title}</Eyebrow>
                    <h1 className="text-6xl sm:text-8xl font-extrabold font-headline tracking-tight leading-[0.95]">
                      {site.name}
                    </h1>
                    <p className="text-base sm:text-xl font-bold animate-shimmer-text">
                      {site.roles.join(' · ')}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground pt-1">
                      <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />{education.shortLabel}</span>
                      <span className="text-border">·</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{site.location}</span>
                    </div>
                  </div>
                </div>

                <Sticker name="bunny" size={165} rotate={4} className="-bottom-16 right-2 sm:right-8" />
              </div>
            </AnimateIn>
          </div>

          {/* Bio + social + NowPlaying (visible below xl where right panel is hidden) */}
          <div className="px-4 sm:px-8 pb-10 space-y-5">
            <AnimateIn delay={100} direction="up">
              <TrackNumber n={1} label="INTRO" className="mb-3" />
              <p className="text-base sm:text-lg leading-relaxed text-foreground/80 max-w-2xl">
                {site.bio}
              </p>
            </AnimateIn>
            <AnimateIn delay={150} direction="up">
              <div className="flex flex-wrap items-center gap-2.5">
                <MagneticWrap strength={0.2}>
                  <Button asChild size="sm" className="rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    <a href={site.resumeHref} target="_blank" rel="noopener noreferrer">
                      <Send className="mr-2 h-4 w-4" /> View Resume
                    </a>
                  </Button>
                </MagneticWrap>
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
            </AnimateIn>
            {/* Now Playing shown only when right panel is hidden */}
            <AnimateIn delay={200} direction="up" className="xl:hidden max-w-sm">
              <NowPlaying song={song} />
            </AnimateIn>
            <div aria-hidden="true" className="gingham h-3 w-full rounded-full" />
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <Section
          id="projects"
          icon={Code}
          title="Projects"
          eyebrow="Selected Work"
          decoration={
            <>
              <Sticker name="star" size={64} rotate={10} className="-top-2 right-4 hidden sm:block" float />
              <Sticker name="sparkle" size={24} className="right-24 top-12 hidden sm:block" float />
            </>
          }
        >
          <AnimateIn>
            <p className="-mt-4 mb-8 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
              Things I&apos;ve built end-to-end — from AI-powered products to a CNN trained from scratch. Tap any card to open the liner notes, or jump straight to the code or a live demo.
            </p>
          </AnimateIn>
          <Discography projects={projects} initialTrack={track} />
        </Section>

        {/* ── EXPERIENCE ── */}
        <Section
          id="experience"
          icon={Briefcase}
          title="Experience"
          eyebrow="Where I've Worked"
          decoration={<Sticker name="folderStar" size={84} rotate={-6} className="-top-3 right-2 hidden sm:block" />}
        >
          <ExperienceTracklist experience={experience} />
        </Section>

        {/* ── SKILLS ── */}
        <Section
          id="skills"
          icon={Code}
          title="Technical Skills"
          eyebrow="Toolbox"
          decoration={<Sticker name="cat" size={84} rotate={5} pixel className="-top-3 right-2 hidden sm:block" />}
        >
          <SoundPalette />
        </Section>

        {/* ── EDUCATION ── */}
        <Section
          id="education"
          icon={GraduationCap}
          title="Education"
          eyebrow="Background"
          decoration={
            <>
              <Sticker name="pixelHeart" size={36} rotate={-8} pixel className="right-16 top-0 hidden sm:block" />
              <Sticker name="pixelHeartForest" size={28} rotate={8} pixel className="right-4 top-5 hidden sm:block" />
              <Sticker name="pixelHeartWhite" size={22} rotate={-4} pixel className="right-28 top-8 hidden sm:block" />
            </>
          }
        >
          <AnimateIn>
            <ReleaseCard education={education} />
          </AnimateIn>
        </Section>

        {/* ── CONTACT ── */}
        <Section
          id="contact"
          icon={Mail}
          title="Let's Make Something"
          eyebrow="Side B"
          decoration={<Sticker name="envelope" size={92} rotate={8} className="-top-4 right-2 hidden sm:block" float />}
        >
          <AnimateIn>
            <SideB />
          </AnimateIn>
        </Section>

      </div>

      <footer className="text-center py-8 text-xs text-muted-foreground border-t border-border/60">
        © 2026 {site.name} · Built with Next.js &amp; too much matcha ☕
      </footer>
    </SpotifyShell>
  );
}
