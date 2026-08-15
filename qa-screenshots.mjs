/**
 * v2 redesign regression harness.
 *
 * Captures a full-page + per-section screenshot matrix across breakpoints and
 * themes so each phase of the redesign can be diffed against the previous
 * one ("done" for a refactor-only phase = near-zero diff).
 *
 * Usage:
 *   node qa-screenshots.mjs <phase-label>
 *
 * Output:
 *   .qa/<phase-label>/<viewport>-<theme>-<section>.png
 *
 * Requires the dev server already running on http://localhost:9002
 * (matches the `dev` script in package.json — the old qa.mjs targeted 3003,
 * which has drifted from the real port for a while).
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:9002';
const phaseLabel = process.argv[2] ?? `run-${new Date().toISOString().replace(/[:.]/g, '-')}`;
const outDir = join(process.cwd(), '.qa', phaseLabel);

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'wide', width: 1600, height: 900 },
];

const THEMES = ['light', 'dark'];

// Section ids present in the current DOM (Phase 1+ content is still anchored
// on these same six ids — the content layer refactor doesn't rename them).
const SECTIONS = ['profile', 'projects', 'experience', 'skills', 'education', 'contact'];

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(t);
    localStorage.setItem('portfolio-theme', t);
  }, theme);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  let shots = 0;
  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      const ctx = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await ctx.newPage();

      // 'networkidle' never resolves against the Next dev server — its HMR
      // websocket stays open — so wait on 'load' plus a fixed settle delay.
      await page.goto(BASE, { waitUntil: 'load', timeout: 60000 });
      await setTheme(page, theme);
      await page.reload({ waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(800); // let one-shot reveal animations settle

      const prefix = `${viewport.name}-${theme}`;

      // Full page
      await page.screenshot({
        path: join(outDir, `${prefix}-full.png`),
        fullPage: true,
      });
      shots++;

      // Per-section (bounding-box) screenshots — the useful unit for diffing
      for (const id of SECTIONS) {
        const locator = page.locator(`#${id}`);
        if ((await locator.count()) === 0) continue;
        try {
          await locator.scrollIntoViewIfNeeded();
          await page.waitForTimeout(150);
          await locator.screenshot({ path: join(outDir, `${prefix}-${id}.png`) });
          shots++;
        } catch (err) {
          console.warn(`  ! skipped ${prefix}-${id}: ${err.message.split('\n')[0]}`);
        }
      }

      await ctx.close();
      console.log(`✓ ${prefix} (${SECTIONS.length + 1} shots)`);
    }
  }

  await browser.close();
  console.log(`\nDone — ${shots} screenshots written to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
