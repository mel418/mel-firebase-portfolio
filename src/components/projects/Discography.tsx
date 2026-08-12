'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';
import { Expandable } from '@/components/primitives/Expandable';
import { AnimateIn } from '@/components/AnimateIn';
import type { Project } from '@/content';

type Props = {
  projects: Project[];
  initialTrack?: string;
};

/**
 * Owns which project is expanded and keeps it synced to `?track=<slug>`
 * via pushState/popstate — not a route change, so page.tsx's Spotify
 * fetch never re-runs on open/close/back/forward. See the redesign plan
 * for why this beat a modal or a real `/projects/[slug]` route: mainly
 * that every back-navigation on a real route would re-run the dynamic
 * Spotify render.
 */
export function Discography({ projects, initialTrack }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(initialTrack ?? null);
  const lastTriggerSlug = useRef<string | null>(null);
  const hasScrolledToInitial = useRef(false);

  // Whether the *next* openSlug change came from popstate (browser back/
  // forward) rather than a click — set inside the popstate handler,
  // consumed by the URL-sync effect below.
  const isSyncingFromPopstate = useRef(false);
  const isFirstRender = useRef(true);

  const toggle = useCallback((slug: string) => {
    lastTriggerSlug.current = slug;
    // Pure state update — no pushState here. Calling a side effect like
    // history.pushState from inside a setState updater is unsafe (React
    // may invoke updaters outside normal commit timing) and triggered a
    // real "Cannot update Router while rendering Discography" warning
    // during testing. The URL sync lives in its own effect instead.
    setOpenSlug((current) => (current === slug ? null : slug));
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
  }, []);

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

  // Esc closes and returns focus to whichever card triggered the open —
  // covers both a click and a deep-link (?track=) landing already open.
  useEffect(() => {
    if (!openSlug) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const trigger = lastTriggerSlug.current ?? openSlug;
        close();
        document.getElementById(`card-${trigger}`)?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openSlug, close]);

  // Deep link: land already scrolled to the expanded detail, once.
  useEffect(() => {
    if (initialTrack && !hasScrolledToInitial.current) {
      hasScrolledToInitial.current = true;
      document.getElementById(`card-${initialTrack}`)?.scrollIntoView({ block: 'start' });
    }
  }, [initialTrack]);

  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => p !== featured);

  return (
    <div className="space-y-6">
      {featured && (
        <AnimateIn>
          <ProjectCard project={featured} variant="featured" isOpen={openSlug === featured.slug} onToggle={toggle} />
          <Expandable isOpen={openSlug === featured.slug} className="mt-4">
            <ProjectDetail project={featured} onClose={close} />
          </Expandable>
        </AnimateIn>
      )}

      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
        {rest.map((project, i) => (
          <div key={project.slug} className="contents">
            <AnimateIn delay={i * 60}>
              <ProjectCard project={project} isOpen={openSlug === project.slug} onToggle={toggle} />
            </AnimateIn>
            <Expandable isOpen={openSlug === project.slug} className="col-span-full">
              <div className="pt-4">
                <ProjectDetail project={project} onClose={close} />
              </div>
            </Expandable>
          </div>
        ))}
      </div>
    </div>
  );
}
