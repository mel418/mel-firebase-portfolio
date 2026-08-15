'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Grain } from '@/components/primitives/Grain';
import { CustomCursor } from '@/components/primitives/CustomCursor';
import { MagneticWrap } from '@/components/primitives/MagneticWrap';

type Props = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
};

export function SpotifyShell({ leftPanel, rightPanel, children }: Props) {
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex min-h-dvh">
      {/* Decorative backdrop — viewport-pinned rather than a background on
          the flex wrapper, since the wrapper now grows to full document
          height (document scroll, not a fixed h-screen shell) and a
          radial-gradient positioned in element-relative percentages would
          otherwise scale against that full height instead of the
          viewport. */}
      <div className="app-backdrop fixed inset-0 -z-10" aria-hidden="true" />
      <Grain />
      <CustomCursor />

      {/* Left library rail — visible md+, pinned via sticky rather than
          relying on a viewport-height ancestor with overflow-hidden. */}
      <div className="hidden md:flex flex-col w-rail shrink-0 sticky top-0 h-dvh bg-card/70 backdrop-blur-xl border-r border-border/60 overflow-y-auto scrollbar-hide">
        {leftPanel}
      </div>

      {/* Main content — scrolls with the document now, not internally.
          id + tabIndex are the SkipLink's target: tabIndex={-1} lets the
          browser move keyboard focus here on jump, without adding <main>
          to the normal tab order. */}
      <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 focus:outline-none">
        {children}
      </main>

      {/* Right now-playing panel + toggle (desktop only). Was `xl:relative`
          here too, left over from before this had `sticky` at all — Tailwind's
          responsive variant wins the cascade over the base `sticky` class,
          so the computed position was actually "relative", not "sticky",
          and the panel silently scrolled away with the page instead of
          staying pinned. `sticky` already establishes its own containing
          block for the absolutely-positioned toggle button below, so
          `relative` was redundant even before it became actively harmful. */}
      <div
        className={cn(
          // min-w-0 overrides the flex item's default min-width:auto — without
          // it, w-0 below is a no-op, since the flex-shrink algorithm won't
          // shrink an item below its content's intrinsic size unless told to.
          // (overflow stays visible *here* — the toggle button below is
          // deliberately positioned outside this box on the left; clipping
          // this element would cut the button off. The content div further
          // down carries its own overflow-hidden instead.)
          'hidden xl:flex min-w-0 shrink-0 self-start sticky top-0 bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out',
          rightOpen ? 'w-panel border-l border-border/60' : 'w-0'
        )}
      >
        {/* Toggle button — sits on the left edge of the panel. -left-6 is
            tuned for the open (300px) panel, straddling the boundary with
            main. When collapsed, the panel's own left edge sits flush
            against the viewport's right edge (0 width), so that same -24px
            offset let the button's other 28px of width poke 4px past the
            viewport — the source of a real horizontal scrollbar. -left-8
            pulls it fully back inside when closed. */}
        <MagneticWrap strength={0.3} className={cn('absolute top-12 z-20', rightOpen ? '-left-6' : '-left-8')}>
          <button
            onClick={() => setRightOpen((v) => !v)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-colors',
              rightOpen
                ? 'bg-card border-border hover:bg-accent'
                : 'bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
            )}
            aria-label={rightOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {rightOpen
              ? <ChevronRight className="h-3.5 w-3.5" />
              : <ChevronLeft className="h-3.5 w-3.5" />
            }
          </button>
        </MagneticWrap>

        {/* Panel content — no independent scroll zone anymore. It used to
            be clipped to h-dvh with its own overflow-y-auto, which read
            as an awkward second scrollbar nested inside the page's main
            scroll. Now the panel is unconstrained (self-start so it
            doesn't stretch to match <main>'s height) and just sticky —
            its top stays pinned to the viewport for as long as there's
            page left to scroll, and only in the last stretch of the
            page does it un-stick and scroll normally to reveal whatever
            didn't fit above the fold. One scroll gesture, not two. */}
        {/* overflow-hidden here (not on the outer wrapper) is what actually
            stops the collapsed-but-still-`invisible` content from bleeding
            past the parent's zero width — its buttons/badges don't shrink
            on their own and would otherwise widen the document and leave a
            dead scrollable strip where the panel should have disappeared. */}
        <div className={cn('flex flex-col w-full overflow-hidden', !rightOpen && 'invisible pointer-events-none')}>
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
