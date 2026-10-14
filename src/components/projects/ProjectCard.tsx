'use client';

import Image from 'next/image';
import { Play, Trophy, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { Tape } from '@/components/scrapbook/Tape';
import { cn } from '@/lib/utils';
import { getSkill, type Project } from '@/content';

type Props = {
  project: Project;
  isOpen: boolean;
  onOpen: (slug: string) => void;
  variant?: 'featured' | 'grid';
};

const TAPE_VARIANTS = ['gingham', 'beige', 'sage'] as const;

/** Stable per-project "hand placement" — tape colour, tape angle and resting
 *  tilt are derived from the slug, so SSR and client agree (no hydration
 *  mismatch) while every card still looks individually stuck down. */
function placement(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return {
    tape: TAPE_VARIANTS[h % TAPE_VARIANTS.length],
    tapeRotate: ((h >> 3) % 7) - 3,
    tilt: (((h >> 5) % 5) - 2) * 0.35,
  };
}

/**
 * Closed-state discography card — opens the album-detail view in a
 * dialog (ProjectDetail, via Discography's shared Dialog). `isOpen`
 * still drives a highlight/persistent-play-icon style so the card
 * behind the dialog reads as "this one's open", even though the actual
 * disclosure semantics moved to the dialog itself. Text-forward variant
 * (no `project.artwork`) covers CECS-327, which has no screenshot or
 * README to draw one from — an oversized track-number + title
 * composition on the project's tint color instead of a placeholder
 * image.
 *
 * Styled as a taped paper card: no overflow-hidden on the button itself
 * (it would clip the tape straddling the top edge), so the cover carries
 * its own rounded clipping instead.
 */
export function ProjectCard({ project, isOpen, onOpen, variant = 'grid' }: Props) {
  const isFeatured = variant === 'featured';
  const { tape, tapeRotate, tilt } = placement(project.slug);

  return (
    <button
      type="button"
      id={`card-${project.slug}`}
      aria-haspopup="dialog"
      onClick={() => onOpen(project.slug)}
      className={cn(
        'paper-card group relative flex w-full flex-col rounded-[1.75rem] border-2 bg-card text-left transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        '[rotate:var(--card-tilt)] hover:[rotate:0deg]',
        isOpen ? 'border-primary/60' : 'border-primary/25 hover:-translate-y-1.5 hover:border-primary/55',
        isFeatured ? 'md:grid md:grid-cols-2 md:items-stretch' : 'h-full'
      )}
      style={{ ['--album-tint' as string]: project.tint, ['--card-tilt' as string]: `${isFeatured ? 0 : tilt}deg` }}
    >
      <Tape variant={tape} width={isFeatured ? 120 : 96} rotate={tapeRotate} className="-top-3 left-1/2 -translate-x-1/2" />

      {/* Cover */}
      <div
        className={cn(
          'relative overflow-hidden rounded-t-[calc(1.75rem-2px)]',
          isFeatured ? 'aspect-[16/10] md:aspect-auto md:min-h-[320px] md:rounded-l-[calc(1.75rem-2px)] md:rounded-tr-none' : 'aspect-[16/10]'
        )}
      >
        {project.artwork ? (
          <Image
            src={project.artwork.src}
            alt={project.artwork.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw'}
            priority={isFeatured}
          />
        ) : (
          /* Text sits on --foreground/--muted-foreground, not the tint —
             those are the tokens already verified against AA in both
             themes (Phase 2c). The per-project tint stays only as a
             15%-opacity background wash, where WCAG's text-contrast
             rules don't apply the same way — several tint colors were
             found to fail AA as text, as low as 2.4:1 in dark mode. */
          <div className="flex h-full w-full flex-col justify-between bg-album-tint/15 p-5">
            <TrackNumber n={project.year} className="text-sm text-muted-foreground" />
            <p className="font-headline text-3xl font-extrabold leading-[0.95] tracking-tight text-foreground sm:text-4xl">
              {project.title}
            </p>
          </div>
        )}
        {project.accolade && (
          <span className="absolute left-3 top-4 inline-flex -rotate-2 items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-md ring-2 ring-primary/40">
            <Trophy className="h-3 w-3 text-primary" /> {project.accolade}
          </span>
        )}
        {isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r" />
        )}
        {/* Play/expand affordance */}
        <span
          className={cn(
            'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-card transition-all duration-300',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          )}
        >
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col gap-2.5', isFeatured ? 'justify-center p-6 sm:p-9' : 'p-5')}>
        <div className="flex items-start justify-between gap-2">
          <TrackNumber n={project.year} className={isFeatured ? 'text-sm' : ''} />
          {!isFeatured && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />}
        </div>
        <h3 className={cn('font-headline font-extrabold leading-tight tracking-tight transition-colors group-hover:text-primary', isFeatured ? 'text-2xl sm:text-4xl' : 'text-lg')}>
          {project.title}
        </h3>
        <p className={cn('leading-relaxed text-muted-foreground', isFeatured ? 'text-base sm:text-lg' : 'text-sm')}>
          {project.tagline}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.stack.slice(0, isFeatured ? 6 : 4).map((id) => (
            <Badge key={id} variant="secondary" className="text-[11px]">
              {getSkill(id)?.name ?? id}
            </Badge>
          ))}
        </div>
      </div>
    </button>
  );
}
