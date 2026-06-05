import type { LucideIcon } from 'lucide-react';
import { AnimateIn } from './AnimateIn';

type SectionProps = {
  id: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  hideHeader?: boolean;
};

export function Section({ id, title, icon: Icon, children, hideHeader = false }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 px-4 sm:px-6 py-10">
      {!hideHeader && (
        <AnimateIn>
          <div className="flex items-center gap-3 sm:gap-4 mb-8">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
            <h2 className="text-2xl sm:text-4xl font-bold font-headline">{title}</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
        </AnimateIn>
      )}
      {children}
    </section>
  );
}
