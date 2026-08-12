'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Grain } from '@/components/primitives/Grain';

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

      {/* Left library rail — visible md+, pinned via sticky rather than
          relying on a viewport-height ancestor with overflow-hidden. */}
      <div className="hidden md:flex flex-col w-rail shrink-0 sticky top-0 h-dvh bg-card/70 backdrop-blur-xl border-r border-border/60 overflow-y-auto scrollbar-hide">
        {leftPanel}
      </div>

      {/* Main content — scrolls with the document now, not internally. */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

      {/* Right now-playing panel + toggle (desktop only) */}
      <div
        className={cn(
          'hidden xl:flex xl:relative shrink-0 sticky top-0 h-dvh bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out',
          rightOpen ? 'w-panel border-l border-border/60' : 'w-0'
        )}
      >
        {/* Toggle button — sits on the left edge of the panel */}
        <button
          onClick={() => setRightOpen((v) => !v)}
          className={cn(
            'absolute -left-6 top-12 z-20 flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-colors',
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

        {/* Panel content — hidden when collapsed */}
        <div
          className={cn(
            'flex flex-col h-full overflow-y-auto scrollbar-hide w-full',
            !rightOpen && 'invisible pointer-events-none'
          )}
        >
          {rightPanel}
        </div>
      </div>
    </div>
  );
}
