#!/usr/bin/env python3
"""
Generates the decorative scrapbook assets used by the site (public/stickers/*).

Everything is drawn procedurally with Pillow so the art is reproducible and
tweakable: edit a colour or shape here and re-run
    python scripts/generate_stickers.py

Vector-ish shapes are drawn at 4x and downsampled (LANCZOS) for anti-aliasing;
pixel-art sprites are drawn 1:1 and scaled with NEAREST so they stay crisp.
All output is decorative only (alt="" / aria-hidden in the UI) — real text
content always stays real HTML text.
"""
import math
import os
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter

S = 4  # supersample factor
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(ROOT, '..', 'public', 'stickers'))
os.makedirs(OUT, exist_ok=True)

# ── palette ──────────────────────────────────────────────────────────────────
# The scrapbook/kawaii *shapes* come from the reference moodboard, but the
# colours are the site's own palette (globals.css): sage-400, olive-600,
# forest-700, paper/cream and charcoal. Names below are kept from the
# original pink moodboard (BLUSH/PINK/ROSE/DEEP) as roles: lightest tint,
# main fill, line accent, deep accent.
BLUSH = (226, 236, 218)      # lightest sage tint
PINK = (176, 201, 163)       # sage — main fill (≈ --sage-400 lightened)
ROSE = (112, 146, 104)       # deeper sage/olive — outlines & accents
DEEP = (52, 90, 64)          # forest — darkest accent (≈ --forest-700)
HEART = (146, 184, 134)      # sticker-heart fill
CHEEK = (238, 172, 150, 175) # soft peach blush on the animal faces
CREAM = (247, 243, 232)      # paper-50 / cream-100
GRAY = (213, 211, 205)
INK = (26, 28, 25)           # charcoal-900
WHITE = (255, 255, 255)
BEIGE = (234, 224, 202)
BROWN = (168, 114, 84)
BROWN_DK = (112, 72, 54)
SHADOW = (40, 70, 48)        # drop-shadow tint (forest, not grey)


