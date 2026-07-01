#!/usr/bin/env node
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const VITE_BASE = process.env.VITE_BASE_URL || 'http://127.0.0.1:3000';
const NEXT_BASE = process.env.NEXT_BASE_URL || 'http://127.0.0.1:3002';
const OUTPUT_DIR = process.env.SCREENSHOT_DIR || 'screenshots';
const TIMEOUT_MS = Number(process.env.UI_TIMEOUT_MS || 5000);

const ROUTES = [
  { url: `${VITE_BASE}/`, marker: 'Nandri', file: 'vite-home.png' },
  { url: `${NEXT_BASE}/`, marker: 'Nandri', file: 'next-home.png' },
  { url: `${NEXT_BASE}/reports`, marker: 'Reporting Dashboard', file: 'next-reports.png' },
  { url: `${NEXT_BASE}/students`, marker: 'Students', file: 'next-students.png' },
  { url: `${NEXT_BASE}/crm`, marker: null, file: 'next-crm.png' },
  { url: `${NEXT_BASE}/profile`, marker: 'Settings', file: 'next-profile.png' },
  { url: `${NEXT_BASE}/features`, marker: 'Application Features', file: 'next-features.png' },
];

const TAB_SHOTS = [
  { tab: 'Sponsors', marker: 'Sponsors', file: 'next-sponsors.png', exact: true },
  { tab: 'Admin', marker: 'Admin SQL Console', file: 'next-admin.png', exact: true },
  { tab: 'Contact Us', marker: 'Contact Us', file: 'next-contact.png', exact: true },
];

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const armExecutable =
    '/Users/sthanna/NandriFoundation2/node_modules/playwright-core/.local-browsers/chromium-1228/chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium';
  const browser = await chromium.launch({
    headless: true,
    ...(existsSync(armExecutable) ? { executablePath: armExecutable } : {}),
  });
  const context = await browser.newContext({ viewport: { width: 1720, height: 960 } });
  await context.addInitScript(() => {
    localStorage.setItem(
      'nandri_user',
      JSON.stringify({
        id: 'ops-admin',
        name: 'Ops Admin',
        email: 'ops-admin@nandri.org',
        role: 'superadmin',
      }),
    );
  });
  const page = await context.newPage();

  const failures = [];
  for (const route of ROUTES) {
    try {
      await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
      await page.waitForSelector('body', { timeout: TIMEOUT_MS });
      await page.waitForSelector('text=404 This page could not be found.', {
        state: 'detached',
        timeout: TIMEOUT_MS,
      });
      if (route.marker) {
        await page.waitForSelector(`text=${route.marker}`, { timeout: TIMEOUT_MS });
      }
      await page.waitForTimeout(700);
      const path = `${OUTPUT_DIR}/${route.file}`;
      await page.screenshot({ path, fullPage: true });
      console.log(`PASS ${route.url} -> ${path}`);
    } catch (error) {
      failures.push({ route, error: error instanceof Error ? error.message : String(error) });
      console.log(`FAIL ${route.url}`);
    }
  }

  await page.goto(`${NEXT_BASE}/`, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_MS });
  for (const tabShot of TAB_SHOTS) {
    try {
      await page.getByRole('button', { name: tabShot.tab, exact: tabShot.exact }).click({ timeout: TIMEOUT_MS });
      await page.waitForSelector(`text=${tabShot.marker}`, { timeout: TIMEOUT_MS });
      await page.waitForTimeout(700);
      const path = `${OUTPUT_DIR}/${tabShot.file}`;
      await page.screenshot({ path, fullPage: true });
      console.log(`PASS tab ${tabShot.tab} -> ${path}`);
    } catch (error) {
      failures.push({ route: { url: `${NEXT_BASE}/`, marker: tabShot.tab }, error: error instanceof Error ? error.message : String(error) });
      console.log(`FAIL tab ${tabShot.tab}`);
    }
  }

  await browser.close();

  if (failures.length) {
    console.error('\nUI smoke failures:');
    for (const fail of failures) {
      console.error(`- ${fail.route.url}: ${fail.error}`);
    }
    process.exit(1);
  }

  console.log('\nAll UI checks passed and screenshots captured.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
