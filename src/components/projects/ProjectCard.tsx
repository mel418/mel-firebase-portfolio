'use client';

import Image from 'next/image';
import { Play, Trophy, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { cn } from '@/lib/utils';
import { getSkill, type Project } from '@/content';

type Props = {
  project: Project;
  isOpen: boolean;
  onToggle: (slug: string) => void;
  variant?: 'featured' | 'grid';
};

/**
 * Closed-state discography card — a disclosure trigger, not a link. The
 * whole card expands the album-detail view in place (ProjectDetail);
 * the actual Live/Code links live inside that expanded view. Text-forward
 * variant (no `project.artwork`) covers CECS-327, which has no
 * screenshot or README to draw one from — an oversized track-number +
 * title composition on the project's tint color instead of a
 * placeholder image.
 */
export function ProjectCard({ project, isOpen, onToggle, variant = 'grid' }: Props) {
  const isFeatured = variant === 'featured';

  return (
    <button
      type="button"
      id={`card-${project.slug}`}
      aria-expanded={isOpen}
      aria-controls={`detail-${project.slug}`}
      onClick={() => onToggle(project.slug)}
      className={cn(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isOpen ? 'border-primary/50 shadow-lg shadow-primary/5' : 'border-border/60 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5',
        isFeatured ? 'md:grid md:grid-cols-2 md:items-stretch' : 'h-full bg-card/40',
        !isFeatured && 'bg-card/40'
      )}
      style={{ ['--album-tint' as string]: project.tint }}
    >
      {/* Cover */}
      <div className={cn('relative overflow-hidden', isFeatured ? 'aspect-[16/10] md:aspect-auto md:min-h-[320px]' : 'aspect-[16/10]')}>
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
            <TrackNumber n={project.trackNumber} className="text-sm text-muted-foreground" />
            <p className="font-headline text-3xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-4xl">
              {project.title}
            </p>
          </div>
        )}
        {project.accolade && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            <Trophy className="h-3 w-3 text-primary" /> {project.accolade}
          </span>
        )}
        {isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
        )}
        {/* Play/expand affordance */}
        <span
          className={cn(
            'absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          )}
        >
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col gap-2.5', isFeatured ? 'justify-center p-6 sm:p-9' : 'p-5')}>
        <div className="flex items-start justify-between gap-2">
          <TrackNumber n={project.trackNumber} className={isFeatured ? 'text-sm' : ''} />
          {!isFeatured && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />}
        </div>
        <h3 className={cn('font-headline font-bold leading-tight tracking-tight transition-colors group-hover:text-primary', isFeatured ? 'text-2xl sm:text-4xl' : 'text-lg')}>
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
