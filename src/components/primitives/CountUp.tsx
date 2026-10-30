'use client';

import { useEffect, useRef, useState } from 'react';

const NUMBER = /^(\d+(?:\.\d+)?)(.*)$/;

/**
 * Counts up to a figure like "3.66", "200+" or "2nd" the first time it scrolls
 * into view. The server render (and anyone with reduced motion) gets the final
 * value as plain text, so nothing depends on the animation running.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = NUMBER.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!match || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = parseFloat(match[1]);
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    const suffix = match[2];
    let raf = 0;

    setText(`${(0).toFixed(decimals)}${suffix}`);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setText(`${(target * eased).toFixed(decimals)}${suffix}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className="[font-variant-numeric:tabular-nums]">
      {text}
    </span>
  );
}
