'use client';

import Image from 'next/image';
import { Play, Github, ExternalLink, Trophy, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/AnimateIn';

export type ProjectLink = {
  type: 'github' | 'live' | 'devpost';
  href: string;
};

export type Project = {
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  tags: string[];
  links: ProjectLink[];
  accolade?: string;
  featured?: boolean;
};

type Props = {
  projects: Project[];
};

const LINK_META: Record<ProjectLink['type'], { label: string; icon: typeof Github }> = {
  github: { label: 'Code', icon: Github },
  live: { label: 'Live', icon: ExternalLink },
  devpost: { label: 'Devpost', icon: Trophy },
};

function LinkButtons({ links, size = 'sm' }: { links: ProjectLink[]; size?: 'sm' | 'default' }) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, i) => {
        const meta = LINK_META[link.type];
        const Icon = meta.icon;
        const primary = i === 0;
        return (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
            <Button
              size={size}
              variant={primary ? 'default' : 'outline'}
              className={
                primary
                  ? 'rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'
                  : 'rounded-full hover:border-primary hover:text-primary transition-colors'
              }
            >
              <Icon className="mr-1.5 h-4 w-4" />
              {meta.label}
            </Button>
          </a>
        );
      })}
    </div>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <AnimateIn>
      <article className="group grid overflow-hidden rounded-3xl border border-border/70 bg-card/40 md:grid-cols-2">
        {/* Cover */}
        <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px] overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-4 p-6 sm:p-9">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              <Play className="h-3 w-3 fill-primary" /> Featured
            </span>
            {project.accolade && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-primary" /> {project.accolade}
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-4xl font-bold font-headline tracking-tight leading-tight">
            {project.title}
          </h3>
          <p className="text-base sm:text-lg font-medium text-foreground/90">{project.tagline}</p>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-primary/30 text-primary text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-1">
            <LinkButtons links={project.links} />
          </div>
        </div>
      </article>
    </AnimateIn>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const primary = project.links[0];

  return (
    <AnimateIn delay={index * 70} className="h-full w-[80vw] shrink-0 snap-center sm:w-auto">
      <a
        href={primary.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          {project.accolade && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <Trophy className="h-3 w-3 text-primary" /> {project.accolade}
            </span>
          )}
          {/* Spotify-style play button */}
          <span className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold font-headline text-lg leading-tight tracking-tight group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[11px]">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </a>
    </AnimateIn>
  );
}

export function ProjectsGallery({ projects }: Props) {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <div className="space-y-6">
      {featured && <FeaturedProject project={featured} />}
      {/* Mobile: horizontal swipe carousel · sm+: responsive grid */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10vw] pb-2 scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 2xl:grid-cols-3">
        {rest.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
