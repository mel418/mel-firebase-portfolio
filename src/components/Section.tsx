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
};

export function Section({ id, title, icon: Icon, children, eyebrow, hideHeader = false }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 px-4 sm:px-8 py-12 sm:py-16">
      {!hideHeader && (
        <AnimateIn>
          <header className="mb-10">
            <div className="flex items-center gap-2.5 mb-3">
              <Icon className="w-4 h-4 text-primary shrink-0" />
              <Eyebrow>{eyebrow ?? title}</Eyebrow>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-headline tracking-tight leading-[1.05]">
              {title}
            </h2>
            <div className="mt-5 h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent" />
          </header>
        </AnimateIn>
      )}
      {children}
    </section>
  );
}
