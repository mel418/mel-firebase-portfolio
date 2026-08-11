'use client';

import { useEffect, useState } from 'react';
import { sectionIds } from '@/content';

// sectionIds (src/content/nav.ts) must be in the same top-to-bottom order
// the sections appear in the DOM — it's now the single source of truth,
// previously duplicated here, in AppSidebar, and in MobileBottomNav.
//
// NOTE: this scroll-listener implementation is rewritten as a shared
// IntersectionObserver store in Phase 2 (scroll model switch to document
// scroll) — this phase only removes the duplicated section-id list.

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string>('profile');

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // The portfolio scrolls inside the <main> rail, not the window.
    const scrollEl = sections[0].closest('main');

    const computeActive = () => {
      // Trigger line ~35% down the viewport: the active section is the
      // last one whose top has scrolled above that line.
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }

      // Bottom guard — a short final section may never reach the line,
      // so when scrolled to the end, force it active.
      if (scrollEl && scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 4) {
        current = sections[sections.length - 1].id;
      }

      setActiveId(current);
    };

    computeActive();

    const target: HTMLElement | Window = scrollEl ?? window;
    target.addEventListener('scroll', computeActive, { passive: true });
    window.addEventListener('resize', computeActive);
    return () => {
      target.removeEventListener('scroll', computeActive);
      window.removeEventListener('resize', computeActive);
    };
  }, []);

  return activeId;
}
