'use client';

import { useState } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnimateIn } from '@/components/AnimateIn';
import { cn } from '@/lib/utils';

export type ExperienceEntry = {
  role: string;
  company: string;
  dateRange: string;
  category: string;
  bullets: string[];
};

type Props = {
  experience: ExperienceEntry[];
};

function ExperienceRow({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const [open, setOpen] = useState(false);
  const initials = entry.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <>
      <TableRow
        className="group border-b border-border/50 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <TableCell className="w-10 text-center">
          <span className="text-muted-foreground group-hover:hidden">{index + 1}</span>
          <Play className="h-4 w-4 text-primary fill-primary hidden group-hover:block mx-auto" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                {entry.role}
              </p>
              <p className="text-xs text-muted-foreground truncate">{entry.company}</p>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
          {entry.dateRange}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Badge variant="secondary" className="text-xs">{entry.category}</Badge>
        </TableCell>
        <TableCell className="w-8">
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </TableCell>
      </TableRow>
      {open && (
        <tr>
          <td colSpan={5} className="pb-4 pt-1 bg-muted/20">
            <ul className="pl-16 pr-4 space-y-1.5 border-l-2 border-primary/30 ml-4">
              {entry.bullets.map((bullet, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  {bullet}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

export function ExperienceTracklist({ experience }: Props) {
  return (
    <div>
      {/* Desktop table */}
      <div className="px-4 sm:px-6 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-10 text-muted-foreground">#</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground hidden sm:table-cell">Period</TableHead>
              <TableHead className="text-muted-foreground hidden md:table-cell">Type</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {experience.map((entry, i) => (
              <ExperienceRow key={entry.role + entry.company} entry={entry} index={i} />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile list fallback */}
      <div className="md:hidden px-4 space-y-3 mt-2">
        {experience.map((entry, i) => {
          const initials = entry.company.split(' ').slice(0, 2).map((w) => w[0]).join('');
          return (
            <AnimateIn key={entry.role + entry.company} delay={i * 80}>
              <details className="group rounded-lg border border-border overflow-hidden">
                <summary className="flex items-center gap-3 p-3 cursor-pointer bg-card hover:bg-accent transition-colors list-none">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{entry.role}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.company} · {entry.dateRange}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 py-3 bg-muted/30">
                  <ul className="space-y-1.5 border-l-2 border-primary/30 pl-4">
                    {entry.bullets.map((bullet, j) => (
                      <li key={j} className="text-xs text-muted-foreground">{bullet}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </AnimateIn>
          );
        })}
      </div>
    </div>
  );
}
