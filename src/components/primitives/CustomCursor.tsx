'use client';

import { useEffect, useRef, useState } from 'react';
import { usePointerCapabilities } from '@/lib/motion/usePointerCapabilities';
import { cn } from '@/lib/utils';

/**
 * A soft ring that trails the real cursor with a slight lag, growing
 * over interactive elements — deliberately a *companion* to the native
 * cursor, not a replacement for it. Hiding the OS cursor entirely (the
 * usual "custom cursor" pattern) can be genuinely disorienting for
 * users who track cursor position by its familiar shape, so this never
 * sets `cursor: none` anywhere. Renders nothing and attaches no
 * listeners at all on touch or under reduced motion.
 */
export function CustomCursor() {
  const { finePointer, reducedMotion } = usePointerCapabilities();
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let rafId: number;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement;
      setActive(!!el.closest('a, button, summary, [role="button"]'));
    }

    function tick() {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-primary/40 transition-[width,height,background-color] duration-200 ease-out',
        active ? 'h-10 w-10 bg-primary/10' : 'h-4 w-4 bg-transparent'
      )}
    />
  );
}
