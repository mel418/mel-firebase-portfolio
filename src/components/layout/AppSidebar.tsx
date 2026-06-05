'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Briefcase, Play, Code, GraduationCap, Mail, Github, Library, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useActiveSection } from '@/hooks/use-active-section';

type NavItem = {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  id: string;
};

const navItems: NavItem[] = [
  { href: '/#profile',    label: 'Melody Gatan', sublabel: 'Developer',     icon: User,          id: 'profile' },
  { href: '/#experience', label: 'Experience',   sublabel: 'Playlist',   icon: Briefcase,     id: 'experience' },
  { href: '/#projects',   label: 'Projects',     sublabel: 'Playlist',   icon: Play,          id: 'projects' },
  { href: '/#skills',     label: 'Skills',       sublabel: 'Collection', icon: Code,          id: 'skills' },
  { href: '/#education',  label: 'Education',    sublabel: 'Playlist',   icon: GraduationCap, id: 'education' },
  { href: '/#contact',    label: 'Contact',      sublabel: 'Playlist',   icon: Mail,          id: 'contact' },
];

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
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors group',
        isActive ? 'bg-accent' : 'hover:bg-accent/60'
      )}
    >
      {item.id === 'profile' ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
          <Image src="/PFP2.JPG" alt="Melody Gatan" fill className="object-cover" sizes="40px" />
        </div>
      ) : (
        <div className={cn(
          'h-10 w-10 shrink-0 rounded-md flex items-center justify-center',
          isActive ? 'bg-primary/20' : 'bg-muted'
        )}>
          <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
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
      <div className="flex items-center gap-2 px-1 pt-2">
        <Library className="h-7 w-7 text-primary shrink-0" />
        <span className="text-xl font-bold text-primary font-headline">Your Library</span>
      </div>

      <nav className="flex flex-col space-y-1 flex-1">
        {navItems.map((item) => (
          <NavItemRow key={item.href} item={item} isActive={activeId === item.id} />
        ))}
      </nav>

      <div className="space-y-2 pt-2 border-t border-border">
        <a href="/Melody_Gatan_Resume.pdf" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            View Resume
          </Button>
        </a>
        <a href="https://github.com/mel418" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="w-full">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </a>
      </div>
    </aside>
  );
}
