import { Award, Users, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import type { Education } from '@/content';

function Field({ icon: Icon, label, children }: { icon: typeof Award; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:gap-6">
      <dt className="flex items-center gap-1.5 pt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

/** Education framed like a release card — the degree as the headline,
 *  graduation as a release date, coursework as a tracklist of chips
 *  rather than a prose sentence. */
export function ReleaseCard({ education }: { education: Education }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/40 p-6 sm:p-8">
      <div className="flex flex-col gap-1.5 border-b border-border/60 pb-6 mb-6 sm:flex-row sm:items-baseline sm:justify-between">
        <div className="space-y-1.5">
          <Eyebrow>Release</Eyebrow>
          <h3 className="font-headline text-xl font-bold tracking-tight sm:text-2xl">{education.school}</h3>
          <p className="text-sm font-medium text-accent-ink sm:text-base">
            {education.degree} · GPA {education.gpa}
          </p>
        </div>
        <p className="shrink-0 whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
          Released {education.graduated}
        </p>
      </div>

      <dl className="space-y-5">
        <Field icon={GraduationCap} label="Coursework">
          <div className="flex flex-wrap gap-2">
            {education.coursework.map((course) => (
              <Badge key={course} variant="secondary">{course}</Badge>
            ))}
          </div>
        </Field>

        <Field icon={Award} label="Honors">
          <p className="text-sm text-foreground/80 sm:text-base">{education.honors.join(' · ')}</p>
        </Field>

        <Field icon={Users} label="Affiliations">
          <div className="flex flex-wrap gap-2">
            {education.affiliations.map((a) => (
              <Badge key={a} variant="secondary">{a}</Badge>
            ))}
          </div>
        </Field>
      </dl>
    </div>
  );
}
