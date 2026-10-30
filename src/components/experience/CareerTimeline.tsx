'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Briefcase, Code2, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { openProject } from '@/lib/open-project';
import type { TimelineEntry, TimelineKind } from '@/content';

const KIND: Record<TimelineKind, { lane: string; label: string; icon: typeof Briefcase }> = {
  work: { lane: 'Work', label: 'Work', icon: Briefcase },
  school: { lane: 'School', label: 'School', icon: GraduationCap },
  project: { lane: 'Projects', label: 'Project', icon: Code2 },
  hackathon: { lane: 'Hackathons', label: 'Hackathon', icon: Trophy },
};
const LANE_ORDER: TimelineKind[] = ['work', 'school', 'project', 'hackathon'];

const ROW_H = 36;
const LANE_PAD = 10;
const AXIS_H = 28;

// Month indices (year * 12 + month) so spans are simple subtraction.
const m = (d: string) => {
  const [y, mo] = d.split('-').map(Number);
  return y * 12 + mo - 1;
};
const RANGE_START = m('2021-01');
const RANGE_END = m('2026-12') + 1;
// "Present" is pinned to the month this was last edited, so the chart never moves between renders.
const PRESENT = m('2026-10') + 1;
const pos = (monthIndex: number) => ((monthIndex - RANGE_START) / (RANGE_END - RANGE_START)) * 100;
const YEARS = [2021, 2022, 2023, 2024, 2025, 2026];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (d: string) => {
  const [y, mo] = d.split('-').map(Number);
  return `${MONTHS[mo - 1]} ${y}`;
};
const rangeLabel = (e: TimelineEntry) => (e.end ? `${fmt(e.start)} – ${e.end === 'present' ? 'Present' : fmt(e.end)}` : fmt(e.start));

type Placed = { entry: TimelineEntry; lane: TimelineKind; row: number; left: number; width: number; anchor: number; isBar: boolean; ongoing: boolean };

/**
 * The career as a map: one lane each for work, school, projects and
 * hackathons on a real time axis, so duration and overlap are visible (Target
 * runs underneath everything; the 2025 projects stack up). Pick a bar or dot
 * — or step with the arrow keys — and a playhead moves to it and the card
 * below tells that part of the story. Hackathons are single moments, so
 * they are dots. On phones it is replaced by a vertical timeline.
 */
