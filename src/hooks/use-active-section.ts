'use client';

import { useEffect, useState } from 'react';

const SECTION_IDS = ['profile', 'experience', 'projects', 'skills', 'education', 'contact'];

export function useActiveSection() {
  const [activeId, setActiveId] = useState<string>('profile');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(id);
          }
        },
        { threshold: 0.3, rootMargin: '-20% 0px -60% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return activeId;
}
