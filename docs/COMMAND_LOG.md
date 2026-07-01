# Command Log

## Purpose
Reference command catalog used for setup, build, run, deploy, verification, screenshots, and git workflows.

## Local Development

```bash
npm install
npm run dev
npm run dev -- --hostname 127.0.0.1 --port 3002
WATCHPACK_POLLING=true npm run dev -- --hostname 127.0.0.1 --port 3002
```

## Quality / Build

```bash
npm run lint
npm run build
npm run start -- --hostname 127.0.0.1 --port 3004
```

## Git / Release

```bash
git status --short --branch
git diff --stat
git log --oneline --decorate -12
git add .
git commit -m "..."
git push origin main
```

## GitHub Auth (Safe)

```bash
gh auth login
gh auth setup-git
git pull origin main
git push origin main
```

## Screenshot Automation (Playwright)

Install:

```bash
npm install -D playwright
npx playwright install chromium
```

Quick screenshot:

```bash
npx playwright screenshot --device="Desktop Chrome" --timeout=5000 "http://127.0.0.1:3002/" "screenshots/next-home.png"
```

Batch scripted capture pattern:

```bash
node -e "<playwright script>"
```

Project script (recommended):

```bash
npm run ui:smoke:screenshots
```

SQLite bootstrap (no UI needed):

```bash
npm run db:init
```

Seed DB from current app datasets (students + updates + sponsors):

```bash
npx tsx -e "import { INITIAL_STUDENTS, INITIAL_UPDATES, INITIAL_SPONSORS } from './src/data.ts'; (async () => { const resp = await fetch('http://127.0.0.1:3011/api/sqlite-sync/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ students: INITIAL_STUDENTS, updates: INITIAL_UPDATES, sponsors: INITIAL_SPONSORS }) }); console.log(await resp.text()); })();"
```

Verify SQLite table counts:

```bash
node -e "const Database=require('better-sqlite3'); const db=new Database('data/nandri.sqlite'); console.log({students:db.prepare('SELECT COUNT(*) c FROM students').get().c,updates:db.prepare('SELECT COUNT(*) c FROM updates').get().c,sponsors:db.prepare('SELECT COUNT(*) c FROM sponsors').get().c}); db.close();"
```

Configurable envs:

```bash
VITE_BASE_URL=http://127.0.0.1:3000 \
NEXT_BASE_URL=http://127.0.0.1:3002 \
SCREENSHOT_DIR=screenshots \
UI_TIMEOUT_MS=5000 \
npm run ui:smoke:screenshots
```

## Live Site Check

```bash
curl -I https://thannasudhir9.github.io/NandriFoundation2/
curl -I https://thannasudhir9.github.io/NandriFoundation2/reports/
```

## Notes
- Prefer short route probes to validate page status quickly.
- Use production server (`npm run start`) for stable screenshots.
- Avoid token-in-URL git commands.
