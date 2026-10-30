'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { ExternalLink, Github, Pause, Play, Sparkles, Trophy } from 'lucide-react';
import { DialogTitle } from '@/components/ui/dialog';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { StackList } from '@/components/projects/StackList';
import { KioskDemo } from '@/components/projects/demos/KioskDemo';
import { FinanceDemo } from '@/components/projects/demos/FinanceDemo';
import { cn } from '@/lib/utils';
import { getLinerNotes, type Project, type ProjectLink } from '@/content';

const LINK_META: Record<ProjectLink['type'], { label: string; icon: typeof Github }> = {
  github: { label: 'Code', icon: Github },
  live: { label: 'Live', icon: ExternalLink },
  devpost: { label: 'Devpost', icon: Trophy },
};

const TRACK_SECONDS = 8;

type Track = { id: string; title: string; hint: string; body: ReactNode };

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

const Prose = ({ children }: { children: ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</p>
);

/**
 * A project as an album. The left side is the cover and the facts; the right
 * is a tracklist where each track opens one part of the story (and, for the
 * Matcha Kiosk and PennySprout, a sandbox you can actually use). "Play
 * through" walks the tracks automatically; picking one yourself stops it.
 *
 * Renders as the content of Discography's shared Dialog — no wrapper border
 * or close button of its own. DialogTitle wraps the visible title via asChild
 * so it doubles as the dialog's accessible name.
 */
export function ProjectDetail({ project }: { project: Project }) {
  const notes = getLinerNotes(project.slug);

  const tracks: Track[] = [];
  if (project.demo) {
    tracks.push({
      id: 'demo',
      title: 'Try it live',
      hint: 'A sandbox with sample data',
      body: project.demo === 'kiosk' ? <KioskDemo /> : <FinanceDemo />,
    });
  }
  if (notes) {
    tracks.push(
      { id: 'problem', title: 'The problem', hint: 'Why I built it', body: <Prose>{notes.why}</Prose> },
      { id: 'build', title: 'What I built', hint: 'How it works', body: <Prose>{notes.built}</Prose> },
      { id: 'challenges', title: 'Challenges', hint: 'Decisions and trade-offs', body: <Bullets items={notes.challenges} /> },
      { id: 'learned', title: 'What I learned', hint: 'The takeaways', body: <Bullets items={notes.learned} /> }
    );
  }

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (active + 1 < tracks.length) setActive(active + 1);
      else setPlaying(false);
    }, TRACK_SECONDS * 1000);
    return () => window.clearTimeout(id);
  }, [playing, active, tracks.length]);

  return (
    <div style={{ ['--album-tint' as string]: project.tint }}>
      <TrackNumber n={project.year} label={project.role} className="pr-8" />

      <div className="mt-6 grid gap-10 lg:grid-cols-[19rem_1fr] lg:gap-14">
        {/* Cover and facts */}
        <div className="space-y-5">
          {project.artwork ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border/60">
              <Image src={project.artwork.src} alt={project.artwork.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 304px" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] flex-col justify-between rounded-2xl bg-album-tint/15 p-5">
              <TrackNumber n={project.year} className="text-sm text-muted-foreground" />
              <p className="font-headline text-3xl font-extrabold leading-[0.95] tracking-tight text-foreground">{project.title}</p>
            </div>
          )}

          {/* className goes on DialogTitle (not the h3): it runs through tailwind-merge there. */}
          <DialogTitle asChild className="font-headline text-3xl font-extrabold leading-tight tracking-tight">
            <h3>{project.title}</h3>
          </DialogTitle>
          <p className="text-base font-medium text-foreground/90">{project.tagline}</p>
          <StackList stack={project.stack} />

          <div className="flex flex-wrap gap-2 pt-1">
            {project.links.map((link, i) => {
              const meta = LINK_META[link.type];
              const Icon = meta.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    i === 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border hover:border-primary hover:text-accent-ink'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {meta.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Tracklist */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <Eyebrow>Tracklist</Eyebrow>
            {tracks.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  if (!playing && active === tracks.length - 1) setActive(0);
                  setPlaying((p) => !p);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3.5 py-1.5 text-xs font-semibold text-accent-ink transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {playing ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {playing ? 'Pause' : 'Play through'}
              </button>
            )}
          </div>

          <ol className="divide-y divide-border border-y border-border">
            {tracks.map((t, i) => {
              const open = i === active;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      setActive(i);
                    }}
                    aria-expanded={open}
                    aria-controls={`track-${t.id}`}
                    className="grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-code text-xs text-muted-foreground [font-variant-numeric:tabular-nums]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className={cn('block font-headline text-base font-bold tracking-tight transition-colors sm:text-lg', open && 'text-accent-ink')}>{t.title}</span>
                      <span className="block text-xs text-muted-foreground">{t.hint}</span>
                    </span>
                    {t.id === 'demo' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                        <Sparkles className="h-3 w-3" /> Interactive
                      </span>
                    )}
                  </button>

                  {open && (
                    <div id={`track-${t.id}`} className="hero-in pb-6 pl-11 pr-1" style={{ ['--d' as string]: 0, animationDuration: '450ms' }}>
                      {t.body}
                      {playing && (
                        <span
                          key={`${t.id}-progress`}
                          aria-hidden="true"
                          className="mt-5 block h-px origin-left bg-primary"
                          style={{ animation: `track-progress ${TRACK_SECONDS}s linear forwards` }}
                        />
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
