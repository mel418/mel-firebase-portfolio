'use client';

import Image from 'next/image';
import { Github, ExternalLink, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import { StackList } from '@/components/projects/StackList';
import { LinerNotes } from '@/components/projects/LinerNotes';
import { getLinerNotes, type Project, type ProjectLink } from '@/content';

const LINK_META: Record<ProjectLink['type'], { label: string; icon: typeof Github }> = {
  github: { label: 'Code', icon: Github },
  live: { label: 'Live', icon: ExternalLink },
  devpost: { label: 'Devpost', icon: Trophy },
};

type Props = {
  project: Project;
  onClose: () => void;
};

export function ProjectDetail({ project, onClose }: Props) {
  const notes = getLinerNotes(project.slug);

  return (
    <div
      id={`detail-${project.slug}`}
      role="region"
      aria-label={`${project.title} details`}
      className="rounded-2xl border border-primary/30 bg-card/60 p-6 sm:p-9"
      style={{ ['--album-tint' as string]: project.tint }}
    >
      <div className="flex items-start justify-between gap-4">
        <TrackNumber n={project.trackNumber} label={project.role} />
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${project.title} details`}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-5">
          {project.artwork ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-border/60">
              <Image
                src={project.artwork.src}
                alt={project.artwork.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            /* Text on --foreground/--muted-foreground, tint reserved for
               the background wash only — see ProjectCard.tsx for why. */
            <div className="flex aspect-[16/10] flex-col justify-between rounded-xl bg-album-tint/15 p-6">
              <TrackNumber n={project.trackNumber} className="text-sm text-muted-foreground" />
              <p className="font-headline text-4xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-5xl">
                {project.title}
              </p>
            </div>
          )}

          <h3 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</h3>
          <p className="text-base font-medium text-foreground/90">{project.tagline}</p>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{project.description}</p>

          <StackList stack={project.stack} />

          <div className="flex flex-wrap gap-2 pt-1">
            {project.links.map((link, i) => {
              const meta = LINK_META[link.type];
              const Icon = meta.icon;
              const primary = i === 0;
              return (
                <Button
                  key={link.href}
                  asChild
                  size="sm"
                  variant={primary ? 'default' : 'outline'}
                  className={primary ? 'rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold' : 'rounded-full hover:border-primary hover:text-primary transition-colors'}
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="mr-1.5 h-4 w-4" />
                    {meta.label}
                  </a>
                </Button>
              );
            })}
          </div>
        </div>

        {notes && (
          <div>
            <Separator className="mb-6 lg:hidden" />
            <LinerNotes notes={notes} />
          </div>
        )}
      </div>
    </div>
  );
}
