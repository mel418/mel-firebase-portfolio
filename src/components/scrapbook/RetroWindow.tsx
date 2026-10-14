import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  /** Shown in the title bar, monospace + uppercase (e.g. "MESSAGE FOR YOU"). */
  title: string;
  children: ReactNode;
  className?: string;
  /** Override the body padding (e.g. "p-0" for a flush list). */
  bodyClassName?: string;
};

/** A small early-desktop "window" frame — title bar, three dots, bordered
 *  body. Pure presentation: the dots are decoration, not controls. */
export function RetroWindow({ title, children, className, bodyClassName }: Props) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border-2 border-primary/40 bg-card paper-card', className)}>
      <div className="flex items-center gap-3 border-b-2 border-primary/30 bg-primary/15 px-4 py-2.5">
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full border border-primary/60 bg-card" />
          <i className="h-2.5 w-2.5 rounded-full border border-primary/60 bg-card" />
          <i className="h-2.5 w-2.5 rounded-full border border-primary/60 bg-primary/50" />
        </span>
        <span className="font-code text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">{title}</span>
      </div>
      <div className={cn('p-5 sm:p-8', bodyClassName)}>{children}</div>
    </div>
  );
}
