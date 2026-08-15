import { getProject, type SkillWithUsage } from '@/content';
import { skillIconRegistry } from '@/lib/icons';

const CATEGORY_FALLBACK_LABEL: Record<SkillWithUsage['category'], string> = {
  languages: 'Language',
  frameworks: 'Framework',
  data: 'Database',
  ai: 'AI / ML',
  tools: 'Tool',
};

function usageLabel(skill: SkillWithUsage): string {
  if (skill.usageCount === 0) return CATEGORY_FALLBACK_LABEL[skill.category];
  if (skill.usageCount === 1) return `Used in ${getProject(skill.projectSlugs[0])?.title ?? skill.projectSlugs[0]}`;
  return `${skill.usageCount} projects`;
}

/**
 * A single "instrument" in the sound palette — zero client JS. The
 * usage line is always visible rather than hidden-until-hover: a pure
 * hover reveal has no equivalent on touch (no hover, and nothing here
 * is keyboard-focusable to substitute with :focus-within), so hiding
 * real signal behind hover would just make it invisible on mobile.
 * Hover/focus only adds a tactile lift.
 */
export function InstrumentCard({ skill }: { skill: SkillWithUsage }) {
  const Icon = skillIconRegistry[skill.iconSlug ?? skill.id];

  return (
    <div
      tabIndex={0}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 focus-visible:-translate-y-0.5 focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {Icon ? (
        <Icon className="h-6 w-6 shrink-0 text-foreground/80 transition-colors group-hover:text-primary" />
      ) : (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-muted text-[9px] font-bold uppercase text-muted-foreground">
          {skill.name.slice(0, 2)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{skill.name}</p>
        <p className="text-[11px] leading-snug text-muted-foreground">{usageLabel(skill)}</p>
      </div>
    </div>
  );
}
