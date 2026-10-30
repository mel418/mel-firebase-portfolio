import Image from 'next/image';
import { cn } from '@/lib/utils';

/*
 * Geometry mirrors scripts/generate_props.py (1x canvas 640×410): the tape
 * window is (170,222)–(470,318), reel centres (250,270) and (390,270), reel
 * diameter 72. Expressed as percentages so the cassette scales with its box.
 */
const W = 640;
const H = 410;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const WINDOW = { left: pct(170, W), top: pct(222, H), width: pct(300, W), height: pct(96, H) };
const REELS = [250, 390].map((cx) => ({ left: pct(cx - 36, W), top: pct(270 - 36, H), width: pct(72, W) }));

const LABEL_INK = '#2c4a36'; // the label is always cream paper, so its ink doesn't follow the theme

type Props = {
  href: string;
  className?: string;
};

/**
 * The résumé download, drawn as a cassette. The shell and the reels are
 * separate Pillow-made layers (public/props): the reels sit behind the shell
 * and turn while the link is hovered or focused. All text is real HTML laid
 * over the label; the images are decorative.
 */
export function ResumeCassette({ href, className }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Melody Gatan's résumé (PDF)"
      className={cn(
        'group block rounded-2xl transition-transform duration-300 ease-editorial',
        'hover:-translate-y-1 hover:-rotate-1 focus-visible:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background',
        className
      )}
    >
      <span className="relative block" style={{ aspectRatio: `${W} / ${H}`, containerType: 'inline-size' }}>
        <span aria-hidden="true" className="absolute rounded-full bg-[#1b1f1a]" style={WINDOW} />
        {REELS.map((pos, i) => (
          <Image
            key={i}
            src="/props/cassette-reel.png"
            alt=""
            width={144}
            height={144}
            sizes="40px"
            className="prop-spin absolute h-auto"
            style={{ ...pos, ['--prop-spin-dur' as string]: '2.2s' }}
            draggable={false}
          />
        ))}
        <Image
          src="/props/cassette-body.png"
          alt=""
          width={W}
          height={H}
          sizes="(max-width: 640px) 70vw, 260px"
          className="absolute inset-0 h-full w-full"
          draggable={false}
          priority
        />
        <span
          className="absolute flex flex-col justify-center"
          style={{ left: pct(60, W), top: pct(47, H), width: pct(520, W), height: pct(153, H), color: LABEL_INK }}
        >
          <span
            className="flex items-center font-semibold uppercase text-[#f7f3e8]"
            style={{ height: pct(33, 153), paddingInline: '4cqw', fontSize: '2.6cqw', letterSpacing: '0.18em' }}
          >
            Side A · Résumé
          </span>
          <span className="flex flex-1 flex-col justify-center" style={{ paddingInline: '4cqw' }}>
            <span className="font-headline font-extrabold leading-none" style={{ fontSize: '7cqw' }}>
              Melody Gatan
            </span>
            <span className="mt-[1.4cqw] font-medium opacity-80" style={{ fontSize: '3.4cqw' }}>
              Software Engineer · PDF
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}
