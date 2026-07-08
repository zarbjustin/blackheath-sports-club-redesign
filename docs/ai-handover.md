# AI handover — Blackheath Sports Club website

This document lets any developer or AI pick the project up cold from another machine.
Read this first, then `docs/site-spec.md` (product spec) and `docs/backlog.md` (ranked next work).

## Snapshot

- **Repository:** `zarbjustin/blackheath-sports-club-redesign`
- **Live site:** https://blackheath-sports-club-redesign.pages.dev/
- **GitHub Pages mirror:** https://zarbjustin.github.io/blackheath-sports-club-redesign/
- **Branch:** `main` (deploys automatically via Cloudflare Pages and GitHub Pages)
- **Stack:** Vite + React 19 (single-page, plain CSS), Framer Motion (via LazyMotion), lucide-react icons, self-hosted variable fonts (Inter + Fraunces), `sharp` for build-time image optimisation.
- **Hosting:** Cloudflare Pages primary, GitHub Pages mirror (static; no backend, no database, no auth).
- **Status:** Feature-rich concept, grounded in the real club's facts. Not yet the club's official production site (needs club sign-off on prices/media/booking links + the enquiry form access key).

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
- **Visit** — address, Sat-Nav postcode, nearby areas served, click-to-load Google Map (GDPR-friendly).
- **Grounds** — the club's site map image + a modern facilities legend.
- **Contact** — email, phone, bar hours, social links.
- **Footer** — brand, copyright, Privacy link, socials.

Standalone pages in `public/`: `privacy.html`, `offline.html`, `robots.txt`, `sitemap.xml`, `og-image.jpg`, PWA icons in `public/icons/`.

## Architecture & file map

- `index.html` — head: CSP + referrer meta, Cloudflare canonical, Open Graph/Twitter, PWA/Apple install metadata, local SEO geo meta, JSON-LD `@graph` (`SportsClub`, `LocalBusiness`, `SportsActivityLocation`, `WebSite`, `BreadcrumbList`), inline SVG favicon.
- `src/main.jsx` — the whole app: section components + `Hero`, `MapEmbed` (click-to-load), `Enquiry` (form), `App` (header/nav/footer). Motion via `LazyMotion features={domAnimation}` + `m.*` components; `Reveal` wrapper does scroll-in animations. Header includes skip link, mobile focus trap and Escape-to-close.
- `src/data.js` — **all site content** (club facts, local SEO facts, contact, sports + URLs, facilities, gym/nursery, venue facilities, heritage timeline, gallery, grounds map, the `enquiry` config and analytics config). Edit content HERE, not in JSX.
- `src/analytics.js` — opt-in privacy-friendly analytics loader and conversion-event helper. Cloudflare Web Analytics is off until `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is configured or Cloudflare Pages Web Analytics is enabled in the dashboard.
- `src/icons.jsx` — custom SVG sport icons (lucide-styled).
- `src/styles.css` — design tokens (colours, radii, fonts, easing) + all component styles + responsive + `prefers-reduced-motion`.
- `src/assets/` — hero WebP set + `hero-blur.js`; `src/assets/club/` — optimised club photos (WebP).
- `public/` — copied to site root (robots, sitemap, privacy, offline fallback, og-image, PWA icons).
- `scripts/` — build-time helpers: `optimize-hero.mjs`, `import-club-media.mjs`, `make-og-image.mjs`, `generate-pwa-icons.mjs`.
- `vite.config.js` — Vite + React + `vite-plugin-pwa`; manifest uses relative `start_url` and `scope` so it works on the current Pages URL and GitHub Pages mirror.
- `.github/workflows/deploy.yml` — Pages build/deploy (actions pinned to SHAs). `.github/dependabot.yml` — weekly npm + actions updates.
- `docs/` — `ai-handover.md` (this), `site-spec.md` (product spec), `sprint-plan.md`, `backlog.md` (ranked next work).

## Build, run, deploy

```bash
npm install --registry https://registry.npmjs.org/   # see gotcha #1
npm run dev        # local dev server
npm run build      # production build to dist/
npm run preview    # serve the built dist/ (base path is "/", NOT the repo subpath)
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
4. **Visual/QA is done with Playwright via system Edge** (`chromium.launch({ channel: "msedge" })`) to avoid a Chromium download. Playwright + `@axe-core/playwright` are installed only temporarily for QA and uninstalled afterwards — they are NOT project dependencies. Full-page screenshots need a scroll pass first, or the `whileInView` reveals stay at opacity 0.
5. **Framer Motion:** uses `LazyMotion` + `m` (not `motion`) to keep the bundle small. Keep using `m.*`.

