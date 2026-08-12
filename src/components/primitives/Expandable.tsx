'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  isOpen: boolean;
  children: ReactNode;
  id?: string;
  className?: string;
};

/**
 * The 0fr -> 1fr grid-template-rows expand trick — universally supported
 * (unlike interpolate-size/allow-discrete, which are Chromium-only),
 * animates height without knowing the content's pixel height in advance,
 * and never requires the content to unmount (so scroll position and any
 * internal state survive collapse/expand). Shared by the discography
 * detail panels (Phase 5) and the experience tracklist rows (Phase 6).
 *
 * Collapsed content gets `inert` (removed from tab order and assistive
 * tech — React treats this as a true boolean attribute, omitting it from
 * the DOM entirely when false) and `aria-hidden`.
 */
export function Expandable({ isOpen, children, id, className }: Props) {
  return (
    <div
      id={id}
      className={cn('grid overflow-hidden transition-[grid-template-rows] duration-slow ease-editorial', className)}
      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
