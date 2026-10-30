'use client';

import { MotionConfig } from 'motion/react';

/** One place that honours prefers-reduced-motion for every Motion component:
 *  transforms and layout animations switch off, opacity and colour stay. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
