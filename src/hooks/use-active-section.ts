'use client';

import { useSyncExternalStore } from 'react';
import { sectionIds } from '@/content';

// Module-level store: one shared IntersectionObserver + one active-id
// value, no matter how many components subscribe (AppSidebar,
// MobileBottomNav, and — from Phase 4 — the context panel). Previously
// this hook ran its own independent scroll listener per instance.
//
// Rewritten for document scroll (Phase 2d) — the shell no longer traps
// scrolling inside <main>, so this observes against the real viewport
// (`root: null`, via rootMargin) instead of `main.closest('main')`.

type Listener = () => void;

let activeId: string = sectionIds[0];
const listeners = new Set<Listener>();
let observer: IntersectionObserver | null = null;
let suppressUntil = 0;

function notify() {
  listeners.forEach((l) => l());
}

function setActive(id: string) {
  if (id !== activeId) {
    activeId = id;
    notify();
  }
}

function checkBottomGuard() {
  if (Date.now() < suppressUntil) return;
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  if (atBottom) setActive(sectionIds[sectionIds.length - 1]);
}

function ensureObserver() {
  if (observer || typeof window === 'undefined') return;

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  // Thin detection band ~35-40% down the viewport — a section becomes
  // "active" as soon as any part of it crosses that line.
  observer = new IntersectionObserver(
    (entries) => {
      if (Date.now() < suppressUntil) return;
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id);
      }
    },
    { rootMargin: '-35% 0px -60% 0px', threshold: 0 }
  );

  sections.forEach((el) => observer!.observe(el));

  // A short final section may never cross the band, so it'd never
  // become active on its own — force it active once actually at the
  // bottom of the document.
  window.addEventListener('scroll', checkBottomGuard, { passive: true });
}

function subscribe(listener: Listener) {
  ensureObserver();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return activeId;
}

function getServerSnapshot() {
  return sectionIds[0];
}

/**
 * Call on nav-item click so the active indicator jumps immediately
 * instead of flickering through every intermediate section during the
 * smooth scroll to the target. Suppresses observer updates briefly —
 * long enough to cover a same-page smooth scroll, short enough that a
 * genuine subsequent scroll (e.g. the user immediately scrolls away)
 * isn't ignored for long.
 */
export function setActiveSectionImmediate(id: string) {
  suppressUntil = Date.now() + 700;
  setActive(id);
}

export function useActiveSection() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
