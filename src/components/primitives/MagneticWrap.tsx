'use client';

import type { ReactNode } from 'react';
import { useMagnetic } from '@/lib/motion/useMagnetic';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

/**
 * Wraps a single CTA with a subtle magnetic pull toward the pointer.
 * Reserved for a handful of important buttons (hero resume CTA, record
 * play/pause, contact copy-email, panel collapse toggle) — not applied
 * broadly, per the brief's "reserve special interactions for important
 * elements." Does nothing on touch or under reduced motion (useMagnetic
 * never attaches its listeners in either case).
 */
export function MagneticWrap({ children, strength = 0.25, className }: Props) {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return (
    <div
      ref={ref}
      className={cn('inline-block transition-transform duration-200 ease-out', className)}
      style={{ transform: 'translate(var(--mx, 0px), var(--my, 0px))' }}
    >
      {children}
    </div>
  );
}
