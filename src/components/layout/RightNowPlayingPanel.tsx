'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NowPlaying, type Song } from '@/components/NowPlaying';
import { ThemeToggle } from '@/components/ThemeToggle';
import { site } from '@/content';
import { NowViewing } from '@/components/layout/NowViewing';
import { ErrorBoundary } from '@/components/primitives/ErrorBoundary';

const githubHref = site.socials.find((s) => s.type === 'github')!.href;
const linkedinHref = site.socials.find((s) => s.type === 'linkedin')!.href;
const emailHref = site.socials.find((s) => s.type === 'email')!.href;

type Props = {
  song: Song;
};

export function RightNowPlayingPanel({ song }: Props) {
  return (
    <aside aria-label="Now playing context" className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="z-10 bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Now Playing — Spotify</p>
        <ThemeToggle />
      </div>

      {/* The panel is exactly one screen tall (SpotifyShell: h-dvh), so the
          body is a flex column that fits it: the Spotify art flexes to fill
          what's left, and the optional About-the-artist copy drops out on
          short screens (max-height query below). overflow-y-auto +
          scrollbar-hide is only a safety net for extremely short windows —
          no visible scrollbar, but nothing becomes unreachable. */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide">
        {/* Section-context companion — isolated so a bug here can never
            take down the real Spotify widget below it. */}
        <ErrorBoundary>
          <NowViewing />
        </ErrorBoundary>

        <Separator />

        {/* Expanded Now Playing widget — flexes to fill the leftover height */}
        <div className="flex min-h-0 flex-1 flex-col">
          <NowPlaying song={song} variant="expanded" />
        </div>

        <Separator />

        {/* About the Artist */}
        <div className="flex shrink-0 flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the artist</p>

          <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl">
            <Image
              src={site.heroArtwork.src}
              alt={site.heroArtwork.alt}
              fill
              className="object-cover object-center"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <p className="text-white font-extrabold font-headline text-lg leading-tight tracking-tight">{site.name}</p>
            </div>
          </div>

          {/* One line of context; hidden on screens shorter than 940px so the
              panel always fits without scrolling. */}
          <p className="text-sm leading-relaxed text-muted-foreground [@media(max-height:940px)]:hidden">
            {site.bioShort}
          </p>
        </div>

        <Separator />

        {/* Social links */}
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full hover:border-primary hover:text-primary transition-colors">
            <a href={githubHref} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full hover:border-primary hover:text-primary transition-colors">
            <a href={linkedinHref} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full hover:border-primary hover:text-primary transition-colors">
            <a href={emailHref} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
}
