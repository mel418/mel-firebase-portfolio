import { AnimateIn } from '@/components/AnimateIn';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { alsoWorkedWith, skillGroups } from '@/content';

/** The resume's four skill groups as quiet rows of chips — no icons, no
 *  tiles. Coursework-level languages sit underneath as a muted line so the
 *  main rows stay exactly what the resume claims. */
export function SkillGroups() {
  return (
    <div>
      <div className="divide-y divide-border border-y border-border">
        {skillGroups.map((group, i) => (
          <AnimateIn key={group.label} delay={i * 60}>
            <div className="grid gap-5 py-9 sm:grid-cols-[11rem_1fr] sm:gap-10">
              <Eyebrow className="sm:pt-2">{group.label}</Eyebrow>
              <ul className="flex flex-wrap gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground/90 transition-colors hover:border-primary/60 hover:text-accent-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </AnimateIn>
        ))}
      </div>
      <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground/80">Also worked with</span> (coursework and side projects): {alsoWorkedWith.join(', ')}.
      </p>
    </div>
  );
}
