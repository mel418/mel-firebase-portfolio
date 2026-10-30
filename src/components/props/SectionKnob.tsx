'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useActiveSection, setActiveSectionImmediate } from '@/hooks/use-active-section';
import { navTracks } from '@/content';

const LAST = navTracks.length - 1;
const SWEEP = 270; // degrees, matches KNOB_SWEEP in scripts/generate_props.py
const toAngle = (i: number) => (i / LAST) * SWEEP - SWEEP / 2;
const clamp = (i: number) => Math.min(LAST, Math.max(0, Math.round(i)));

/**
 * A tuning dial for the page. Its position *is* the active section — it turns
 * by itself as you scroll — and turning it (drag, click the dial, arrow keys)
 * jumps to that section, so it is a second way through the same six tracks as
 * the list above it. The art is Pillow-made (public/props); semantics are a
 * real slider for assistive tech.
 */
export function SectionKnob({ className }: { className?: string }) {
  const activeId = useActiveSection();
  const index = Math.max(0, navTracks.findIndex((t) => t.id === activeId));
  const current = navTracks[index];
  const [dragging, setDragging] = useState(false);
  const dial = useRef<HTMLDivElement>(null);

  function goTo(i: number) {
    if (i === index) return;
    const target = navTracks[i];
    setActiveSectionImmediate(target.id);
    document.getElementById(target.id)?.scrollIntoView();
  }

  function fromPointer(e: React.PointerEvent) {
    const r = dial.current!.getBoundingClientRect();
    const deg = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI;
    // The dial's gap sits at the bottom: past ±135° snap to whichever end is closer.
    const clamped = Math.abs(deg) > SWEEP / 2 ? (index > LAST / 2 ? SWEEP / 2 : -SWEEP / 2) : deg;
    goTo(clamp(((clamped + SWEEP / 2) / SWEEP) * LAST));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (step) goTo(clamp(index + step));
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'End') goTo(LAST);
    else return;
    e.preventDefault();
  }

  return (
    <div className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <div
        ref={dial}
        role="slider"
        tabIndex={0}
        aria-label="Jump to section"
        aria-valuemin={1}
        aria-valuemax={navTracks.length}
        aria-valuenow={index + 1}
        aria-valuetext={`${current.label}, section ${index + 1} of ${navTracks.length}`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          fromPointer(e);
        }}
        onPointerMove={(e) => dragging && fromPointer(e)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        className="relative h-40 w-40 cursor-grab touch-none select-none rounded-full active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-card"
      >
        <Image src="/props/knob-dial.png" alt="" width={360} height={360} sizes="160px" className="pointer-events-none absolute inset-0 h-full w-full" draggable={false} />
        <Image
          src="/props/knob-cap.png"
          alt=""
          width={360}
          height={360}
          sizes="160px"
          className={cn('pointer-events-none absolute inset-0 h-full w-full', !dragging && 'transition-transform duration-500 ease-editorial')}
          style={{ transform: `rotate(${toAngle(index)}deg)` }}
          draggable={false}
        />
      </div>

      <p aria-hidden="true" className="text-xs text-muted-foreground">
        <span className="font-code [font-variant-numeric:tabular-nums]">{current.trackNumber}</span>
        <span className="mx-1.5 text-border">·</span>
        <span className="font-semibold text-foreground/80">{current.mobileLabel ?? current.label}</span>
      </p>
    </div>
  );
}
