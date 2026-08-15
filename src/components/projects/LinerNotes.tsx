import type { LinerNotes as LinerNotesData } from '@/content';
import { Eyebrow } from '@/components/primitives/Eyebrow';

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-1.5">{title}</h4>
      {children}
    </div>
  );
}

export function LinerNotes({ notes }: { notes: LinerNotesData }) {
  return (
    <div className="space-y-5">
      <Eyebrow>Liner Notes</Eyebrow>
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        <Field title="What I built">
          <p className="text-sm text-muted-foreground leading-relaxed">{notes.built}</p>
        </Field>
        <Field title="Why I built it">
          <p className="text-sm text-muted-foreground leading-relaxed">{notes.why}</p>
        </Field>
        <Field title="Technical challenges">
          <ul className="space-y-1.5 list-disc list-inside marker:text-primary">
            {notes.challenges.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">{c}</li>
            ))}
          </ul>
        </Field>
        <Field title="What I learned">
          <ul className="space-y-1.5 list-disc list-inside marker:text-primary">
            {notes.learned.map((c, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">{c}</li>
            ))}
          </ul>
        </Field>
      </div>
    </div>
  );
}
