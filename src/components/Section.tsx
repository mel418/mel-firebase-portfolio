import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AnimateIn } from './AnimateIn';
import { Eyebrow } from './primitives/Eyebrow';

type SectionProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  eyebrow?: string;
  hideHeader?: boolean;
  /** Decorative stickers for the header's right side (aria-hidden art only). */
  decoration?: ReactNode;
};

export function Section({ id, title, icon: Icon, children, eyebrow, hideHeader = false, decoration }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 px-4 sm:px-8 py-12 sm:py-16">
      {!hideHeader && (
        <AnimateIn>
          <header className="relative mb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <Eyebrow>{eyebrow ?? title}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-headline tracking-tight leading-[1.05]">
              {title}
            </h2>
            {decoration}
            <div aria-hidden="true" className="gingham mt-5 h-2.5 w-full rounded-full [mask-image:linear-gradient(90deg,#000_55%,transparent)]" />
          </header>
        </AnimateIn>
      )}
      {children}
    </section>
  );
}
