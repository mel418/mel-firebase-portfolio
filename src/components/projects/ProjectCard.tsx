'use client';

import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowUpRight, Play, Sparkles, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { cn } from '@/lib/utils';
import { getSkill, type Project } from '@/content';

type Props = {
  project: Project;
  isOpen: boolean;
  onOpen: (slug: string) => void;
  variant?: 'featured' | 'row';
  /** Featured cards alternate which side the cover sits on. */
  flip?: boolean;
};

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background';

const TILT_SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      Live
    </span>
  );
}

/**
 * Closed-state discography card. Both variants open the album-detail dialog
 * (ProjectDetail, via Discography's shared Dialog); `isOpen` keeps the card
 * behind it highlighted. `featured` is a wide cover-and-text card; `row` is
 * a single quiet line for the long tail.
 */
export function ProjectCard({ project, isOpen, onOpen, variant = 'featured', flip = false }: Props) {
  return variant === 'row' ? (
    <RowCard project={project} isOpen={isOpen} onOpen={onOpen} />
  ) : (
    <FeaturedCard project={project} isOpen={isOpen} onOpen={onOpen} flip={flip} />
  );
}

function RowCard({ project, isOpen, onOpen }: Omit<Props, 'variant' | 'flip'>) {
  return (
    <button
      type="button"
      id={`card-${project.slug}`}
      aria-haspopup="dialog"
      onClick={() => onOpen(project.slug)}
      className={cn(
        'group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1.5 py-7 text-left transition-colors sm:grid-cols-[8.5rem_1fr_auto]',
        isOpen ? 'bg-primary/5' : 'hover:bg-primary/5',
        FOCUS
      )}
    >
      <TrackNumber n={project.year} className="col-span-2 sm:col-span-1" />
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-headline text-lg font-bold tracking-tight transition-colors group-hover:text-accent-ink">{project.title}</h3>
          {project.accolade && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Trophy className="h-3 w-3 text-primary" />
              {project.accolade}
            </span>
          )}
        </div>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

function FeaturedCard({ project, isOpen, onOpen, flip }: Omit<Props, 'variant'>) {
  const reduceMotion = useReducedMotion();
  // Pointer position drives springs, so the lean eases toward the mouse and
  // settles back instead of snapping.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(rx, TILT_SPRING);
  const rotateY = useSpring(ry, TILT_SPRING);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, hsl(var(--primary) / 0.12), transparent 65%)`;

  // A few degrees of 3D lean toward the mouse plus a spotlight position.
  // Mouse only (touch has no hover) and skipped under prefers-reduced-motion.
  function tiltTo(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse' || reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * 4);
    ry.set((px - 0.5) * 5);
    mx.set(px * 100);
    my.set(py * 100);
  }

  function tiltReset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.button
      type="button"
      id={`card-${project.slug}`}
      aria-haspopup="dialog"
      onClick={() => onOpen(project.slug)}
      onPointerMove={tiltTo}
      onPointerLeave={tiltReset}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.2 }}
      className={cn(
        'group surface relative grid w-full overflow-hidden rounded-3xl text-left transition-colors duration-200 ease-out md:grid-cols-2',
        isOpen ? 'border-primary/60' : 'hover:border-primary/50',
        FOCUS
      )}
      style={{ rotateX, rotateY, transformPerspective: 1100, ['--album-tint' as string]: project.tint }}
    >
      <div className={cn('relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]', flip && 'md:order-2')}>
        {project.artwork ? (
          <Image
            src={project.artwork.src}
            alt={project.artwork.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 440px"
          />
        ) : (
          <div className="flex h-full w-full flex-col justify-between bg-album-tint/15 p-6">
            <TrackNumber n={project.year} className="text-sm text-muted-foreground" />
            <p className="font-headline text-4xl font-extrabold leading-[0.95] tracking-tight text-foreground">{project.title}</p>
          </div>
        )}
        <span
          className={cn(
            'absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300',
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
          )}
        >
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>

      <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
        <div className="flex items-center justify-between gap-4">
          <TrackNumber n={project.year} />
          <div className="flex items-center gap-3">
            {project.demo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-accent-ink">
                <Sparkles className="h-3 w-3" /> Try it live
              </span>
            )}
            {project.status === 'live' && <LiveDot />}
          </div>
        </div>
        <h3 className="font-headline text-3xl font-extrabold leading-tight tracking-tight transition-colors group-hover:text-accent-ink">
          {project.title}
        </h3>
        <p className="text-base leading-relaxed text-muted-foreground">{project.tagline}</p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {project.stack.slice(0, 5).map((id) => (
            <Badge key={id} variant="secondary" className="text-[11px]">
              {getSkill(id)?.name ?? id}
            </Badge>
          ))}
        </div>
      </div>

      {/* Soft light that follows the pointer (set by tiltTo). */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlight }}
      />
    </motion.button>
  );
}
