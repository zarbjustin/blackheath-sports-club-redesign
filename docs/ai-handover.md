# AI handover — Blackheath Sports Club website

This document lets any developer or AI pick the project up cold from another machine.
Read this first, then `docs/site-spec.md` (product spec) and `docs/backlog.md` (ranked next work).

## Snapshot

- **Repository:** `zarbjustin/blackheath-sports-club-redesign`
- **Live site:** https://blackheath-sports-club-redesign.pages.dev/
- **GitHub Pages mirror:** https://zarbjustin.github.io/blackheath-sports-club-redesign/
- **Branch:** `main` (deploys automatically via Cloudflare Pages and GitHub Pages)
- **Stack:** Vite 8 + React 19 (single-page, plain CSS), Framer Motion (via LazyMotion), lucide-react 1.23 icons, self-hosted variable fonts (Inter + Fraunces), `sharp` for build-time image optimisation.
- **Hosting:** Cloudflare Pages primary, GitHub Pages mirror (static; no backend, no database, no auth).
- **Status:** Feature-rich concept, grounded in the real club's facts. Not yet the club's official production site (needs club sign-off on prices/media/booking links + the enquiry form access key).
- **Current hardening release:** Sprints 16-18 on `codex/sprints-16-18-hardening`. Cloudflare Pages and GitHub Pages deploy from protected `main` after required checks pass.

## Delivered Sprint Snapshot

- Core redesign/spec/handover: delivered.
- Cloudflare Pages deployment: delivered.
- Privacy-friendly analytics scaffold and conversion hooks: delivered; Cloudflare Web Analytics provider enablement is managed in the Cloudflare dashboard/build env.
- Deeper accessibility: delivered; rerun screen-reader/axe passes after major UI changes.
- Local SEO expansion: delivered against the current Pages URL; update canonical/sitemap/OG URLs when the real domain is connected.
- PWA/offline: delivered; retest installability, service-worker scope and offline fallback when the real club domain replaces the temporary Pages URL.
- **Sprint 16 security:** response security headers, hCaptcha form protection, least-privilege Actions, locked quality tooling and accessible brand naming delivered.
- **Sprint 17 performance:** responsive hero preload, 47% smaller junior photo and shell-only PWA precache delivered. Precache reduced from 2.17 MiB to about 410 KiB.
- **Sprint 18 regression suite:** 10 Vitest tests, 12 desktop/mobile Playwright checks, axe WCAG A/AA, offline navigation and a repository-owned Lighthouse gate delivered.
- **Dependency maintenance (2026-07-08):** all Dependabot PRs resolved; repo has 0 open PRs and 0 stale branches.
  - GitHub Actions pinned: `actions/checkout` 4→7, `actions/setup-node` 4→6, `actions/deploy-pages` 4→5, `actions/upload-pages-artifact` 3→5.
  - npm major upgrades: `vite` 7→8.1.3, `@vitejs/plugin-react` 5→6.0.3 (coupled), `lucide-react` 0.468→1.23.0.
  - **Breaking change handled:** lucide-react v1 dropped all social/brand icons. `Twitter` and `Facebook` lucide imports replaced with inline SVG components (`XTwitterIcon`, `FacebookIcon` in `src/main.jsx`) using official brand SVG paths. Site appearance is unchanged.
- **CI fix (2026-07-08):** `lycheeverse/lychee-action` SHA in `.github/workflows/ci.yml` was invalid (fabricated). Corrected to real v2.8.0 SHA `8646ba30...` (commit `101ede3`).
- **Image updates (2026-07-08):**
  - `src/assets/club/sitemap.webp` — replaced with new professionally branded grounds map using club red/dark-navy colour scheme, 1149×1369px, 193 KB WebP (commits `682db08`, `7741c31`).
  - `src/assets/club/gallery-juniors.webp` — replaced with new junior players action photo, 1200×904px, 277 KB WebP (commit `a40e6eb`).
  - `src/assets/club/gallery-rugby-cinderford.webp` — replaced with Age Grade Rugby action photo, 1200×800px, 109 KB WebP; caption updated from "Rugby v Cinderford" to "Age Grade Rugby" in `src/data.js` (commit `a8ce938`).
