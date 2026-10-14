import Image from 'next/image';
import { cn } from '@/lib/utils';

const TAPES = {
  gingham: { src: '/stickers/tape-gingham.png', w: 240, h: 58 },
  beige: { src: '/stickers/tape-beige.png', w: 200, h: 50 },
  sage: { src: '/stickers/tape-sage.png', w: 200, h: 50 },
} as const;

type Props = {
  variant?: keyof typeof TAPES;
  /** Displayed width in px. */
  width?: number;
  rotate?: number;
  className?: string;
};

/** A strip of washi tape holding something to the page. Decorative only —
 *  position it with `className` (usually `-top-3 left-1/2 -translate-x-1/2`). */
export function Tape({ variant = 'gingham', width = 110, rotate = -4, className }: Props) {
  const t = TAPES[variant];
  return (
    <span
      aria-hidden="true"
      className={cn('pointer-events-none absolute z-10 select-none', className)}
      style={{ width, rotate: `${rotate}deg` }}
    >
      <Image src={t.src} alt="" width={t.w} height={t.h} sizes={`${width}px`} className="h-auto w-full" draggable={false} />
    </span>
  );
}
