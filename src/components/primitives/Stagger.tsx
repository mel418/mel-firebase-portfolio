'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, type Variants } from 'motion/react';

const container: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10, transition: { duration: 0 } },
  shown: { opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.5, bounce: 0 } },
};

type ListProps = { children: React.ReactNode; className?: string };

/** Children rise in one after another the first time the list scrolls into
 *  view. Like AnimateIn, nothing is hidden until JS has mounted. */
export function Stagger({ children, className }: ListProps) {
  const ref = useRef<HTMLUListElement>(null);
  const isVisible = useInView(ref, { once: true, amount: 0.3 });
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  return (
    <motion.ul
      ref={ref}
      className={className}
      variants={container}
      initial={false}
      animate={hasMounted && !isVisible ? 'hidden' : 'shown'}
    >
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, className }: ListProps) {
  return (
    <motion.li
      className={className}
      variants={item}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', visualDuration: 0.25, bounce: 0.25 }}
    >
      {children}
    </motion.li>
  );
}
