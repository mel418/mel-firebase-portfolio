'use client';

import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/**
 * Reading progress as a thin line with a little flower riding it, like the
 * slider on a music player. Real data (document scroll position) run through a
 * critically-damped spring so the flower glides instead of snapping to each
 * scroll tick. Decorative for assistive tech (the page's own scroll position
 * already conveys this natively).
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.0005 });
  const percent = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div aria-hidden="true" className="pointer-events-none sticky top-0 z-30 h-0 px-4 sm:px-8">
      <div className="relative top-3 h-[3px] rounded-full bg-primary/15">
        <motion.span className="absolute inset-y-0 left-0 rounded-full bg-primary/50" style={{ width: percent }} />
        <motion.span className="absolute -top-[9px] -translate-x-1/2" style={{ left: percent }}>
          <Image src="/stickers/flower-knob.png" alt="" width={102} height={102} sizes="22px" className="h-[22px] w-[22px]" />
        </motion.span>
      </div>
    </div>
  );
}
