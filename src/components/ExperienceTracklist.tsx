import { AnimateIn } from '@/components/AnimateIn';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { TrackNumber } from '@/components/primitives/TrackNumber';
import type { ExperienceEntry, Hackathon } from '@/content';

export type { ExperienceEntry };

type Props = {
  experience: ExperienceEntry[];
  hackathons: Hackathon[];
};

/** Experience as a plain tracklist — number, role, dates — with each entry's
 *  one real sentence always visible. With only a couple of entries there is
 *  nothing worth hiding behind a disclosure. */
export function ExperienceTracklist({ experience, hackathons }: Props) {
  return (
    <div className="space-y-24">
      <ol className="divide-y divide-border border-y border-border">
        {experience.map((entry, i) => (
          <li key={entry.slug}>
            <AnimateIn delay={i * 60}>
              <div className="grid grid-cols-[2.25rem_1fr] gap-x-4 gap-y-3 py-10 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6">
                <TrackNumber n={i + 1} className="pt-1.5" />
                <div className="space-y-1">
                  <h3 className="font-headline text-xl font-bold tracking-tight sm:text-2xl">{entry.role}</h3>
                  <p className="text-sm text-muted-foreground">{entry.company}</p>
                </div>
                <p className="col-start-2 text-sm text-muted-foreground sm:col-start-3 sm:row-start-1 sm:pt-1.5 sm:text-right">
                  {entry.dateRange}
                </p>
                <p className="col-start-2 max-w-xl text-base leading-relaxed text-foreground/80">{entry.bullets[0]}</p>
              </div>
            </AnimateIn>
          </li>
        ))}
      </ol>

      <AnimateIn>
        <Eyebrow>Hackathons</Eyebrow>
        <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {hackathons.map((h) => (
            <li key={h.name} className="space-y-1">
              <p className="font-code text-xs text-muted-foreground">{h.year}</p>
              <p className="font-headline text-lg font-bold tracking-tight">{h.name}</p>
              <p className="text-sm text-muted-foreground">
                {h.detail}
                {h.result && <span className="font-semibold text-accent-ink"> · {h.result}</span>}
              </p>
            </li>
          ))}
        </ul>
      </AnimateIn>
    </div>
  );
}
