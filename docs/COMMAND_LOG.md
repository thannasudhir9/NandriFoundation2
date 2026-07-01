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
