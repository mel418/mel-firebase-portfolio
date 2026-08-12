'use client';

import { useEffect, useRef, useState } from 'react';

let observer: IntersectionObserver | null = null;
const callbacks = new Map<Element, () => void>();

function ensureObserver() {
  if (observer || typeof window === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          callbacks.get(entry.target)?.();
          observer!.unobserve(entry.target);
          callbacks.delete(entry.target);
        }
      }
    },
    { threshold: 0.08 }
  );
}

/**
 * One shared IntersectionObserver for every AnimateIn instance, instead
 * of each instance creating its own — this page has ~28 AnimateIn usages
 * once you count the ones inside .map() loops (discography cards, skill
 * groups, experience rows), which was 28 separate observers before this.
 * One-shot per element, matching the previous per-instance behavior.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    ensureObserver();
    const el = ref.current;
    if (!el || !observer) return;

    callbacks.set(el, () => setIsVisible(true));
    observer.observe(el);

    return () => {
      observer?.unobserve(el);
      callbacks.delete(el);
    };
  }, []);

  return { ref, isVisible };
}
