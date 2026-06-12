'use client';

import Image from 'next/image';
import { SiSpotify } from '@icons-pack/react-simple-icons';
import { Skeleton } from '@/components/ui/skeleton';

export type Song = {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
};

type Props = {
  song: Song;
  variant?: 'compact' | 'expanded';
};

export function NowPlaying({ song, variant = 'compact' }: Props) {
  if (variant === 'expanded') {
    return (
      <a
        href={song?.songUrl || 'https://open.spotify.com'}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="space-y-3 hover:opacity-90 transition-opacity">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg ring-1 ring-border/40 bg-muted">
            {song?.albumImageUrl ? (
              <Image
                src={song.albumImageUrl}
                alt={song.album || 'Spotify album art'}
                fill
                className="object-cover"
                sizes="280px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <SiSpotify className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <SiSpotify
                className="h-6 w-6 drop-shadow-lg"
                color={song?.isPlaying ? '#1DB954' : 'currentColor'}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {song?.isPlaying && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
              )}
              <p className="font-semibold text-base truncate">
                {song?.isPlaying ? song.title : 'Not playing'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {song?.isPlaying ? song.artist : 'Spotify'}
            </p>
          </div>

          {/* Decorative static progress bar */}
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full w-[42%] rounded-full bg-primary" />
          </div>
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
