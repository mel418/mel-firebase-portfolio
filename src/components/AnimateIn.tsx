'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
};

const OFFSET = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
  none: {},
};

export function AnimateIn({ children, className, delay = 0, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref, { once: true, amount: 0.08 });
  // Applies the hidden state only after mount, so if JS fails to load
  // entirely, content is never stuck invisible — it's plain visible HTML.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const hidden = hasMounted && !isVisible;

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, ...OFFSET[direction] } : { opacity: 1, x: 0, y: 0 }}
      transition={hidden ? { duration: 0 } : { type: 'spring', visualDuration: 0.7, bounce: 0, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
