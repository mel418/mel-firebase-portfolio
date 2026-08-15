'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReveal } from '@/lib/motion/useReveal';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
};

export function AnimateIn({ children, className, delay = 0, direction = 'up' }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  // Applies the hidden state only after mount, so if JS fails to load
  // entirely, content is never stuck invisible — it's plain visible HTML.
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  const directionClasses = {
    up: 'translate-y-6 opacity-0',
    left: '-translate-x-6 opacity-0',
    right: 'translate-x-6 opacity-0',
    none: 'opacity-0',
  }[direction];

  return (
    <div
      ref={ref}
      data-reveal
      className={cn(
        'transition-all duration-700 ease-out',
        hasMounted && !isVisible ? directionClasses : 'translate-y-0 translate-x-0 opacity-100',
        className
      )}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
