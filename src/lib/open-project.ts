/**
 * Lets any component (the hero player) open a project's detail dialog, which
 * is owned by Discography. A window event rather than shared state so the two
 * never need a common parent.
 */
export const OPEN_PROJECT_EVENT = 'portfolio:open-project';

export function openProject(slug: string) {
  window.dispatchEvent(new CustomEvent(OPEN_PROJECT_EVENT, { detail: slug }));
}
