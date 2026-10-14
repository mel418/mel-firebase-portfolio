// Paper-fibre texture tile generated with Pillow (scripts/generate_stickers.py).
// Static (an animated grain would be a real battery/perf cost for almost no
// perceptual gain), fixed to the viewport, and hidden below `md` per the
// redesign plan's explicit call-out on mobile battery cost.
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
      style={{
        backgroundImage: 'url(/stickers/paper-grain.png)',
        backgroundSize: '512px 512px',
        opacity: 'var(--grain-opacity)',
      }}
    />
  );
}