## Security posture (done)

- CSP + `referrer` meta in `index.html` (script-src 'self'; style-src allows inline for React/Framer; frame-src limited to Google Maps; connect-src/form-action allow `api.web3forms.com`).
- Google Maps iframe is **click-to-load** and sandboxed (no third-party cookies until consent).
- All `target="_blank"` links use `rel="noopener noreferrer"`. No `dangerouslySetInnerHTML`, no user-input XSS surface.
- GitHub Actions pinned to commit SHAs; Dependabot enabled (npm + actions).
- Known gap: a `<meta>` CSP can't set HSTS / `frame-ancestors` / `X-Content-Type-Options` / `Permissions-Policy`. Those need a custom domain behind a CDN (Cloudflare) — see backlog.

## SEO & accessibility (done)

- Expanded local SEO: Cloudflare canonical/sitemap/robots, geo meta tags, area-served copy, and JSON-LD `@graph` linking the club, Rectory Field, website and breadcrumb entities. NAP checked against the current club website/public listings on 2026-07-08.
- Accessibility: skip-to-content link, mobile-menu focus trap, Escape-to-close, improved menu labelling, clearer assistance-dog wording, reduced-motion respected, images have intrinsic `width`/`height` (no CLS). Previous axe-core WCAG 2.1 A/AA pass had **0 violations**; rerun axe after major UI changes.
- PWA: installable manifest, generated app icons, Apple touch icon, auto-updating service worker and offline fallback with visit/contact details.
- Measured on the built site: FCP ~388 ms, ~10 requests, ~409 KB initial transfer; JS ~101 KB gzip.

## Enquiry form (Web3Forms) — how to go live

The venue-hire form is fully built but ships with a placeholder key, so it currently falls back to opening the visitor's email client (with a visible notice). To switch on real online submissions:

1. Create a free access key at https://web3forms.com (enter the club's destination email; the key is safe to commit — it only allows sending to that address).
2. In `src/data.js`, set `enquiry.accessKey` to the key (replace `YOUR_WEB3FORMS_ACCESS_KEY`).
3. Rebuild/redeploy. The "not switched on yet" notice disappears automatically; submissions POST to Web3Forms which emails the club. Honeypot anti-spam is already in place; add hCaptcha via Web3Forms if needed.

CSP and the privacy notice are already prepared for this.

## Open items (need club input)

- **Content sign-off:** confirmed membership prices, confirmed booking/fixture links, real photography/video (the club's promo video `Lxx-1.mp4` could be added), sponsor list.
- **Enquiry form access key** (above).
- **Custom domain** decision (would enable real security headers and replace the temporary Cloudflare Pages canonical with the club domain).
- Safeguarding/welfare/policy content and named contacts.

## Where the next work is planned

See **`docs/backlog.md`** — a ranked roadmap produced from a multi-model analysis (GPT-5.5 + Gemini 3.1 Pro + Claude Opus), scored by user-impact, security and effort, with quick wins vs big bets and blockers flagged.

## Resume checklist

- Read `docs/ai-handover.md` (this), `docs/site-spec.md`, `docs/backlog.md`.
- `npm install --registry https://registry.npmjs.org/`, then `npm run build`.
- To push: switch `gh` to `zarbjustin`, push, switch back.
- Content edits go in `src/data.js`; image changes go through the `scripts/*` pipelines.
