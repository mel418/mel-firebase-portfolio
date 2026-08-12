'use client';

import { useActiveSection } from '@/hooks/use-active-section';
import { navTracks } from '@/content';
import { Eyebrow } from '@/components/primitives/Eyebrow';

/**
 * Section-level "context" companion to the real Spotify widget — reflects
 * which of the six sections is currently in view. Deliberately scoped to
 * sections, not individual projects: per-project "NOW VIEWING" needs the
 * Discography rework (Phase 5) to exist as a trackable unit first.
 *
 * Labelled and visually separated from "Now Playing — Spotify" in the
 * parent panel on purpose — unlabelled and adjacent, the two would read
 * as one fake feature, and the site's one genuinely live integration
 * would look like decoration.
 */
export function NowViewing() {
  const activeId = useActiveSection();
  const index = navTracks.findIndex((t) => t.id === activeId);
  const current = navTracks[index] ?? navTracks[0];
  const next = navTracks[(index + 1) % navTracks.length];

  return (
    <div className="space-y-2">
      <Eyebrow>Now Viewing</Eyebrow>
      <div className="flex items-baseline gap-2">
        <span className="font-code text-xs text-muted-foreground [font-variant-numeric:tabular-nums]">
          {current.trackNumber}
        </span>
        <p className="font-headline text-lg font-bold tracking-tight">{current.label}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Next: <span className="text-foreground/80">{next.label}</span>
      </p>
    </div>
  );
}
