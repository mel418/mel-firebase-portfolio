'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NowPlaying, type Song } from '@/components/NowPlaying';
import { ThemeToggle } from '@/components/ThemeToggle';

type Props = {
  song: Song;
};

export function RightNowPlayingPanel({ song }: Props) {
  return (
    <aside className="flex flex-col h-full">
      {/* Sticky header — stays put while panel body scrolls */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40 shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Now Playing</p>
        <ThemeToggle />
      </div>

      {/* Scrollable body */}
      <div className="p-4 space-y-6">
        {/* Expanded Now Playing widget */}
        <NowPlaying song={song} variant="expanded" />

        <Separator />

        {/* About the Artist */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the artist</p>

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-border/60">
            <Image
              src="/PFP2.JPG"
              alt="Melody Gatan"
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
              <p className="text-white font-bold font-headline text-lg leading-tight tracking-tight">Melody Gatan</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Full-stack engineer & CS grad from CSULB. I build production apps by day and drink too much matcha by night. Open to work! 👋
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-primary/40 text-primary">CSULB CS &apos;25</Badge>
            <Badge variant="outline" className="text-xs border-primary/40 text-primary">GPA 3.66</Badge>
            <Badge variant="outline" className="text-xs">Bellflower, CA</Badge>
            <Badge variant="outline" className="text-xs">Open to Work</Badge>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs text-muted-foreground">WiC · ACM · SWE</span>
          </div>
        </div>

        <Separator />

        {/* Social links */}
        <div className="flex gap-2 pb-4">
          <a href="https://github.com/mel418" target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-full hover:border-primary hover:text-primary transition-colors">
              <Github className="h-4 w-4" />
            </Button>
          </a>
          <a href="https://linkedin.com/in/melody-gatan" target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-full hover:border-primary hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </Button>
          </a>
          <a href="mailto:melodygatan@gmail.com" className="flex-1">
            <Button variant="outline" size="sm" className="w-full rounded-full hover:border-primary hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </aside>
  );
}
