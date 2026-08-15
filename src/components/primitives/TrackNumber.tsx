import { cn } from '@/lib/utils';

type Props = {
  n: string | number;
  label?: string;
  className?: string;
};

/**
 * "01 — INTRO" style track marker. Numbers are zero-padded to 2 digits
 * and set in tabular figures so a run of these (hero, discography,
 * experience) lines up vertically regardless of digit count.
 */
export function TrackNumber({ n, label, className }: Props) {
  const num = typeof n === 'number' ? String(n).padStart(2, '0') : n;
  return (
    <p className={cn('font-code text-xs font-medium tracking-[0.15em] text-muted-foreground [font-variant-numeric:tabular-nums]', className)}>
      {num}
      {label && <span className="text-foreground/70"> — {label}</span>}
    </p>
  );
}
