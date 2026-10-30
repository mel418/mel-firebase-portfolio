#!/usr/bin/env python3
"""
Generates the small interactive props used by the site (public/props/*).

Unlike the stickers in scripts/generate_stickers.py (loose decoration), each
prop here is built in *layers* so React can animate the moving part on its own:

  cassette-body.png   the shell, with the tape window punched out (transparent)
  cassette-reel.png   one reel hub — rendered twice and spun behind the shell
  vinyl.png           the record (spins)
  vinyl-sheen.png     the light reflection (stays still while the record spins)
  knob-dial.png       the six-detent tick ring + shadow (static)
  knob-cap.png        the knob cap with its pointer (rotated by React, -135°…+135°)

Geometry constants at the top are mirrored in src/components/props/*.tsx as
percentages — change one, change the other. Re-run with
    python scripts/generate_props.py

Palette is the site's own green/cream (see globals.css). No text is drawn into
any image: labels are real HTML text laid over the art.
"""
import math
import os

from PIL import Image, ImageDraw, ImageFilter

S = 4  # supersample factor
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(ROOT, '..', 'public', 'props'))
os.makedirs(OUT, exist_ok=True)

SAGE = (176, 201, 163)
SAGE_DK = (146, 178, 134)
ROSE = (112, 146, 104)
DEEP = (52, 90, 64)
CREAM = (247, 243, 232)
INK = (26, 28, 25)
SHADOW = (40, 70, 48)

# ── cassette geometry (1x px) ───────────────────────────────────────────────
CW, CH = 640, 410
WINDOW = (170, 222, 470, 318)        # transparent pill the reels show through
REEL_CENTERS = ((250, 270), (390, 270))
REEL_D = 72                          # reel sprite diameter


def canvas(w, h):
    img = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
    return img, ImageDraw.Draw(img)


def box(x0, y0, x1, y1):
    return [x0 * S, y0 * S, x1 * S, y1 * S]


def down(img, w, h):
    return img.resize((w, h), Image.LANCZOS)


def soft_shadow(silhouette, offset=(0, 8), blur=10, alpha=70):
    """Blurred, forest-tinted copy of an RGBA image's alpha, for a drop shadow."""
    a = silhouette.getchannel('A').point(lambda v: min(255, int(v * alpha / 255)))
    sh = Image.new('RGBA', silhouette.size, SHADOW + (0,))
    sh.putalpha(a)
    shifted = Image.new('RGBA', silhouette.size, (0, 0, 0, 0))
    shifted.paste(sh, (offset[0] * S, offset[1] * S))
    return shifted.filter(ImageFilter.GaussianBlur(blur * S))


