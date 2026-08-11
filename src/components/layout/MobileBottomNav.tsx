'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/use-active-section';
import { ThemeToggle } from '@/components/ThemeToggle';
import { navTracks } from '@/content';
import { navIconRegistry } from '@/lib/icons';

export function MobileBottomNav() {
  const activeId = useActiveSection();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-card border-t border-border px-2 pb-safe">
      {navTracks.map((item) => {
        const isActive = activeId === item.id;
        const Icon = navIconRegistry[item.iconName];
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-2 py-3 min-w-0 transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium truncate">{item.mobileLabel ?? item.label}</span>
          </Link>
        );
      })}
      <div className="px-2 py-3">
        <ThemeToggle />
      </div>
    </nav>
  );
}