- **Enquiry form live:** Web3Forms sends to `bhsportsclub@outlook.com`. hCaptcha lazy-loads near the form, a honeypot remains as defence in depth, and field lengths are bounded. **Owner action:** enable hCaptcha in the Web3Forms dashboard so it is enforced server-side.
- **Nav improvements (2026-07-08):** Reordered to Sports → Membership → Venue hire → Heritage → Visit. Media nav item + section hidden until `media.video.source` is set in `data.js` (auto-reveals when video is supplied). Removed `justify-content: space-between` dead zone; nav sits flush right via `margin-left: auto` (commit `81995dd`).

## What is built (as-built)

Single-page site (`src/main.jsx`) with these sections, all content-driven from `src/data.js`:

- **Hero** — responsive WebP image with blur-up + subtle parallax; staggered load animation.
- **Welcome** — real club intro copy, fact chips, no-dogs notice.
- **Sports** — Rugby/Cricket/Tennis/Squash cards with real club photos and custom SVG sport icons (`src/icons.jsx`); each links out to that club's official site (correct URLs).
- **Also at the Rectory Field** — Gym (Better Body) and Day Nursery cards linking externally.
- **Membership** — social membership £50/year, pathway chips.
- **Venue hire** — real facilities list + clubhouse bar photo; CTA to the enquiry form.
- **Enquire** — accessible venue-hire enquiry form (see "Enquiry form" below).
- **Heritage** — 1883/1885/1937 timeline + historic photos (Carpmael/Barbarians).
- **Gallery** — real club photos.
- **Media** — video-ready poster slot and guidance for future club promo clips.
- **Visit** — address, Sat-Nav postcode, nearby areas served, click-to-load Google Map (GDPR-friendly).
- **Grounds** — the club's site map image + a modern facilities legend.
- **Contact** — email, phone, bar hours, social links.
- **Footer** — brand, copyright, Privacy link, socials.

Standalone pages in `public/`: `privacy.html`, `offline.html`, `robots.txt`, `sitemap.xml`, `og-image.jpg`, PWA icons in `public/icons/`.

## Architecture & file map

