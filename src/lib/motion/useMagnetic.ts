'use client';

import { useEffect, useRef } from 'react';
import { usePointerCapabilities } from './usePointerCapabilities';

/**
 * Writes --mx/--my CSS custom properties tracking pointer offset from the
 * element's center — the element's own CSS does the actual transform
 * (`translate(var(--mx,0), var(--my,0))`), so this hook only ever touches
 * two custom properties, never layout. No listeners attach at all unless
 * the pointer is fine (mouse/trackpad) and reduced-motion isn't set —
 * checked here, not just at render time, since a touch device should
 * never pay for a pointermove listener it can't use.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null);
  const { finePointer, reducedMotion } = usePointerCapabilities();

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer || reducedMotion) return;

    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const mx = (e.clientX - rect.left - rect.width / 2) * strength;
      const my = (e.clientY - rect.top - rect.height / 2) * strength;
      el!.style.setProperty('--mx', `${mx}px`);
      el!.style.setProperty('--my', `${my}px`);
    }

    function onLeave() {
      el!.style.setProperty('--mx', '0px');
      el!.style.setProperty('--my', '0px');
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [finePointer, reducedMotion, strength]);

  return ref;
}
