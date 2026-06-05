'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, ExternalLink, X, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnimateIn } from '@/components/AnimateIn';
import { cn } from '@/lib/utils';

type Project = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  tags: string[];
  dataAiHint?: string;
};

type Props = {
  projects: Project[];
};

type Lightbox = {
  imageUrl: string;
  href: string;
  title: string;
};

function ProjectRow({
  project,
  index,
  onPreview,
}: {
  project: Project;
  index: number;
  onPreview: (p: Project) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        className="group border-b border-border/50 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <TableCell className="w-10 text-center">
          <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
          <Play className="h-4 w-4 text-primary fill-primary hidden group-hover:block mx-auto" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            {/* Thumbnail — click opens lightbox, stops row expand */}
            <button
              type="button"
              className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted hover:ring-2 hover:ring-primary/60 transition-all focus:outline-none"
              onClick={(e) => { e.stopPropagation(); onPreview(project); }}
              aria-label={`Preview ${project.title}`}
            >
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {project.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {project.description}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </TableCell>
        <TableCell className="w-10">
          <div className="flex items-center gap-1">
            <ExternalLink
              className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.href, '_blank', 'noopener,noreferrer');
              }}
            />
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                open && 'rotate-180'
              )}
            />
          </div>
        </TableCell>
      </TableRow>

      {/* Expanded detail row */}
      {open && (
        <tr>
          <td colSpan={4} className="pb-4 pt-1 bg-muted/20">
            <div className="pl-16 pr-4 space-y-3 border-l-2 border-primary/30 ml-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="hover:border-primary hover:text-primary transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.href, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                View Project
              </Button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function ProjectsTracklist({ projects }: Props) {
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  function openLightbox(project: Project) {
    setLightbox({ imageUrl: project.imageUrl, href: project.href, title: project.title });
  }

  return (
    <>
      <div>
        {/* Desktop table */}
        <div className="px-4 sm:px-6 hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="w-10 text-muted-foreground">#</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground hidden lg:table-cell">Stack</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, i) => (
                <ProjectRow
                  key={project.title}
                  project={project}
                  index={i}
                  onPreview={openLightbox}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile list — details/summary for expand */}
        <ul className="md:hidden px-4 space-y-2 mt-2">
          {projects.map((project, i) => (
            <AnimateIn key={project.title} delay={i * 80}>
              <li>
                <details className="group rounded-lg border border-border overflow-hidden">
                  <summary className="flex items-center gap-3 p-3 cursor-pointer bg-card hover:bg-accent transition-colors list-none">
                    <button
                      type="button"
                      className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-muted focus:outline-none"
                      onClick={(e) => { e.preventDefault(); openLightbox(project); }}
                      aria-label={`Preview ${project.title}`}
                    >
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{project.tags.join(' · ')}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3 bg-muted/30 space-y-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Project
                    </a>
                  </div>
                </details>
              </li>
            </AnimateIn>
          ))}
        </ul>
      </div>

      {/* Lightbox overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>

          <p className="absolute bottom-6 left-0 right-0 text-center text-white/50 text-xs pointer-events-none select-none">
            Click image to open project · Click outside to close
          </p>

          <button
            type="button"
            className="relative w-[min(90vw,900px)] h-[min(80vh,600px)] cursor-pointer focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              window.open(lightbox.href, '_blank', 'noopener,noreferrer');
            }}
            aria-label={`Open ${lightbox.title}`}
          >
            <Image
              src={lightbox.imageUrl}
              alt={lightbox.title}
              fill
              className="object-contain rounded-xl shadow-2xl"
              sizes="min(90vw, 900px)"
            />
          </button>
        </div>
      )}
    </>
  );
}
