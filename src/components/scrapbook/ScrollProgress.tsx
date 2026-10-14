'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Reading progress as a thin line with a little flower riding it, like the
 * slider on a music player. Real data (document scroll position), not a
 * prop-up: one passive scroll listener, rAF-throttled, writing a single CSS
 * variable — no React re-renders while scrolling. Decorative for assistive
 * tech (the page's own scroll position already conveys this natively).
 */
export function ScrollProgress() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      track.current?.style.setProperty('--p', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none sticky top-0 z-30 h-0 px-4 sm:px-8">
      <div ref={track} className="relative top-3 h-[3px] rounded-full bg-primary/15">
        <span className="absolute inset-y-0 left-0 rounded-full bg-primary/50" style={{ width: 'calc(var(--p, 0) * 100%)' }} />
        <span className="absolute -top-[9px] -translate-x-1/2" style={{ left: 'calc(var(--p, 0) * 100%)' }}>
          <Image src="/stickers/flower-knob.png" alt="" width={102} height={102} sizes="22px" className="h-[22px] w-[22px]" />
        </span>
      </div>
    </div>
  );
}
