import { skillsWithUsage, type SkillCategory } from '@/content';
import { InstrumentCard } from './InstrumentCard';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { AnimateIn } from '@/components/AnimateIn';
import Image from 'next/image';

// Category labels/icons for display — content (skills.ts) stays pure data.
// Order matches how this has always rendered (Languages / Web / Databases
// / Tools); only grid-visible skills (showInGrid: true) appear here.
const GROUPS: { category: SkillCategory; label: string; folder: string }[] = [
  { category: 'languages', label: 'Languages', folder: 'folder-star' },
  { category: 'frameworks', label: 'Web', folder: 'folder-heart' },
  { category: 'data', label: 'Databases', folder: 'folder-bow' },
  { category: 'tools', label: 'Tools', folder: 'folder-star' },
];

/** The skills section — a "sound palette" of instrument cards, entirely
 *  server-rendered (no client component, no JS) since the hover/focus
 *  lift is pure CSS and the usage cross-reference is computed at build
 *  time in src/content/index.ts. */
export function SoundPalette() {
  return (
    <div className="divide-y-2 divide-dashed divide-primary/20 border-y-2 border-dashed border-primary/20">
      {GROUPS.map((group, gi) => {
        const items = skillsWithUsage.filter((s) => s.showInGrid && s.category === group.category);
        if (items.length === 0) return null;
        return (
          <AnimateIn key={group.category} delay={gi * 80}>
            <div className="grid gap-4 py-7 sm:grid-cols-[180px_1fr]">
              <div className="flex items-center gap-2.5">
                <Image src={`/stickers/${group.folder}.png`} alt="" width={152} height={128} sizes="56px" className="h-auto w-14 shrink-0" />
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
