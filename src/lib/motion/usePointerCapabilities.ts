'use client';

import { useEffect, useState } from 'react';

export type PointerCapabilities = {
  /** True for mouse/trackpad; false for touch — gates cursor & magnetic effects */
  finePointer: boolean;
  reducedMotion: boolean;
};

/**
 * Single source of truth for "should this rAF loop / pointer effect even
 * start" — every motion primitive in this module (magnetic buttons,
 * custom cursor, scroll parallax) checks this before attaching any
 * listener, not just before rendering. CSS alone can freeze a running
 * animation but can't stop a rAF loop or remove event listeners, so the
 * gating has to happen here, in JS, at the source.
 */
export function usePointerCapabilities(): PointerCapabilities {
  const [caps, setCaps] = useState<PointerCapabilities>({ finePointer: false, reducedMotion: false });

  useEffect(() => {
    const pointerMq = window.matchMedia('(pointer: fine)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    function update() {
      setCaps({ finePointer: pointerMq.matches, reducedMotion: motionMq.matches });
    }

    update();
    pointerMq.addEventListener('change', update);
    motionMq.addEventListener('change', update);
    return () => {
      pointerMq.removeEventListener('change', update);
      motionMq.removeEventListener('change', update);
    };
  }, []);

  return caps;
}