def cassette_body():
    img, d = canvas(CW, CH)

    # shell
    d.rounded_rectangle(box(20, 16, 620, 380), radius=28 * S, fill=SAGE, outline=DEEP, width=4 * S)
    # inner bevel — a lighter hairline just inside the outline
    d.rounded_rectangle(box(30, 26, 610, 370), radius=20 * S, outline=(205, 222, 194), width=2 * S)

    # label card with a colour band across the top
    d.rounded_rectangle(box(60, 44, 580, 200), radius=16 * S, fill=CREAM, outline=DEEP, width=3 * S)
    d.rounded_rectangle(box(63, 47, 577, 80), radius=13 * S, fill=ROSE)
    d.rectangle(box(63, 64, 577, 80), fill=ROSE)  # square off the band's lower edge

    # lower trapezoid with the two tape-guide holes
    d.polygon([(120 * S, 380 * S), (166 * S, 330 * S), (474 * S, 330 * S), (520 * S, 380 * S)], fill=SAGE_DK, outline=DEEP)
    d.line([(120 * S, 380 * S), (166 * S, 330 * S), (474 * S, 330 * S), (520 * S, 380 * S)], fill=DEEP, width=3 * S, joint='curve')
    for cx in (222, 418):
        d.ellipse(box(cx - 9, 349, cx + 9, 367), fill=DEEP)
    d.rounded_rectangle(box(300, 350, 340, 366), radius=4 * S, fill=DEEP)

    # corner screws
    for cx, cy in ((42, 38), (598, 38), (42, 358), (598, 358)):
        d.ellipse(box(cx - 7, cy - 7, cx + 7, cy + 7), fill=CREAM, outline=DEEP, width=2 * S)
        d.line([(cx - 4) * S, (cy + 3) * S, (cx + 4) * S, (cy - 3) * S], fill=DEEP, width=2 * S)

    shadow = soft_shadow(img)
    out = Image.alpha_composite(shadow, img)

    # punch the tape window last so the reels behind the shell show through
    punch = Image.new('L', out.size, 255)
    ImageDraw.Draw(punch).rounded_rectangle(box(*WINDOW), radius=((WINDOW[3] - WINDOW[1]) // 2) * S, fill=0)
    out.putalpha(Image.composite(out.getchannel('A'), Image.new('L', out.size, 0), punch))
    # window rim, drawn after the punch so it frames the hole
    rim = Image.new('RGBA', out.size, (0, 0, 0, 0))
    ImageDraw.Draw(rim).rounded_rectangle(box(*WINDOW), radius=((WINDOW[3] - WINDOW[1]) // 2) * S, outline=DEEP, width=4 * S)
    out = Image.alpha_composite(out, rim)

    down(out, CW, CH).save(os.path.join(OUT, 'cassette-body.png'), optimize=True)


def cassette_reel():
    n = REEL_D
    img, d = canvas(n, n)
    c = n / 2
    d.ellipse(box(0, 0, n, n), fill=(78, 70, 62))              # wound tape
    d.ellipse(box(c - 24, c - 24, c + 24, c + 24), fill=CREAM)  # hub ring
    d.ellipse(box(c - 15, c - 15, c + 15, c + 15), fill=INK)    # hub hole
    for i in range(6):                                          # six teeth — what makes the spin readable
        a = math.radians(i * 60)
        x0, y0 = c + math.cos(a) * 9, c + math.sin(a) * 9
        x1, y1 = c + math.cos(a) * 15, c + math.sin(a) * 15
        d.line([(x0 * S, y0 * S), (x1 * S, y1 * S)], fill=CREAM, width=int(3.4 * S))
    down(img, n * 2, n * 2).save(os.path.join(OUT, 'cassette-reel.png'), optimize=True)


# ── vinyl ───────────────────────────────────────────────────────────────────
VD = 480


def vinyl():
    n = VD
    img, d = canvas(n, n)
    c = n / 2
    d.ellipse(box(2, 2, n - 2, n - 2), fill=(34, 42, 36), outline=ROSE, width=3 * S)
    # grooves — thin concentric rings, alternating strength
    r = c - 14
    k = 0
    while r > c * 0.40:
        d.ellipse(box(c - r, c - r, c + r, c + r), outline=(52, 64, 54) if k % 2 else (44, 54, 46), width=S)
        r -= 7
        k += 1
    # label
    lr = c * 0.34
    d.ellipse(box(c - lr, c - lr, c + lr, c + lr), fill=SAGE, outline=DEEP, width=3 * S)
    d.ellipse(box(c - lr * 0.72, c - lr * 0.72, c + lr * 0.72, c + lr * 0.72), outline=CREAM, width=2 * S)
    # a four-point sparkle on the label so a half-turn reads as spinning, not static
    sx, sy, sr = c, c - lr * 0.40, lr * 0.20
    pts = []
    for i in range(8):
        a = math.radians(-90 + i * 45)
        rr = sr if i % 2 == 0 else sr * 0.28
        pts.append(((sx + math.cos(a) * rr) * S, (sy + math.sin(a) * rr) * S))
    d.polygon(pts, fill=DEEP)
    # spindle hole
    d.ellipse(box(c - 7, c - 7, c + 7, c + 7), fill=(0, 0, 0, 0))
    hole = Image.new('L', img.size, 255)
    ImageDraw.Draw(hole).ellipse(box(c - 7, c - 7, c + 7, c + 7), fill=0)
    img.putalpha(Image.composite(img.getchannel('A'), Image.new('L', img.size, 0), hole))

    out = Image.alpha_composite(soft_shadow(img, offset=(0, 6), blur=9, alpha=60), img)
    down(out, n, n).save(os.path.join(OUT, 'vinyl.png'), optimize=True)


def vinyl_sheen():
    """Two opposing pale wedges. Kept as its own layer so the record can turn
    underneath a reflection that holds still, like a real one."""
    n = VD
    img = Image.new('RGBA', (n * S, n * S), (0, 0, 0, 0))
    wedges = Image.new('RGBA', img.size, (0, 0, 0, 0))
    wd = ImageDraw.Draw(wedges)
    c = n * S / 2
    for start in (-62, 118):
        pts = [(c, c)]
        for i in range(0, 41):
            a = math.radians(start + i)
            pts.append((c + math.cos(a) * c, c + math.sin(a) * c))
        wd.polygon(pts, fill=(255, 255, 255, 34))
    wedges = wedges.filter(ImageFilter.GaussianBlur(10 * S))
    mask = Image.new('L', img.size, 0)
    ImageDraw.Draw(mask).ellipse([2 * S, 2 * S, (n - 2) * S, (n - 2) * S], fill=255)
    img.paste(wedges, (0, 0), mask)
    down(img, n, n).save(os.path.join(OUT, 'vinyl-sheen.png'), optimize=True)


# ── volume knob ─────────────────────────────────────────────────────────────
KN = 360               # square canvas; both layers share it so the cap rotates about the centre
KNOB_SWEEP = 270       # degrees from 0 to 10; the dial's gap sits at the bottom
KNOB_STEPS = 5         # six detents, one per page section (0–5)


def knob_dial():
    """Static layer: the 0–10 tick ring and a soft shadow under the cap."""
    img, d = canvas(KN, KN)
    c = KN / 2
    for i in range(KNOB_STEPS + 1):
        a = math.radians(-KNOB_SWEEP / 2 + i * KNOB_SWEEP / KNOB_STEPS)
        long = True  # every detent is a section, so every tick is full size
        r0, r1 = (136 if long else 146), 164
        d.line([((c + math.sin(a) * r0) * S, (c - math.cos(a) * r0) * S),
                ((c + math.sin(a) * r1) * S, (c - math.cos(a) * r1) * S)],
               fill=ROSE, width=int((5 if long else 3.5) * S))
        # round the tick ends
        for r in (r0, r1):
            x, y = c + math.sin(a) * r, c - math.cos(a) * r
            w = 2.5 if long else 1.75
            d.ellipse(box(x - w, y - w, x + w, y + w), fill=ROSE)
    shadow = Image.new('RGBA', img.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse(box(c - 108, c - 100, c + 108, c + 116), fill=SHADOW + (90,))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10 * S))
    down(Image.alpha_composite(shadow, img), KN, KN).save(os.path.join(OUT, 'knob-dial.png'), optimize=True)


def knob_cap():
    """Rotating layer, drawn pointing straight up (= the 5 position's opposite
    end of the sweep is handled by CSS rotation)."""
    img, d = canvas(KN, KN)
    c = KN / 2
    d.ellipse(box(c - 108, c - 108, c + 108, c + 108), fill=SAGE, outline=DEEP, width=4 * S)
    for i in range(36):  # grip ridges around the rim
        a = math.radians(i * 10)
        d.line([((c + math.sin(a) * 96) * S, (c - math.cos(a) * 96) * S),
                ((c + math.sin(a) * 104) * S, (c - math.cos(a) * 104) * S)], fill=SAGE_DK, width=3 * S)
    d.ellipse(box(c - 80, c - 80, c + 80, c + 80), fill=(190, 212, 178), outline=(205, 222, 194), width=2 * S)
    d.rounded_rectangle(box(c - 7, c - 98, c + 7, c - 46), radius=7 * S, fill=DEEP)
    down(img, KN, KN).save(os.path.join(OUT, 'knob-cap.png'), optimize=True)


def main():
    cassette_body()
    cassette_reel()
    vinyl()
    vinyl_sheen()
    knob_dial()
    knob_cap()
    for name in sorted(os.listdir(OUT)):
        print('wrote', name, os.path.getsize(os.path.join(OUT, name)) // 1024, 'KB')


if __name__ == '__main__':
    main()
