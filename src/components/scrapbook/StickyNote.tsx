import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Tape } from './Tape';

type Props = {
  children: ReactNode;
  className?: string;
  rotate?: number;
  tape?: 'gingham' | 'beige' | 'sage';
};

/** A handwritten sticky note taped on with washi. Keep the copy short —
 *  Caveat is a display hand, not a reading face. */
export function StickyNote({ children, className, rotate = -3, tape = 'beige' }: Props) {
  return (
    <div
      className={cn(
        'relative rounded-md bg-accent px-5 pb-4 pt-5 font-hand text-2xl leading-[1.1] text-accent-foreground',
        'shadow-[0_8px_18px_-8px_hsl(var(--foreground)/0.35)]',
        className
      )}
      style={{ rotate: `${rotate}deg` }}
    >
      <Tape variant={tape} width={78} rotate={rotate * -1.5} className="-top-3 left-1/2 -translate-x-1/2" />
      {children}
    </div>
  );
}
