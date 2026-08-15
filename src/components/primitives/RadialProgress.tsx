import { cn } from '@/lib/utils';

type Props = {
  /** Stroke thickness in px */
  thickness?: number;
  className?: string;
};

/**
 * A continuously-sweeping ring, pure CSS — no JS, animates on the
 * compositor via a registered custom property (`@property --ring-progress`,
 * globals.css) driving a conic-gradient, masked down to a ring with the
 * standard radial-gradient mask trick. Reads as ambient motion ("this
 * scene is alive") rather than a literal playback percentage.
 *
 * Absolutely positioned by the caller — size it via inset/width on the
 * wrapping element.
 */
export function RadialProgress({ thickness = 3, className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-ring-sweep motion-ambient pointer-events-none rounded-full', className)}
      style={{
        background: 'conic-gradient(hsl(var(--primary) / 0.55) calc(var(--ring-progress) * 1%), transparent 0)',
        WebkitMaskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
        maskImage: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
      }}
    />
  );
}
