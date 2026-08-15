import { site } from './site';
import { navTracks, sectionIds } from './nav';
import { projects } from './projects';
import { linerNotes } from './liner-notes';
import { experience } from './experience';
import { skills } from './skills';
import { education } from './education';
import type { Skill, SkillId } from './types';

export * from './types';
export { site, navTracks, sectionIds, projects, linerNotes, experience, skills, education };

export type SkillWithUsage = Skill & {
  projectSlugs: string[];
  usageCount: number;
};

/**
 * Inverted index: skill -> which projects use it. Computed once at module
 * scope (build time, not per-render) so "Played on: N projects" is always
 * derived from Project.stack rather than hand-maintained, and a typo in a
 * stack array is a TypeScript error, not a silently wrong count.
 */
export const skillsWithUsage: SkillWithUsage[] = skills.map((skill) => {
  const projectSlugs = projects.filter((p) => p.stack.includes(skill.id)).map((p) => p.slug);
  return { ...skill, projectSlugs, usageCount: projectSlugs.length };
});

const skillsById = new Map(skillsWithUsage.map((s) => [s.id, s]));

export function getSkill(id: SkillId): SkillWithUsage | undefined {
  return skillsById.get(id);
}

const projectsBySlug = new Map(projects.map((p) => [p.slug, p]));

export function getProject(slug: string) {
  return projectsBySlug.get(slug);
}

export function getLinerNotes(slug: string) {
  return linerNotes[slug];
}

/** Next track in discography order, wrapping from the last back to the first. */
export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return projects[(i + 1) % projects.length];
}
