import { Eyebrow } from '@/components/primitives/Eyebrow';
import type { Education } from '@/content';

/** Education, framed like a release: the degree as the headline, the
 *  transcript as the tracklist. */
export function ReleaseCard({ education }: { education: Education }) {
  return (
    <div className="space-y-16">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h3 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{education.school}</h3>
          <p className="text-base text-muted-foreground">{education.degree}</p>
          <p className="text-sm text-muted-foreground">Graduated {education.graduated}</p>
        </div>
        <div className="sm:text-right">
          <p className="font-headline text-6xl font-extrabold leading-none tracking-tight text-accent-ink">{education.gpa}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Cumulative GPA</p>
        </div>
      </div>

      <div className="grid gap-14 sm:grid-cols-[1.5fr_1fr] sm:gap-16">
        <div>
          <Eyebrow>Coursework</Eyebrow>
          <ul className="mt-6 divide-y divide-border">
            {education.coursework.map((course) => (
              <li key={course} className="py-3 text-sm text-foreground/90">
                {course}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-10">
          <div>
            <Eyebrow>Honors</Eyebrow>
            <ul className="mt-6 space-y-2 text-sm text-foreground/90">
              {education.honors.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Affiliations</Eyebrow>
            <ul className="mt-6 space-y-2 text-sm text-foreground/90">
              {education.affiliations.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
