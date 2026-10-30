'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimateIn } from '@/components/AnimateIn';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { OPEN_PROJECT_EVENT } from '@/lib/open-project';
import type { Project } from '@/content';

type Props = {
  projects: Project[];
  initialTrack?: string;
};

/**
 * Owns which project is open and keeps it synced to `?track=<slug>` via
 * pushState/popstate — not a route change, so page.tsx's Spotify fetch
 * never re-runs on open/close/back/forward. See the redesign plan for
 * why a real `/projects/[slug]` route was rejected: every back-
 * navigation on a real route would re-run the dynamic Spotify render.
 *
 * Renders as a dialog (Radix), not an inline expansion. It started as
 * an inline expand-in-place panel, but the discography grid's
 * auto-placement meant a per-card panel had to be a shared slot below
 * the *entire* grid rather than next to whatever card was actually
 * clicked — at that point "expands in place" wasn't true anymore, and
 * a dialog (always centered, position-independent of where you
 * clicked) is a better fit than an inline panel that isn't really
 * inline. Radix's Dialog also gives a real focus trap, Escape-to-close,
 * and focus-return for free — this used to hand-roll a subset of that
 * with a window keydown listener.
 */
export function Discography({ projects, initialTrack }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialTrack ?? null);
  const isSyncingFromPopstate = useRef(false);
  const isFirstRender = useRef(true);

  // Radix's default close-focus-return only works with <Dialog.Trigger>
  // (it tracks that component's own ref internally) — our triggers are
  // plain buttons outside the Dialog tree entirely, so with no override
  // Radix has nothing to restore focus to and it falls back to <body>.
  // Captured whenever a card opens the dialog; restored via
  // DialogContent's onCloseAutoFocus below. Verified via Playwright
  // before this fix: activeElement was BODY after Escape, not the card.
  const triggerElRef = useRef<HTMLElement | null>(null);

  const openProject = projects.find((p) => p.slug === openSlug);

  // Radix keeps DialogContent's DOM node mounted during its own close
  // animation (via its internal Presence primitive), but the *children*
  // are still whatever we render here — if openProject goes undefined
  // the instant openSlug clears, the content inside would vanish before
  // the dialog has finished animating shut. So this tracks the last
  // known project separately, same reasoning as the old Expandable
  // version.
  const [lastOpenProject, setLastOpenProject] = useState<Project | undefined>(openProject);
  useEffect(() => {
    if (openProject) setLastOpenProject(openProject);
  }, [openProject]);

  const open = useCallback((slug: string) => {
    triggerElRef.current = document.activeElement as HTMLElement;
    setOpenSlug(slug);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
  }, []);

  // Anything else on the page (the hero player) can ask for a project to open.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<unknown>).detail;
      if (typeof slug === 'string' && projects.some((p) => p.slug === slug)) open(slug);
    };
    window.addEventListener(OPEN_PROJECT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PROJECT_EVENT, onOpen);
  }, [open, projects]);

  // Push the URL whenever openSlug changes — except on mount (the URL is
  // already correct) and except when the change came from popstate (the
  // browser already updated history; pushing again would corrupt back/
  // forward by re-pushing the state we just navigated to).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isSyncingFromPopstate.current) {
      isSyncingFromPopstate.current = false;
      return;
    }
    const url = new URL(window.location.href);
    if (openSlug) url.searchParams.set('track', openSlug);
    else url.searchParams.delete('track');
    window.history.pushState(null, '', url.pathname + url.search + url.hash);
  }, [openSlug]);

  // Browser back/forward
  useEffect(() => {
    function onPopState() {
      isSyncingFromPopstate.current = true;
      setOpenSlug(new URLSearchParams(window.location.search).get('track'));
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <div>
      <div className="space-y-10 sm:space-y-14">
        {featured.map((project, i) => (
          <AnimateIn key={project.slug}>
            <ProjectCard project={project} flip={i % 2 === 1} isOpen={openSlug === project.slug} onOpen={open} />
          </AnimateIn>
        ))}
      </div>

      <div className="mt-28">
        <AnimateIn>
          <Eyebrow>More projects</Eyebrow>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} variant="row" isOpen={openSlug === project.slug} onOpen={open} />
            ))}
          </div>
        </AnimateIn>
      </div>

      <Dialog open={!!openProject} onOpenChange={(isOpen) => { if (!isOpen) close(); }}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            // Deep link (?track=) opens with no click to have captured a
            // trigger — fall back to that project's own card.
            const fallback = lastOpenProject && document.getElementById(`card-${lastOpenProject.slug}`);
            (triggerElRef.current ?? fallback)?.focus();
          }}
        >
          {lastOpenProject && <ProjectDetail key={lastOpenProject.slug} project={lastOpenProject} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
