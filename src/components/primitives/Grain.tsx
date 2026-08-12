// Static SVG feTurbulence noise, inlined as a data URI — no image request,
// no animation (an animated grain would be a real battery/perf cost for
// almost no perceptual gain). Fixed to the viewport and hidden below `md`
// per the redesign plan's explicit call-out on mobile battery cost.
const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        opacity: 'var(--grain-opacity)',
        mixBlendMode: 'overlay',
      }}
    />
  );
}
