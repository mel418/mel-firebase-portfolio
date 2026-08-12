'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Library, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useActiveSection, setActiveSectionImmediate } from '@/hooks/use-active-section';
import { navTracks, site, type NavTrack } from '@/content';
import { navIconRegistry } from '@/lib/icons';

type NavItem = NavTrack;

const navItems: NavItem[] = navTracks;

function EqualizerBars() {
  return (
    <div className="flex items-end gap-[2px] h-4 shrink-0">
      <div className="w-[3px] bg-primary rounded-sm origin-bottom animate-bar-1" style={{ height: '12px' }} />
      <div className="w-[3px] bg-primary rounded-sm origin-bottom animate-bar-2" style={{ height: '12px' }} />
      <div className="w-[3px] bg-primary rounded-sm origin-bottom animate-bar-3" style={{ height: '12px' }} />
    </div>
  );
}

function NavItemRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      onClick={() => setActiveSectionImmediate(item.id)}
      className={cn(
        'relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group',
        isActive ? 'bg-primary/10' : 'hover:bg-accent/60'
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      {item.id === 'profile' ? (
        <div className="relative shrink-0">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-border">
            <Image src={site.avatar.src} alt={site.avatar.alt} fill className="object-cover" sizes="40px" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
        </div>
      ) : (
        <div className={cn(
          'h-10 w-10 shrink-0 rounded-md flex items-center justify-center',
          isActive ? 'bg-primary/20' : 'bg-muted'
        )}>
          {(() => {
            const Icon = navIconRegistry[item.iconName];
            return <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />;
          })()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isActive && 'text-primary')}>{item.label}</p>
        <p className="text-xs text-muted-foreground">{item.sublabel}</p>
      </div>
      {isActive && <EqualizerBars />}
    </Link>
  );
}

export function AppSidebar() {
  const activeId = useActiveSection();

  return (
    <aside className="flex flex-col h-full p-4 space-y-6">
      <div className="flex items-center gap-2.5 px-2 pt-2">
        <Library className="h-6 w-6 text-primary shrink-0" />
        <span className="text-lg font-bold font-headline tracking-tight">Your Library</span>
      </div>

      <nav className="flex flex-col space-y-1 flex-1">
        {navItems.map((item) => (
          <NavItemRow key={item.href} item={item} isActive={activeId === item.id} />
        ))}
      </nav>

      <div className="space-y-2 pt-3 border-t border-border/60">
        <a href={site.resumeHref} target="_blank" rel="noopener noreferrer">
          <Button size="sm" className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            <FileText className="mr-2 h-4 w-4" />
            View Resume
          </Button>
        </a>
        <a href={site.socials.find((s) => s.type === 'github')!.href} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full rounded-full hover:border-primary hover:text-primary transition-colors">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </a>
      </div>
    </aside>
  );
}
