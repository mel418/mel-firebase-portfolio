import { Code, Layers, Database, Wrench, type LucideIcon } from 'lucide-react';
import { skillsWithUsage, type SkillCategory } from '@/content';
import { InstrumentCard } from './InstrumentCard';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { AnimateIn } from '@/components/AnimateIn';

// Category labels/icons for display — content (skills.ts) stays pure data.
// Order matches how this has always rendered (Languages / Web / Databases
// / Tools); only grid-visible skills (showInGrid: true) appear here.
const GROUPS: { category: SkillCategory; label: string; icon: LucideIcon }[] = [
  { category: 'languages', label: 'Languages', icon: Code },
  { category: 'frameworks', label: 'Web', icon: Layers },
  { category: 'data', label: 'Databases', icon: Database },
  { category: 'tools', label: 'Tools', icon: Wrench },
];

/** The skills section — a "sound palette" of instrument cards, entirely
 *  server-rendered (no client component, no JS) since the hover/focus
 *  lift is pure CSS and the usage cross-reference is computed at build
 *  time in src/content/index.ts. */
export function SoundPalette() {
  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {GROUPS.map((group, gi) => {
        const items = skillsWithUsage.filter((s) => s.showInGrid && s.category === group.category);
        if (items.length === 0) return null;
        return (
          <AnimateIn key={group.category} delay={gi * 80}>
            <div className="grid gap-4 py-7 sm:grid-cols-[180px_1fr]">
              <div className="flex items-center gap-2.5">
                <group.icon className="h-4 w-4 shrink-0 text-primary" />
                <Eyebrow>{group.label}</Eyebrow>
              </div>
              <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
                {items.map((skill) => (
                  <InstrumentCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          </AnimateIn>
        );
      })}
    </div>
  );
}
