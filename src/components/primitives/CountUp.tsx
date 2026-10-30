'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

const NUMBER = /^(\d+(?:\.\d+)?)(.*)$/;

/**
 * Counts up to a figure like "3.66", "200+" or "2nd" the first time it scrolls
 * into view. The server render (and anyone with reduced motion) gets the final
 * value as plain text, so nothing depends on the animation running.
 */
export function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const match = NUMBER.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState(value);

  // Starts from zero only once we know JS is running and motion is allowed.
  useEffect(() => {
    if (!match || reduceMotion) return;
    setText(`${(0).toFixed(match[1].includes('.') ? match[1].split('.')[1].length : 0)}${match[2]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion]);

  useEffect(() => {
    if (!match || reduceMotion || !isInView) return;
    const target = parseFloat(match[1]);
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    const suffix = match[2];

    const controls = animate(0, target, {
      duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setText(`${v.toFixed(decimals)}${suffix}`),
      onComplete: () => setText(value),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className="[font-variant-numeric:tabular-nums]">
      {text}
    </span>
  );
}
