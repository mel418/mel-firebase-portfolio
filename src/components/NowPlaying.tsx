'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SiSpotify } from '@icons-pack/react-simple-icons';
import { Skeleton } from '@/components/ui/skeleton';

export type Song = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
};

type Props = {
  song: Song;
  variant?: 'compact' | 'expanded';
};

/**
 * Progress is a snapshot from the server render, not a live poll — so
 * rather than freeze at that snapshot (or worse, fake it, which is what
 * this replaced: a hardcoded 42%-full bar shown even while "Not playing"),
 * this animates from the real snapshot to 100% over the real remaining
 * time via a single CSS transition. No interval, no re-render per second.
 */
function LiveProgressBar({ progressMs, durationMs }: { progressMs: number; durationMs: number }) {
  const initialPct = Math.min(100, (progressMs / durationMs) * 100);
  const [pct, setPct] = useState(initialPct);
  const remainingMs = Math.max(0, durationMs - progressMs);

  useEffect(() => {
    if (remainingMs <= 0) return;
    const raf = requestAnimationFrame(() => setPct(100));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressMs, durationMs]);

  return (
    <div className="relative h-1 w-full rounded-full bg-muted">
      <div
        className="relative h-full rounded-full bg-primary"
        style={{ width: `${pct}%`, transitionProperty: 'width', transitionTimingFunction: 'linear', transitionDuration: `${remainingMs}ms` }}
      >
        {/* The knob is a child of the fill, so it rides the same single CSS
            transition — no second animation to keep in sync. */}
        <span aria-hidden="true" className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <Image src="/stickers/flower-knob.png" alt="" width={102} height={102} sizes="22px" className="h-[22px] w-[22px]" />
        </span>
      </div>
    </div>
  );
}

export function NowPlaying({ song, variant = 'compact' }: Props) {
  if (variant === 'expanded') {
    return (
      <a
        href={song?.songUrl || 'https://open.spotify.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col gap-3 hover:opacity-90 transition-opacity">
          {/* The art takes whatever height the panel has left (the panel is
              exactly one screen tall — no scrolling). Size-container + min()
              keeps it a true square at any height: as wide as the column
              allows, but never taller than the space available. */}
          <div className="max-h-[16.75rem] min-h-[6rem] flex-1 [container-type:size]">
          <div className="relative mx-auto aspect-square w-[min(100cqw,100cqh)]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-muted">
            {song?.albumImageUrl ? (
              <Image
                src={song.albumImageUrl}
                alt={song.album || 'Spotify album art'}
                fill
                className="object-cover"
                sizes="280px"
              />
            ) : (
              <Image
                src="/stickers/album-cloud.png"
                alt=""
                fill
                className="object-cover dark:brightness-[0.7]"
                sizes="280px"
              />
            )}
            <div className="absolute top-2 right-2 rounded-full bg-card/90 p-1.5 shadow-md">
              <SiSpotify
                className="h-5 w-5"
                color={song?.isPlaying ? '#1DB954' : 'currentColor'}
              />
            </div>
            </div>
          </div>
          </div>

          <div className="shrink-0 space-y-1">
            <div className="flex items-center gap-2">
              {song?.isPlaying && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
              <p className="font-headline font-extrabold text-base truncate">
                {song?.isPlaying ? song.title : 'Not playing'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {song?.isPlaying ? song.artist : 'Spotify'}
            </p>
          </div>

          {song?.isPlaying && song.progressMs !== undefined && song.durationMs !== undefined && (
            <div className="shrink-0">
              <LiveProgressBar progressMs={song.progressMs} durationMs={song.durationMs} />
            </div>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={song?.songUrl || 'https://open.spotify.com'}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 block"
    >
      <div className="flex items-center gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-accent">
        <div className="relative h-16 w-16">
          {song?.albumImageUrl ? (
            <Image
              src={song.albumImageUrl}
              alt={song.album || 'Spotify album art'}
              fill
              className="rounded-md object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
              <SiSpotify className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="flex items-center gap-2 truncate font-semibold text-sm">
            {song?.isPlaying && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
            {song?.isPlaying ? song.title : 'Not playing'}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {song?.isPlaying ? song.artist : 'Spotify'}
          </p>
        </div>
        <SiSpotify className="h-6 w-6 shrink-0" color={song?.isPlaying ? '#1DB954' : 'currentColor'} />
      </div>
    </a>
  );
}

export function NowPlayingSkeleton() {
  return (
    <div className="mt-4 block">
      <div className="flex items-center gap-4 rounded-lg border bg-card p-3">
        <Skeleton className="h-16 w-16 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    </div>
  );
}
