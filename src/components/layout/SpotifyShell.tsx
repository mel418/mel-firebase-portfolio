'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  children: ReactNode;
};

export function SpotifyShell({ leftPanel, rightPanel, children }: Props) {
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left library rail — visible md+ */}
      <div className="hidden md:flex flex-col w-60 shrink-0 bg-card border-r border-border overflow-y-auto scrollbar-hide">
        {leftPanel}
      </div>

      {/* Main scrollable content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {/* Right now-playing panel + toggle (desktop only) */}
      <div
        className={cn(
          'hidden xl:flex xl:relative shrink-0 bg-card transition-all duration-300 ease-in-out',
          rightOpen ? 'w-[280px] border-l border-border' : 'w-0'
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
