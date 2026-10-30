import type { ReactNode } from 'react';
import { AnimateIn } from './AnimateIn';
import { Eyebrow } from './primitives/Eyebrow';

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  eyebrow?: string;
  /** One quiet sentence under the title. */
  description?: string;
};

/** Every section shares one narrow column and the same generous vertical
 *  rhythm — the whitespace *is* the layout, so there are no dividers. */
export function Section({ id, title, children, eyebrow, description }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-8 py-24 sm:py-32">
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
        <AnimateIn>
          <header className="mb-14 sm:mb-16">
            <Eyebrow>{eyebrow ?? title}</Eyebrow>
            <h2 className="mt-4 font-headline text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{title}</h2>
            {description && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
            )}
          </header>
        </AnimateIn>
        {children}
      </div>
    </section>
  );
}
