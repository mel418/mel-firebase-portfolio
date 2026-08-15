import { Play, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimateIn } from '@/components/AnimateIn';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import type { ExperienceEntry } from '@/content';

export type { ExperienceEntry };

type Props = {
  experience: ExperienceEntry[];
};

/**
 * One responsive <details>-based tracklist instead of a desktop <table>
 * plus a separate mobile list. The old table version's row was a plain
 * `<TableRow onClick>` with no role/tabIndex/aria-expanded — genuinely
 * keyboard-inaccessible. <details>/<summary> is natively keyboard-
 * operable (Enter/Space), works with JS disabled, and needs no ARIA
 * bookkeeping — the browser owns all of that for free.
 *
 * Trade-off accepted deliberately: native <details> snaps open/closed
 * instantly rather than animating height (animating it would mean
 * either a Chromium-only CSS feature or re-adding JS, which would give
 * back the "works with no JS" property this rewrite is for).
 */
function ExperienceRow({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const initials = entry.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <details className="group border-b border-border/50 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5 sm:px-2">
        <span className="w-6 shrink-0 text-center">
          <TrackNumber n={index + 1} className="group-hover:hidden" />
          <Play className="mx-auto hidden h-4 w-4 fill-primary text-primary group-hover:block" />
        </span>

        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/20 text-xs font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
            {entry.role}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {entry.company}
            <span className="sm:hidden"> · {entry.dateRange}</span>
          </p>
        </div>

        <span className="hidden shrink-0 whitespace-nowrap text-xs text-muted-foreground sm:block">
          {entry.dateRange}
        </span>
        <Badge variant="secondary" className="hidden shrink-0 text-xs md:inline-flex">
          {entry.category}
        </Badge>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="bg-muted/20 py-3 pl-[3.75rem] pr-4 sm:pl-14">
        <ul className="ml-4 space-y-1.5 border-l-2 border-primary/30 pl-4">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

export function ExperienceTracklist({ experience }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
      {experience.map((entry, i) => (
        <AnimateIn key={entry.slug} delay={i * 60}>
          <ExperienceRow entry={entry} index={i} />
        </AnimateIn>
      ))}
    </div>
  );
}
