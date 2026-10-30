'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * A record you can set spinning. The disc and its reflection are separate
 * Pillow-made layers (public/props), so the record turns under a sheen that
 * holds still. Spins on hover or when toggled on; stays put under
 * prefers-reduced-motion (see .prop-spin in globals.css).
 */
export function VinylRecord({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={playing}
      onClick={() => setPlaying((v) => !v)}
      className={cn(
        'group relative block aspect-square rounded-full transition-transform duration-300 ease-editorial hover:scale-[1.03]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background',
        playing && 'prop-live',
        className
      )}
    >
      <span className="sr-only">{playing ? 'Stop the record' : 'Spin the record'}</span>
      <Image
        src="/props/vinyl.png"
        alt=""
        width={480}
        height={480}
        sizes="(max-width: 640px) 60vw, 220px"
        className="prop-spin absolute inset-0 h-full w-full"
        style={{ ['--prop-spin-dur' as string]: '3.2s' }}
        draggable={false}
      />
      <Image
        src="/props/vinyl-sheen.png"
        alt=""
        width={480}
        height={480}
        sizes="(max-width: 640px) 60vw, 220px"
        className="pointer-events-none absolute inset-0 h-full w-full"
        draggable={false}
      />
    </button>
  );
}