# ── drawing helpers ──────────────────────────────────────────────────────────
class D:
    """Tiny wrapper so shape coordinates are written in 1x units."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.img = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    @staticmethod
    def _kw(fill, outline, width):
        kw = {'fill': fill}
        if outline:
            kw.update(outline=outline, width=max(1, int(round(width * S))))
        return kw

    def ell(self, cx, cy, rx, ry=None, fill=None, outline=None, width=1):
        ry = rx if ry is None else ry
        self.d.ellipse([(cx - rx) * S, (cy - ry) * S, (cx + rx) * S, (cy + ry) * S],
                       **self._kw(fill, outline, width))

    def rrect(self, x0, y0, x1, y1, r, fill=None, outline=None, width=1):
        self.d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], radius=r * S,
                                 **self._kw(fill, outline, width))

    def poly(self, pts, fill=None):
        self.d.polygon([(x * S, y * S) for x, y in pts], fill=fill)

    def line(self, pts, fill, width):
        self.d.line([(x * S, y * S) for x, y in pts], fill=fill,
                    width=max(1, int(round(width * S))), joint='curve')

    def arc(self, cx, cy, rx, ry, start, end, fill, width):
        self.d.arc([(cx - rx) * S, (cy - ry) * S, (cx + rx) * S, (cy + ry) * S],
                   start, end, fill=fill, width=max(1, int(round(width * S))))

    def paste_layer(self, layer, cx, cy, angle=0):
        """Paste a (supersampled) RGBA layer rotated about its centre."""
        if angle:
            layer = layer.rotate(angle, resample=Image.BICUBIC, expand=True)
        self.img.alpha_composite(layer, (int(cx * S - layer.width / 2), int(cy * S - layer.height / 2)))
        self.d = ImageDraw.Draw(self.img)

    def overlay(self):
        layer = Image.new('RGBA', self.img.size, (0, 0, 0, 0))
        return layer, ImageDraw.Draw(layer)

    def commit(self, layer):
        self.img = Image.alpha_composite(self.img, layer)
        self.d = ImageDraw.Draw(self.img)


def save(img, name, size=None):
    size = size or (img.width // S, img.height // S)
    out = img.resize(size, Image.LANCZOS)
    out.save(os.path.join(OUT, name), optimize=True)
    return out


def stickerize(img, border=6, border_color=WHITE, shadow=True):
    """Die-cut sticker look: soft rounded white border + faint drop shadow."""
    b = border * S
    pad = b + 12 * S
    canvas = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    canvas.alpha_composite(img, (pad, pad))
    alpha = canvas.getchannel('A')
    # Blur-then-threshold dilates by ~1.9x the blur radius and rounds corners.
    grown = alpha.filter(ImageFilter.GaussianBlur(b / 1.9)).point(lambda v: 255 if v > 8 else 0)
    grown = grown.filter(ImageFilter.GaussianBlur(S * 0.6))
    result = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    if shadow:
        sh = Image.new('RGBA', canvas.size, SHADOW + (0,))
        sh.putalpha(grown.point(lambda v: int(v * 0.30)))
        sh = sh.filter(ImageFilter.GaussianBlur(4 * S))
        shifted = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
        shifted.alpha_composite(sh, (0, 3 * S))
        result.alpha_composite(shifted)
    border_layer = Image.new('RGBA', canvas.size, border_color + (255,))
    border_layer.putalpha(grown)
    result.alpha_composite(border_layer)
    result.alpha_composite(canvas)
    return result


def rot_ellipse(size_px, rx, ry, angle, color):
    """Small rotated ellipse layer (supersampled px units)."""
    side = int(max(rx, ry) * 2.6)
    layer = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([side / 2 - rx, side / 2 - ry, side / 2 + rx, side / 2 + ry], fill=color)
    return layer.rotate(angle, resample=Image.BICUBIC, expand=True)


# ── shape generators ─────────────────────────────────────────────────────────
def heart_points(cx, cy, width, n=240):
    scale = width / 32.0
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((cx + x * scale, cy + (y - 2.5) * scale))
    return pts


def sparkle_points(cx, cy, r, inner=0.22):
    pts = []
    for i in range(8):
        ang = math.pi / 2 * (i / 2.0) - math.pi / 2
        rad = r if i % 2 == 0 else r * inner
        pts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
    return pts


def star_points(cx, cy, r, inner=0.5):
    pts = []
    for i in range(10):
        ang = math.pi * i / 5 - math.pi / 2
        rad = r if i % 2 == 0 else r * inner
        pts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
    return pts


def bow(d, cx, cy, size, color=ROSE, outline=DEEP):
    """Simple two-loop bow."""
    s = size
    for sign in (-1, 1):
        d.poly([(cx, cy), (cx + sign * s, cy - s * 0.62), (cx + sign * s, cy + s * 0.62)], fill=color)
        d.line([(cx, cy), (cx + sign * s, cy - s * 0.62), (cx + sign * s, cy + s * 0.62), (cx, cy)],
               outline, s * 0.07)
    d.ell(cx, cy, s * 0.26, fill=color, outline=outline, width=s * 0.07)


# ── assets ───────────────────────────────────────────────────────────────────
def heart_glossy():
    size = 150
    d = D(size, size)
    d.poly(heart_points(size / 2, size / 2, size * 0.78), fill=HEART + (255,))
    # inner glow toward the bottom (slightly deeper rose)
    glow, gd = d.overlay()
    gd.ellipse([size * 0.25 * S, size * 0.55 * S, size * 0.75 * S, size * 0.95 * S], fill=ROSE + (110,))
    mask = Image.new('L', d.img.size, 0)
    ImageDraw.Draw(mask).polygon([(x * S, y * S) for x, y in heart_points(size / 2, size / 2, size * 0.78)], fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(10 * S))
    glow.putalpha(ImageChops.multiply(glow.getchannel('A'), mask))
    d.commit(glow)
    # gloss
    d.paste_layer(rot_ellipse(0, 11 * S, 6 * S, 35, WHITE + (210,)), size * 0.31, size * 0.34)
    d.ell(size * 0.22, size * 0.46, 2.4, fill=WHITE + (200,))
    save(stickerize(d.img, border=7), 'heart-green.png')


def sparkle(name, color, size=64):
    d = D(size, size)
    d.poly(sparkle_points(size / 2, size / 2, size * 0.46), fill=color)
    save(d.img, name)


def star_pink():
    size = 140
    d = D(size, size)
    # glow
    glow = Image.new('RGBA', d.img.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.polygon([(x * S, y * S) for x, y in star_points(size / 2, size / 2 + 3, size * 0.4)], fill=PINK + (230,))
    glow = glow.filter(ImageFilter.GaussianBlur(7 * S))
    d.img.alpha_composite(glow)
    d.d = ImageDraw.Draw(d.img)
    # rounded star body = blur+threshold, then outline ring
    body = Image.new('L', d.img.size, 0)
    ImageDraw.Draw(body).polygon([(x * S, y * S) for x, y in star_points(size / 2, size / 2 + 3, size * 0.4)], fill=255)
    body = body.filter(ImageFilter.GaussianBlur(5 * S)).point(lambda v: 255 if v > 118 else 0).filter(ImageFilter.GaussianBlur(S * 0.5))
    ring = ImageChops.subtract(body, body.filter(ImageFilter.GaussianBlur(3.2 * S)).point(lambda v: 255 if v > 200 else 0))
    fill = Image.new('RGBA', d.img.size, WHITE + (255,))
    fill.putalpha(body)
    d.img.alpha_composite(fill)
    ring_layer = Image.new('RGBA', d.img.size, ROSE + (255,))
    ring_layer.putalpha(ring)
    d.img.alpha_composite(ring_layer)
    save(d.img, 'star-sage.png')


def cloud_mask(w, h, inset=0):
    """Cloud silhouette as an L mask (supersampled), optionally shrunk."""
    m = Image.new('L', (w * S, h * S), 0)
    md = ImageDraw.Draw(m)
    i = inset
    circles = [(0.24, 0.62, 0.17), (0.42, 0.45, 0.24), (0.64, 0.50, 0.21), (0.80, 0.64, 0.15)]
    for cx, cy, r in circles:
        rad = max(0, r * h * 1.0 - i)
        md.ellipse([(cx * w - rad) * S, (cy * h - rad) * S, (cx * w + rad) * S, (cy * h + rad) * S], fill=255)
    base_top = 0.56 * h
    md.rounded_rectangle([(0.24 * w - 0.0) * S, (base_top) * S, (0.80 * w) * S, (0.80 * h - i) * S],
                         radius=max(0, 0.13 * h - i) * S, fill=255)
    return m


def cloud_outline(w, h, line=3, color=WHITE):
    outer = cloud_mask(w, h, 0)
    # Erode via invert → blur → threshold → invert (a uniform inset that,
    # unlike shrinking each primitive separately, can't leave stray specks
    # where the circles meet).
    inv = ImageChops.invert(outer).filter(ImageFilter.GaussianBlur(line * S / 1.9))
    inner = ImageChops.invert(inv.point(lambda v: 255 if v > 8 else 0))
    ring = ImageChops.subtract(outer, inner)
    layer = Image.new('RGBA', outer.size, color + (255,))
    layer.putalpha(ring)
    return layer


def album_cloud():
    """Pink 'album art' with outlined clouds — also the Spotify empty state."""
    size = 640
    d = D(size, size)
    # soft vertical gradient background, rounded
    bg = Image.new('RGBA', d.img.size)
    px = ImageDraw.Draw(bg)
    for y in range(bg.height):
        t = y / bg.height
        c = tuple(int(a + (b - a) * t) for a, b in zip((222, 235, 212), (166, 196, 150)))
        px.line([(0, y), (bg.width, y)], fill=c + (255,))
    mask = Image.new('L', bg.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, bg.width - 1, bg.height - 1], radius=44 * S, fill=255)
    bg.putalpha(mask)
    d.img.alpha_composite(bg)
    d.d = ImageDraw.Draw(d.img)
    # clouds (placed as separate rendered layers so they can overlap nicely)
    placements = [(0.32, 0.28, 340, 200, 0), (0.68, 0.54, 380, 220, 0), (0.34, 0.78, 280, 164, 0)]
    for fx, fy, cw, ch, _ in placements:
        layer = cloud_outline(cw, ch, line=5)
        d.img.alpha_composite(layer, (int(fx * size * S - layer.width / 2), int(fy * size * S - layer.height / 2)))
    d.d = ImageDraw.Draw(d.img)
    # sparkles + diamond stars
    for fx, fy, r in [(0.60, 0.18, 22), (0.15, 0.55, 16), (0.86, 0.80, 20), (0.52, 0.90, 12), (0.88, 0.22, 11)]:
        d.poly(sparkle_points(fx * size, fy * size, r), fill=WHITE)
    for fx, fy, r in [(0.78, 0.30, 9), (0.20, 0.18, 8), (0.46, 0.62, 7)]:
        d.poly([(fx * size, fy * size - r), (fx * size + r * 0.7, fy * size), (fx * size, fy * size + r),
                (fx * size - r * 0.7, fy * size)], fill=WHITE + (235,))
    save(d.img, 'album-cloud.png', (480, 480))


def teddy():
    W = H = 300
    d = D(W, H)
    o = BROWN_DK
    # ears
    for cx in (84, 216):
        d.ell(cx, 78, 38, fill=BROWN, outline=o, width=3.2)
        d.ell(cx, 80, 21, fill=(232, 176, 156), outline=None)
    # body & limbs
    d.ell(150, 240, 70, 58, fill=BROWN, outline=o, width=3.2)
    d.ell(150, 250, 40, 34, fill=CREAM, outline=None)
    for cx, ang in ((86, 1), (214, -1)):
        d.ell(cx, 222, 22, 36, fill=BROWN, outline=o, width=3.2)
    for cx in (110, 190):
        d.ell(cx, 288, 28, 17, fill=BROWN, outline=o, width=3.2)
        d.ell(cx, 290, 14, 8, fill=(236, 172, 160))
    # head
    d.ell(150, 138, 90, 82, fill=BROWN, outline=o, width=3.4)
    d.ell(150, 168, 38, 30, fill=CREAM, outline=o, width=2.4)
    d.ell(150, 152, 11, 8, fill=INK)
    d.line([(150, 160), (150, 170)], INK, 2.2)
    d.arc(139, 170, 11, 8, 10, 170, INK, 2.2)
    d.arc(161, 170, 11, 8, 10, 170, INK, 2.2)
    for cx in (112, 188):
        d.ell(cx, 128, 8, 9, fill=INK)
        d.ell(cx + 2.5, 124.5, 2.8, fill=WHITE)
    cheek, cd = d.overlay()
    for cx in (92, 208):
        cd.ellipse([(cx - 17) * S, (160 - 11) * S, (cx + 17) * S, (160 + 11) * S], fill=CHEEK)
    d.commit(cheek)
    # tiny bow on one ear
    bow(d, 232, 52, 17, color=PINK, outline=DEEP)
    save(stickerize(d.img, border=6, border_color=(255, 250, 244)), 'teddy.png')


def bunny():
    W = H = 300
    d = D(W, H)
    o = (150, 120, 112)
    # ears (rotated layers so they can lean)
    for cx, ang in ((104, 9), (196, -9)):
        layer = Image.new('RGBA', (80 * S, 170 * S), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        ld.ellipse([8 * S, 6 * S, 72 * S, 164 * S], fill=CREAM + (255,), outline=o, width=int(3.2 * S))
        ld.ellipse([22 * S, 30 * S, 58 * S, 140 * S], fill=PINK + (255,))
        d.paste_layer(layer, cx, 78, ang)
    # head + body
    d.ell(150, 244, 62, 52, fill=CREAM, outline=o, width=3.2)
    d.ell(150, 178, 92, 78, fill=CREAM, outline=o, width=3.4)
    # headphone band over the head
    d.arc(150, 168, 98, 98, 196, 344, INK, 11)
    # earcups
    for cx in (50, 250):
        d.rrect(cx - 19, 142, cx + 19, 214, 16, fill=INK)
        d.rrect(cx - 10, 152, cx + 10, 204, 9, fill=ROSE)
    # face
    for cx in (112, 188):
        d.ell(cx, 176, 8, 9.5, fill=INK)
        d.ell(cx + 2.6, 172.4, 2.8, fill=WHITE)
    d.poly([(143, 192), (157, 192), (150, 201)], fill=ROSE)
    d.arc(140, 201, 10, 8, 10, 170, INK, 2.2)
    d.arc(160, 201, 10, 8, 10, 170, INK, 2.2)
    cheek, cd = d.overlay()
    for cx in (92, 208):
        cd.ellipse([(cx - 17) * S, (196 - 11) * S, (cx + 17) * S, (196 + 11) * S], fill=CHEEK)
    d.commit(cheek)
    save(stickerize(d.img, border=6, border_color=(255, 250, 244)), 'bunny-headphones.png')


def flower_knob():
    size = 72
    d = D(size, size)
    for i in range(6):
        ang = math.pi * 2 * i / 6
        d.ell(size / 2 + math.cos(ang) * 17, size / 2 + math.sin(ang) * 17, 14, fill=PINK, outline=ROSE, width=1.6)
    d.ell(size / 2, size / 2, 11, fill=(255, 244, 214), outline=ROSE, width=1.6)
    save(stickerize(d.img, border=3, shadow=True), 'flower-knob.png')


def tape(name, base, stripe=None, stripe_alpha=0, gingham=False, w=240, h=58, pattern_cell=12):
    d = D(w, h)
    # zig-zag cut ends
    pts = [(0, 0)]
    steps = 6
    for i in range(steps + 1):
        pts.append((4 if i % 2 else 0, h * i / steps))
    zig_l = [(0, 0)] + [((4 if i % 2 else 0), h * i / steps) for i in range(steps + 1)]
    right = [((w - 4 if i % 2 else w), h * i / steps) for i in range(steps + 1)]
    shape = [(x, y) for x, y in zig_l[1:]] + right[::-1]
    mask = Image.new('L', d.img.size, 0)
    ImageDraw.Draw(mask).polygon([(x * S, y * S) for x, y in shape], fill=255)
    fill = Image.new('RGBA', d.img.size, base + (255,))
    layer = Image.new('RGBA', d.img.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    cell = pattern_cell * S
    if gingham:
        for x in range(0, fill.width, cell * 2):
            ld.rectangle([x, 0, x + cell, fill.height], fill=stripe + (stripe_alpha,))
        for y in range(0, fill.height, cell * 2):
            ld.rectangle([0, y, fill.width, y + cell], fill=stripe + (stripe_alpha,))
    elif stripe:
        for x in range(0, fill.width, cell * 2):
            ld.rectangle([x, 0, x + cell, fill.height], fill=stripe + (stripe_alpha,))
    fill.alpha_composite(layer)
    # paper-tape translucency
    a = ImageChops.multiply(mask, Image.new('L', mask.size, 222))
    fill.putalpha(a)
    # soft edge shading
    out = Image.new('RGBA', d.img.size, (0, 0, 0, 0))
    sh = Image.new('RGBA', d.img.size, SHADOW + (0,))
    sh.putalpha(mask.point(lambda v: int(v * 0.22)))
    sh = sh.filter(ImageFilter.GaussianBlur(2.2 * S))
    pad = Image.new('RGBA', d.img.size, (0, 0, 0, 0))
    pad.alpha_composite(sh, (0, S))
    out.alpha_composite(pad)
    out.alpha_composite(fill)
    save(out, name)


def waveform():
    w, h = 220, 70
    d = D(w, h)
    d.rrect(2, 2, w - 2, h - 2, 18, fill=PINK, outline=ROSE, width=1.6)
    d.ell(34, h / 2, 16, fill=INK)
    d.poly([(30, h / 2 - 8), (30, h / 2 + 8), (42, h / 2)], fill=PINK)
    random.seed(7)
    x = 62
    while x < w - 18:
        bh = random.choice([8, 14, 22, 30, 38, 26, 16, 10, 34, 20])
        d.rrect(x, h / 2 - bh / 2, x + 4, h / 2 + bh / 2, 2, fill=INK)
        x += 8.5
    save(d.img, 'waveform.png')


def envelope():
    w, h = 140, 100
    d = D(w, h)
    d.rrect(4, 14, w - 4, h - 6, 10, fill=WHITE, outline=ROSE, width=2.4)
    d.line([(8, 20), (w / 2, h / 2 + 4), (w - 8, 20)], ROSE, 2.4)
    d.poly(heart_points(w / 2, h / 2 + 6, 24), fill=HEART + (255,))
    save(stickerize(d.img, border=4), 'envelope.png')


def folder(name, emblem):
    w, h = 120, 96
    d = D(w, h)
    d.rrect(6, 14, 50, 40, 8, fill=ROSE)
    d.rrect(6, 24, w - 6, h - 8, 12, fill=PINK, outline=ROSE, width=2.4)
    cx, cy = w / 2, 58
    if emblem == 'star':
        d.poly(star_points(cx, cy, 15), fill=WHITE)
    elif emblem == 'heart':
        d.poly(heart_points(cx, cy, 30), fill=WHITE)
    else:
        bow(d, cx, cy, 15, color=WHITE, outline=ROSE)
    save(stickerize(d.img, border=4), name)


# ── pixel art ────────────────────────────────────────────────────────────────
def sprite(rows, palette, scale, name, outline=None):
    h, w = len(rows), max(len(r) for r in rows)
    pad = 1 if outline else 0
    img = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch in palette:
                px[x + pad, y + pad] = palette[ch]
    if outline:
        src = img.copy()
        sp = src.load()
        for y in range(src.height):
            for x in range(src.width):
                if sp[x, y][3] == 0:
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < src.width and 0 <= ny < src.height and sp[nx, ny][3] > 0:
                            px[x, y] = outline
                            break
    img = img.resize((img.width * scale, img.height * scale), Image.NEAREST)
    img.save(os.path.join(OUT, name), optimize=True)


def pixel_art():
    k, w_, p, b = INK + (255,), WHITE + (255,), ROSE + (255,), BLUSH + (255,)
    # Blocky black cat: pointed ears, square white eyes, pink nose, bow tie.
    cat = [
        "...............",
        ".KK..PP.PP..KK.",
        ".KKK..PPP..KKK.",
        ".KKKKKKKKKKKKK.",
        "KKKKKKKKKKKKKKK",
        "KKWWKKKKKKKWWKK",
        "KKWWKKKKKKKWWKK",
        "KKKKKKKPKKKKKKK",
        "KKKKKKKKKKKKKKK",
        "KKKKKKWKWKKKKKK",
        ".KKKKKKWKKKKKK.",
        "..KKKKKKKKKKK..",
    ]
    sprite(cat, {'K': k, 'W': w_, 'P': p}, 8, 'pixel-cat.png')

    hearts = [
        "..XX.XX..",
        ".XXXXXXX.",
        "XXWXXXXXX",
        "XXXXXXXXX",
        ".XXXXXXX.",
        "..XXXXX..",
        "...XXX...",
        "....X....",
    ]
    for name, col in (('white', w_), ('forest', (104, 140, 98, 255)), ('sage', b)):
        pal = {'X': col, 'W': (255, 255, 255, 255)}
        sprite(hearts, pal, 6, f'pixel-heart-{name}.png', outline=(52, 90, 64, 255) if name != 'white' else ROSE + (255,))


# ── textures ─────────────────────────────────────────────────────────────────
def paper_grain():
    """Seamless-ish warm paper grain tile (alpha overlay: fibres + speckle)."""
    size = 512
    rnd = random.Random(11)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    px = img.load()
    for _ in range(26000):
        x, y = rnd.randrange(size), rnd.randrange(size)
        dark = rnd.random() < 0.55
        px[x, y] = (120, 80, 70, rnd.randrange(10, 34)) if dark else (255, 255, 255, rnd.randrange(14, 40))
    dr = ImageDraw.Draw(img)
    for _ in range(260):  # fibres, drawn wrapped so edges tile
        x, y = rnd.randrange(size), rnd.randrange(size)
        ang = rnd.uniform(0, math.pi)
        ln = rnd.uniform(6, 22)
        dx, dy = math.cos(ang) * ln, math.sin(ang) * ln
        col = (150, 105, 95, rnd.randrange(14, 30)) if rnd.random() < 0.6 else (255, 255, 255, rnd.randrange(20, 44))
        for ox in (-size, 0, size):
            for oy in (-size, 0, size):
                dr.line([(x + ox, y + oy), (x + ox + dx, y + oy + dy)], fill=col, width=1)
    img.save(os.path.join(OUT, 'paper-grain.png'), optimize=True)


def main():
    heart_glossy()
    sparkle('sparkle-sage.png', ROSE + (255,))
    star_pink()
    album_cloud()
    teddy()
    bunny()
    flower_knob()
    tape('tape-gingham.png', (236, 243, 230), stripe=ROSE, stripe_alpha=120, gingham=True)
    tape('tape-beige.png', BEIGE, stripe=(222, 202, 172), stripe_alpha=90, w=200, h=50)
    tape('tape-sage.png', PINK, stripe=(255, 255, 255), stripe_alpha=70, w=200, h=50, pattern_cell=8)
    waveform()
    envelope()
    folder('folder-star.png', 'star')
    folder('folder-heart.png', 'heart')
    folder('folder-bow.png', 'bow')
    pixel_art()
    paper_grain()
    print('wrote', len(os.listdir(OUT)), 'files to', OUT)


if __name__ == '__main__':
    main()
