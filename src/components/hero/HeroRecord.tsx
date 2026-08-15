'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import { RadialProgress } from '@/components/primitives/RadialProgress';
import { MagneticWrap } from '@/components/primitives/MagneticWrap';
import { cn } from '@/lib/utils';
import type { Artwork } from '@/content';

type Props = {
  artwork: Artwork;
};

/**
 * The hero's signature interaction. Three independent layers, not one
 * rotating photo — a portrait spinning a full 360° would flip upside
 * down at the halfway point, which reads as broken rather than elevated.
 * Instead: an outer sweeping progress ring (abstract, safe to animate),
 * a rotating "record" rim showing as a thin groove-textured edge, and
 * the photo itself dead-center and always upright. Rotation lives on the
 * rim only.
 */
export function HeroRecord({ artwork }: Props) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="parallax-hero motion-ambient relative aspect-square w-40 sm:w-48 shrink-0">
      <RadialProgress thickness={2.5} className="absolute -inset-3" />

      {/* Rotating rim — grooved record texture, visible as the ring
          around the inset photo. Pausing preserves the current angle
          (animation-play-state), which a JS transform couldn't do for
          free. */}
      <div
        className="motion-ambient absolute inset-0 rounded-full shadow-xl animate-spin-slow"
        style={{
          animationPlayState: paused ? 'paused' : 'running',
          background:
            'repeating-radial-gradient(circle at center, hsl(var(--primary) / 0.35) 0px, hsl(var(--primary) / 0.35) 1px, transparent 1px, transparent 4px), hsl(var(--primary) / 0.15)',
        }}
      />

      {/* Static portrait — never rotates */}
      <div className="absolute inset-[9%] overflow-hidden rounded-full ring-4 ring-background">
        <Image
          src={artwork.src}
          alt={artwork.alt}
          fill
          className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
          sizes="(max-width: 640px) 160px, 192px"
          priority
        />
      </div>

      <MagneticWrap strength={0.35} className="absolute -bottom-1 -right-1 z-20">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Resume the spinning record animation' : 'Pause the spinning record animation'}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full',
            'bg-primary text-primary-foreground shadow-lg ring-4 ring-background',
            'transition-transform duration-200 hover:scale-105 active:scale-95'
          )}
        >
          {paused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4 fill-current" />}
        </button>
      </MagneticWrap>
    </div>
  );
}