export function CareerTimeline({ entries }: { entries: TimelineEntry[] }) {
  const sorted = useMemo(() => [...entries].sort((a, b) => m(a.start) - m(b.start)), [entries]);
  const [sel, setSel] = useState(() => Math.max(0, sorted.findIndex((e) => e.id === 'kiosk')));
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const { placed, laneRows } = useMemo(() => {
    const placed: Placed[] = [];
    const laneRows: Record<TimelineKind, number> = { work: 1, school: 1, project: 1, hackathon: 1 };
    for (const lane of LANE_ORDER) {
      const rowsEnd: number[] = []; // last occupied month per row (dots reserve room for their label)
      for (const entry of sorted.filter((e) => e.kind === lane)) {
        const start = m(entry.start);
        const end = entry.end ? (entry.end === 'present' ? PRESENT : m(entry.end) + 1) : null;
        const reservedEnd = end ?? start + 13; // a dot plus its label spans about a year
        let row = rowsEnd.findIndex((last) => last + 2 <= start);
        if (row === -1) row = rowsEnd.length;
        rowsEnd[row] = reservedEnd;
        const left = pos(end === null ? start + 0.5 : start);
        const width = end === null ? 0 : pos(end) - pos(start);
        placed.push({
          entry,
          lane,
          row,
          left,
          width,
          anchor: end === null ? left : left + width / 2,
          isBar: end !== null,
          ongoing: entry.end === 'present',
        });
      }
      laneRows[lane] = Math.max(1, rowsEnd.length);
    }
    return { placed, laneRows };
  }, [sorted]);

  const byId = new Map(placed.map((p) => [p.entry.id, p]));
  const current = sorted[sel];
  const currentPlaced = byId.get(current.id)!;
  const Icon = KIND[current.kind].icon;
  const laneH = (lane: TimelineKind) => laneRows[lane] * ROW_H + LANE_PAD * 2;

  const go = (next: number) => {
    const i = Math.min(sorted.length - 1, Math.max(0, next));
    setSel(i);
    refs.current[i]?.focus();
  };

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(sel + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(sel - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(sorted.length - 1);
    else return;
    e.preventDefault();
  }

  return (
    <>
    {/* md+: the lane chart. */}
    <div className="hidden space-y-12 md:block">
      <div className="overflow-x-auto pb-2">
        <div role="group" aria-label="Career timeline. Use the arrow keys to step through it." onKeyDown={onKeyDown} className="min-w-[700px]">
          <div className="flex">
            {/* Lane labels */}
            <div className="w-24 shrink-0">
              <div style={{ height: AXIS_H }} />
              {LANE_ORDER.map((lane) => (
                <div key={lane} className="flex items-center border-t border-transparent text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground" style={{ height: laneH(lane) }}>
                  {KIND[lane].lane}
                </div>
              ))}
            </div>

            {/* Plot */}
            <div className="relative flex-1">
              {/* Year axis and gridlines */}
              <div className="relative" style={{ height: AXIS_H }}>
                {YEARS.map((y) => (
                  <span key={y} className="absolute top-1.5 pl-1.5 font-code text-[10px] tracking-wider text-muted-foreground" style={{ left: `${pos(m(`${y}-01`))}%` }}>
                    {y}
                  </span>
                ))}
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0" style={{ top: AXIS_H }}>
                {YEARS.map((y) => (
                  <i key={y} className="absolute inset-y-0 w-px bg-border/70" style={{ left: `${pos(m(`${y}-01`))}%` }} />
                ))}
              </div>

              {LANE_ORDER.map((lane) => (
                <div key={lane} className="relative border-t border-border" style={{ height: laneH(lane) }}>
                  {placed
                    .filter((p) => p.lane === lane)
                    .map((p) => {
                      const i = sorted.findIndex((e) => e.id === p.entry.id);
                      const selected = i === sel;
                      const top = LANE_PAD + p.row * ROW_H + 4;
                      const label = `${p.entry.title}, ${p.entry.subtitle}`;
                      const focus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
                      return p.isBar ? (
                        <button
                          key={p.entry.id}
                          ref={(el) => { refs.current[i] = el; }}
                          type="button"
                          aria-label={label}
                          aria-current={selected ? 'true' : undefined}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setSel(i)}
                          className={cn(
                            'absolute z-10 flex h-7 min-w-[4.5rem] items-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-3 text-[11px] font-semibold transition-colors duration-300',
                            selected ? 'bg-primary text-primary-foreground' : 'bg-primary/15 text-accent-ink hover:bg-primary/30',
                            focus
                          )}
                          style={{ left: `${p.left}%`, width: `${p.width}%`, top }}
                        >
                          <span className="truncate">{p.entry.short}</span>
                          {p.ongoing && <ArrowRight className="ml-auto h-3 w-3 shrink-0" />}
                        </button>
                      ) : (
                        <button
                          key={p.entry.id}
                          ref={(el) => { refs.current[i] = el; }}
                          type="button"
                          aria-label={label}
                          aria-current={selected ? 'true' : undefined}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setSel(i)}
                          className={cn('absolute z-10 h-7 w-7 -translate-x-1/2 rounded-full', focus)}
                          style={{ left: `${p.left}%`, top }}
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300',
                              selected ? 'scale-110 border-primary bg-primary text-primary-foreground' : 'border-primary/50 bg-card text-accent-ink hover:border-primary'
                            )}
                          >
                            <Trophy className="h-3.5 w-3.5" />
                          </span>
                          <span
                            className={cn(
                              'absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] font-semibold transition-colors',
                              p.left > 85 ? 'right-full mr-2' : 'left-full ml-2',
                              selected ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          >
                            {p.entry.short}
                          </span>
                        </button>
                      );
                    })}
                </div>
              ))}

              {/* Playhead */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 z-20 w-px bg-primary/70"
                style={{ top: AXIS_H - 6 }}
                initial={false}
                animate={{ left: `${currentPlaced.anchor}%` }}
                transition={{ type: 'spring', visualDuration: 0.55, bounce: 0.12 }}
              >
                <span className="absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full bg-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[11rem] max-w-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            className="space-y-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary" />
              {KIND[current.kind].label}
            </p>
            <h3 className="font-headline text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{current.title}</h3>
            <p className="text-sm text-muted-foreground">{current.subtitle}</p>
            <p className="text-base leading-relaxed text-foreground/80">{current.detail}</p>
            {current.projectSlug && (
              <button
                type="button"
                onClick={() => openProject(current.projectSlug!)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open the album
                <ArrowUpRight className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="text-xs text-muted-foreground">Pick a bar or dot, or step through with the arrow keys.</p>
    </div>

    {/* Phones: the same story as a vertical timeline that fits any width. Tap a stop to open it. */}
    <ol className="relative ml-4 border-l border-border md:hidden">
      {sorted.map((e, i) => {
        const selected = i === sel;
        const KindIcon = KIND[e.kind].icon;
        return (
          <li key={e.id} className="relative pb-8 pl-9 last:pb-0">
            <button
              type="button"
              onClick={() => setSel(i)}
              aria-expanded={selected}
              className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-0 top-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-colors duration-300',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/40 bg-card text-accent-ink'
                )}
              >
                <KindIcon className="h-4 w-4" />
              </span>
              <span className="block font-code text-[11px] uppercase tracking-wider text-muted-foreground">
                {KIND[e.kind].label} · {rangeLabel(e)}
              </span>
              <span className={cn('mt-1 block font-headline text-lg font-bold leading-snug tracking-tight transition-colors', selected && 'text-accent-ink')}>
                {e.title}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {selected && (
                <motion.div
                  key="detail"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', visualDuration: 0.4, bounce: 0 }}
                >
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-muted-foreground">{e.subtitle}</p>
                    <p className="text-base leading-relaxed text-foreground/80">{e.detail}</p>
                    {e.projectSlug && (
                      <button
                        type="button"
                        onClick={() => openProject(e.projectSlug!)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Open the album
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
    </>
  );
}
