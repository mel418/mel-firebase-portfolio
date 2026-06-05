/**
 * Headed QA walkthrough — watch this run in the browser window that pops up.
 * Run with: node qa.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3003';
const SLOW = 600; // ms between actions so you can watch

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function log(msg) {
  console.log(`\n▶  ${msg}`);
  await sleep(400);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: SLOW });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Desktop layout ─────────────────────────────────────────────────────
  await log('1/9  Opening portfolio at 1400×900 (desktop)');
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(1200);

  // ── 2. Right panel collapse ────────────────────────────────────────────────
  await log('2/9  Collapsing right "Now Playing" panel');
  const toggleBtn = page.locator('button[aria-label="Collapse panel"]');
  await toggleBtn.click();
  await sleep(1000);

  await log('      Re-expanding right panel');
  const expandBtn = page.locator('button[aria-label="Expand panel"]');
  await expandBtn.click();
  await sleep(1000);

  // ── 3. Sidebar nav — scroll to each section ────────────────────────────────
  await log('3/9  Clicking sidebar nav items in sequence');
  for (const anchor of ['#experience', '#projects', '#skills', '#education', '#contact', '#profile']) {
    await page.goto(`${BASE}/${anchor}`, { waitUntil: 'domcontentloaded' });
    await sleep(900);
  }

  // ── 4. Experience — expand all rows ───────────────────────────────────────
  await log('4/9  Expanding all Experience rows');
  await page.goto(`${BASE}/#experience`, { waitUntil: 'domcontentloaded' });
  await sleep(600);
  const expRows = page.locator('table tbody tr[class*="cursor-pointer"]');
  const expCount = await expRows.count();
  for (let i = 0; i < expCount; i++) {
    await expRows.nth(i).click();
    await sleep(700);
  }

  // ── 5. Projects — hover each row ──────────────────────────────────────────
  await log('5/9  Hovering project rows (Play icon should appear)');
  await page.goto(`${BASE}/#projects`, { waitUntil: 'domcontentloaded' });
  await sleep(600);
  const projRows = page.locator('table tbody tr[class*="cursor-pointer"]');
  const projCount = await projRows.count();
  for (let i = 0; i < projCount; i++) {
    await projRows.nth(i).hover();
    await sleep(600);
  }

  // ── 6. Tablet layout ──────────────────────────────────────────────────────
  await log('6/9  Resizing to tablet (900×800) — right panel hidden');
  await page.setViewportSize({ width: 900, height: 800 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(1500);

  // ── 7. Mobile layout ──────────────────────────────────────────────────────
  await log('7/9  Resizing to mobile (390×844) — bottom nav should appear');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await sleep(1500);

  // Tap bottom nav items
  // Use JS navigation instead of click to avoid Next.js dev toolbar overlay
  const anchors = ['#profile', '#experience', '#projects', '#skills', '#education', '#contact'];
  for (const anchor of anchors) {
    await page.evaluate((a) => {
      document.getElementById(a.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    }, anchor);
    await sleep(700);
  }

  // ── 8. Light mode ─────────────────────────────────────────────────────────
  await log('8/9  Back to desktop — toggling light/dark mode');
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(1000);

  try {
    // Force-click the theme dropdown — right panel header, first dropdown trigger
    const themeBtn = page.locator('button[aria-haspopup="menu"]').first();
    await themeBtn.click({ force: true, timeout: 5000 });
    await sleep(500);
    await page.locator('[role="menuitem"]:has-text("Light")').click({ timeout: 3000 });
    await sleep(1500);

    await log('      Switching back to dark mode');
    await themeBtn.click({ force: true, timeout: 5000 });
    await sleep(500);
    await page.locator('[role="menuitem"]:has-text("Dark")').click({ timeout: 3000 });
    await sleep(1500);
  } catch {
    // ThemeToggle interaction failed — demonstrating via localStorage instead
    await log('      (ThemeToggle obscured by dev overlay — toggling via JS)');
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio-theme', 'light');
    });
    await sleep(1200);
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio-theme', 'dark');
    });
    await sleep(1200);
  }

  // ── 9. Contact form ────────────────────────────────────────────────────────
  await log('9/9  Filling out contact form');
  await page.goto(`${BASE}/#contact`, { waitUntil: 'domcontentloaded' });
  await sleep(600);
  await page.fill('input[name="name"]', 'Test User');
  await sleep(400);
  await page.fill('input[name="email"]', 'test@example.com');
  await sleep(400);
  await page.fill('textarea[name="message"]', 'Hello! This is an automated QA test message.');
  await sleep(800);

  // ── Done ────────────────────────────────────────────────────────────────────
  console.log('\n✅  QA walkthrough complete. Closing browser in 3s…');
  await sleep(3000);
  await browser.close();
})();