- `index.html` — head: CSP + referrer meta, Cloudflare canonical, Open Graph/Twitter, PWA/Apple install metadata, local SEO geo meta, JSON-LD `@graph` (`SportsClub`, `LocalBusiness`, `SportsActivityLocation`, `WebSite`, `BreadcrumbList`), inline SVG favicon.
- `src/main.jsx` — the whole app: section components + `Hero`, `MapEmbed` (click-to-load), `Enquiry` (hCaptcha form), `Media`, `App` (header/nav/footer). Motion via `LazyMotion features={domAnimation}` + `m.*` components; `Reveal` wrapper does scroll-in animations. Header includes skip link, mobile focus trap and Escape-to-close.
- `src/data.js` — **all site content** (club facts, local SEO facts, contact, sports + URLs, facilities, gym/nursery, venue facilities, heritage timeline, gallery, media/video config, grounds map, the `enquiry` config and analytics config). Edit content HERE, not in JSX.
- `src/analytics.js` — opt-in privacy-friendly analytics loader and conversion-event helper. Cloudflare Web Analytics is off until `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is configured or Cloudflare Pages Web Analytics is enabled in the dashboard.
- `src/icons.jsx` — custom SVG sport icons (lucide-styled).
- `src/styles.css` — design tokens (colours, radii, fonts, easing) + all component styles + responsive + `prefers-reduced-motion`.
- `src/assets/` — hero WebP set + `hero-blur.js`; `src/assets/club/` — optimised club photos (WebP).
- `public/` — copied to site root (robots, sitemap, privacy, offline fallback, og-image, PWA icons).
- `scripts/` — build-time helpers: `optimize-hero.mjs`, `import-club-media.mjs`, `make-og-image.mjs`, `generate-pwa-icons.mjs`.
- `vite.config.js` — Vite + React + `vite-plugin-pwa`; manifest uses relative `start_url` and `scope` so it works on the current Pages URL and GitHub Pages mirror.
- `.github/workflows/deploy.yml` — Pages build/deploy (actions pinned to SHAs). `.github/dependabot.yml` — weekly npm + actions updates.
- `public/_headers` — Cloudflare response security/cache policy. Fingerprinted `/assets/*` are immutable; `sw.js` is never stored.
- `tests/`, `playwright.config.js` — Vitest and Playwright/axe coverage. `scripts/run-lighthouse.mjs` — locked local/CI quality gate.
- `docs/` — `ai-handover.md` (this), `site-spec.md` (product spec), `sprint-plan.md`, `backlog.md` (ranked next work).

## Build, run, deploy

```bash
npm install --registry https://registry.npmjs.org/   # see gotcha #1
npm run dev        # local dev server
npm run build      # production build to dist/
npm run preview    # serve the built dist/ (base path is "/", NOT the repo subpath)
npm test           # 10 component/integration tests
PLAYWRIGHT_CHANNEL=msedge npm run test:e2e  # 12 desktop/mobile checks locally
CHROME_PATH="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" npm run lighthouse
npm run optimize:hero    # regenerate hero WebP set (needs src/assets/rectory-field-concept.png)
npm run optimize:og      # regenerate public/og-image.jpg
npm run optimize:pwa-icons    # regenerate public/icons/*.png
node scripts/import-club-media.mjs   # re-optimise club photos from _clubmedia/ (git-ignored)
```

Deploy is automatic:

- Cloudflare Pages project: `blackheath-sports-club-redesign`
  - Source: `zarbjustin/blackheath-sports-club-redesign`
  - Production branch: `main`
  - Build command: `npm ci && npm run build`
  - Output directory: `dist`
- GitHub Pages mirror: push to `main` → GitHub Actions builds and deploys to GitHub Pages.

Analytics is opt-in:

- Cloudflare Pages dashboard path: Workers & Pages → `blackheath-sports-club-redesign` → Metrics → Enable Web Analytics.
- Manual snippet path: set `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the build environment. The app loads `https://static.cloudflareinsights.com/beacon.min.js` only when that token is present.
- Conversion hooks are already instrumented in code. They call `zaraz.track`, `plausible`, or `goatcounter` if one of those event-capable providers is later enabled; otherwise they no-op.
- Monthly reporting template: `docs/monthly-analytics-report.md`.

PWA/offline:

- `vite-plugin-pwa` generates `manifest.webmanifest`, `sw.js` and Workbox assets during `npm run build`.
- The service worker precaches the static shell/assets and uses a network-first same-origin page cache with `offline.html` as the fallback only when navigation is offline.
- Manifest `start_url` and `scope` are relative (`"."`) to support both the current Cloudflare Pages root and the GitHub Pages subpath mirror.
- **When the real club domain is connected:** retest installability, service-worker scope, offline fallback and app icons on that domain. Also update canonical/sitemap/OG URLs as part of launch/custom-domain work.

## Environment gotchas (important)

1. **npm registry:** the global npm config points at an internal Microsoft proxy that fails auth on this machine. Always install with `--registry https://registry.npmjs.org/`.
2. **git push permissions:** the repo belongs to GitHub account `zarbjustin`, but the machine's active `gh` account may be `jzarb_microsoft` (no write access → 403). To push:
   `gh auth switch --user zarbjustin` → `git push origin main` → `gh auth switch --user jzarb_microsoft`.
3. **Vite `base: "./"`:** assets are relative so Pages works under the repo subpath and the PWA manifest can stay domain-neutral. But `npm run preview` serves at `http://127.0.0.1:4173/` (root), NOT `/blackheath-sports-club-redesign/`.
4. **Visual/QA uses Playwright via system Edge locally** (`PLAYWRIGHT_CHANNEL=msedge`) and installed Chromium in CI. Playwright, axe and Vitest are locked dev dependencies. Full-page screenshots need a scroll pass first, or the `whileInView` reveals stay at opacity 0.
5. **Framer Motion:** uses `LazyMotion` + `m` (not `motion`) to keep the bundle small. Keep using `m.*`.

## Security posture (done)

- CSP remains in `index.html` as a hosting fallback and is enforced as a Cloudflare response header through `public/_headers`; `frame-ancestors 'none'`, Permissions Policy, `nosniff` and clickjacking protection are included.
- Google Maps iframe is **click-to-load** and sandboxed (no third-party cookies until consent).
- All `target="_blank"` links use `rel="noopener noreferrer"`. No `dangerouslySetInnerHTML`, no user-input XSS surface.
- GitHub Actions are pinned to commit SHAs and use job-scoped least privilege. Dependabot updates/security alerts and protected `main` are Sprint 16 repository controls.

## SEO & accessibility (done)

- Expanded local SEO: Cloudflare canonical/sitemap/robots, geo meta tags, area-served copy, and JSON-LD `@graph` linking the club, Rectory Field, website and breadcrumb entities. NAP checked against the current club website/public listings on 2026-07-08.
- Accessibility: skip-to-content link, mobile-menu focus trap, Escape-to-close, improved menu labelling, clearer assistance-dog wording, reduced-motion respected, images have intrinsic `width`/`height` (no CLS). Previous axe-core WCAG 2.1 A/AA pass had **0 violations**; rerun axe after major UI changes.
- PWA: installable manifest, generated app icons, Apple touch icon, auto-updating service worker and offline fallback with visit/contact details.
- Sprint 18 simulated-mobile median (3 runs): performance 93, accessibility 100, best practices 100, SEO 100; FCP ~2.04 s, LCP ~2.94 s, TBT ~8 ms, CLS 0. Main JS ~111 KB gzip including CAPTCHA.

## Enquiry form (Web3Forms)

The form is live and the public Web3Forms access key is intentionally client-side. hCaptcha uses
Web3Forms' shared free-plan site key and loads only when the form approaches the viewport. The form
owner must select **hCaptcha** as the form's spam-blocking option in Web3Forms; the client already
requires and sends `h-captcha-response`. Domain restriction can be added on a paid plan.

## Open items (need club input)

- **Content sign-off:** confirmed membership prices, confirmed booking/fixture links, real photography/video (the club's promo video `Lxx-1.mp4` — set `media.video.source` in `src/data.js` to enable the Media section).
- **Enquiry form:** enable hCaptcha enforcement in Web3Forms; submissions already go to `bhsportsclub@outlook.com`.
- **Custom domain:** needed for the final canonical, club HSTS/WAF policy and redirects, but not for the response headers already delivered.
- Safeguarding/welfare/policy content and named contacts.

## Where the next work is planned

See **`docs/backlog.md`** — a ranked roadmap produced from a multi-model analysis (GPT-5.5 + Gemini 3.1 Pro + Claude Opus), scored by user-impact, security and effort, with quick wins vs big bets and blockers flagged.

## Resume checklist

- Read `docs/ai-handover.md` (this), `docs/site-spec.md`, `docs/backlog.md`.
- `npm install --registry https://registry.npmjs.org/`, then `npm test && npm run build`.
- Run the Edge-backed Playwright and Lighthouse commands above before release.
- To push: switch `gh` to `zarbjustin`, push, switch back.
- Content edits go in `src/data.js`; image changes: replace the WebP in `src/assets/club/` using `node -e "require('sharp')(...).webp({quality:85}).resize({width:1200}).toFile(...)"` (sharp is already a devDep), then `npm run build` to verify, then commit.
