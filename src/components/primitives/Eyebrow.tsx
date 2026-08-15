import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  /** Small pulsing dot before the label — used for "live" states like NOW PLAYING */
  live?: boolean;
  className?: string;
};

/**
 * Small letterspaced label — the site's recurring "eyebrow" typographic
 * voice (NOW PLAYING, OPEN TO WORK, SELECTED WORK, ...). Previously
 * hand-styled inline in a few places with the same classes repeated;
 * this is the shared version.
 */
export function Eyebrow({ children, live = false, className }: Props) {
  return (
    <p className={cn('inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground', className)}>
      {live && <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse motion-ambient" />}
      {children}
    </p>
  );
}
