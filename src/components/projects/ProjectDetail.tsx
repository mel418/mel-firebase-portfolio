'use client';

import Image from 'next/image';
import { Github, ExternalLink, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DialogTitle } from '@/components/ui/dialog';
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
};

/**
 * Renders as the content of Discography's shared Dialog — no wrapper
 * border/background of its own (DialogContent already provides that)
 * and no close button (Radix's DialogContent renders one). DialogTitle
 * wraps the visible project title via asChild, so it doubles as the
 * dialog's accessible name without changing how it looks.
 */
export function ProjectDetail({ project }: Props) {
  const notes = getLinerNotes(project.slug);

  return (
    <div style={{ ['--album-tint' as string]: project.tint }}>
      <TrackNumber n={project.year} label={project.role} className="pr-8" />

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
              <TrackNumber n={project.year} className="text-sm text-muted-foreground" />
              <p className="font-headline text-4xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-5xl">
                {project.title}
              </p>
            </div>
          )}

          <DialogTitle asChild>
            <h3 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</h3>
          </DialogTitle>
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
