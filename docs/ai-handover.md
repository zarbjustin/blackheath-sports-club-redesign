# AI handover — Blackheath Sports Club website

This document lets any developer or AI pick the project up cold from another machine.
Read this first, then `docs/design-review-2026-07-30.md` (full review + BL-A…BL-O backlog and sprint plan — the current source of truth for remaining work), then `docs/site-spec.md` (product spec) and `docs/backlog.md` (earlier ranked roadmap).

## Latest release — 2026-07-30: official identity + hero crest refinement

The official identity work shipped to `main` through PR [#20](https://github.com/zarbjustin/blackheath-sports-club-redesign/pull/20) at production commit `c3ed531`. GitHub CI passed and Cloudflare Pages production deployment `e3c4604a-3c9c-40cf-a306-ee1b9c9dec7a` completed successfully.

- **`docs/design-review-2026-07-30.md`** — full 18-section multi-model review (Claude Opus 4.8 + GPT-5.6 Sol): scorecard, section-by-section findings, three visual directions (recommended **"Heritage Turf"**), design-system spec, homepage wireframe, WCAG audit, and a prioritised backlog **BL-A…BL-N** + 5-sprint plan. **Use this as the roadmap.**
- **BL-A (P0) done** — CI audit scoped to `npm audit --omit=dev --audit-level=high`, so PR #20's required check is no longer blocked by dev-only advisories.
- **BL-C / BL-D / BL-G / BL-L done** — membership benefits list + CTA; `--space-*`/`--fs-*` scale tokens (section padding tokenised); active-nav scroll-spy (`aria-current`); accessible gallery lightbox.
- **Logo / brand overhaul:**
  - Official crest is now a **fully-vector `src/assets/brand/bsc-crest.svg`** (18.8 KB gz vs 66 KB WebP), extracted from the outlined `.ai`/PDF master with the Node/`zlib`-only script `scripts/ai2svg.cjs` (offline — no Illustrator/Inkscape/Ghostscript needed). Verified pixel-faithful; used in header/hero/footer.
  - New **`public/favicon.svg`** (three brand rings + simplified heather glyph) legible at 16px; linked before the PNG fallback.
  - Dropped the redundant white disc/border on hero+footer crests (the SVG carries its own white field + coloured ring edge); circular drop-shadows; softened header hover (scale, no rotate); one shared `.brand-mark/.hero-crest/.footer-crest` base.
  - Refined the desktop hero lockup so the crest scales from 112px to 150px and carries appropriate first-viewport authority; the mobile crest remains 76px. Verified at 1440×900 and 390×844 with no horizontal overflow.
  - New **heather watermark** in the Heritage section, isolated from the master via `scripts/heather.cjs` → `src/assets/brand/bsc-heather.svg`.
  - Regenerate either brand SVG anytime with `node scripts/ai2svg.cjs` / `node scripts/heather.cjs` (offline, Node-only + `sharp` for verification).

### What to do next (hand-off for another LLM)

1. **Release follow-through:** confirm Cloudflare Web Analytics is collecting production traffic and capture a post-release Lighthouse/axe baseline.
2. **Blocked on npm — run on a machine WITHOUT the org Defender "NPM URL Block":**
   - **BL-E** post-build prerender — inject the rendered `#root` HTML into `dist/index.html` (jsdom) so the SPA ships meaningful static HTML for SEO/no-JS. `npm i -D jsdom@^25`.
   - **BL-N** tests — Vitest + RTL: data integrity (club order, live Web3Forms key), membership benefits, lightbox a11y, nav active logic. `npm i -D vitest@^3 jsdom@^25 @testing-library/react@^16 @testing-library/user-event@^14 @testing-library/jest-dom@^6`.
3. **Product depth (no npm):** BL-B consolidate the Contact/Enquiry paths; BL-F fixtures/"what's on" (needs the four clubs' fixture feed URLs + a nightly Action); BL-H venue space cards (needs capacities + photos); BL-I testimonials (needs real quotes); BL-J split `src/main.jsx` into `src/sections/*`; apply the homepage order/copy in review §10.
4. **BL-O (new) — brand raster consistency (no npm; `sharp` is already a devDep):** regenerate `public/icons/*` (favicon-64, apple-touch, PWA 192/512 + a maskable icon) and `public/og-image.jpg` from the **new SVG crest** so every rasterised mark matches. `scripts/generate-pwa-icons.mjs` / `scripts/make-og-image.mjs` take a source raster — first render `bsc-crest.svg` to a high-res PNG with `sharp`, then point the scripts at it.
5. **Infra:** BL-K enable Cloudflare Web Analytics (dashboard); BL-M custom domain + real response headers (HSTS / `frame-ancestors` / `Permissions-Policy` / SRI) once DNS is decided.

**New sprints for another LLM (supersedes review §16 where items are now done):**

- **Sprint A — Ship it:** PR #20 merged and production verified; remaining work is BL-K analytics confirmation and baseline Lighthouse/axe screenshots. *(partly complete)*
- **Sprint B — Robustness:** BL-E prerender + BL-N test suite. *(needs npm)*
- **Sprint C — Product depth:** BL-F fixtures, BL-H venue cards, BL-I testimonials, BL-B contact consolidation. *(no npm; needs club data)*
- **Sprint D — Brand & maintainability:** BL-O regenerate raster icons from the SVG, BL-J split `main.jsx`, homepage §10 order/copy. *(no npm)*
- **Sprint E — Launch hardening:** BL-M custom domain + edge security headers, cross-browser + reduced-motion re-check. *(needs DNS)*


## Snapshot

- **Repository:** `zarbjustin/blackheath-sports-club-redesign`
- **Live site:** https://blackheath-sports-club-redesign.pages.dev/
- **GitHub Pages mirror:** https://zarbjustin.github.io/blackheath-sports-club-redesign/
- **Production branch:** `main` (deploys automatically via Cloudflare Pages and GitHub Pages)
- **Current work:** The official identity release is on `main`; subsequent changes must continue through pull requests because direct pushes are blocked by branch protection.
- **Stack:** Vite 8 + React 19 (single-page, plain CSS), Framer Motion (via LazyMotion), lucide-react 1.23 icons, self-hosted variable fonts (Inter + Fraunces), `sharp` for build-time image optimisation.
- **Hosting:** Cloudflare Pages primary, GitHub Pages mirror (static; no backend, no database, no auth).
- **Status:** The official-logo redesign and approved club copy are live in Cloudflare production. The desktop hero crest refinement is build-verified and responsive-QA verified.
- **Official identity baseline:** `c3ed531` (`Apply the official Blackheath Sports Club identity (#20)`) on 2026-07-30; use `git log -1` for the current production tip.

## Conversation memory — 2026-07-30

These are explicit stakeholder decisions from the latest working session:

- Use the supplied official outlined Blackheath Sports Club crest throughout the design. Preserve every supplied master/original file as a project asset.
- On desktop, the hero crest should be a confident first-viewport signal (112–150px responsive range), while the compact header and mobile treatments remain restrained.
- The four constituent clubs must always be presented in the company's registered-name order: **Cricket, Rugby Football, Lawn Tennis, Squash**.
- Always call the sport **Lawn Tennis**, never just “Tennis”, in visitor-facing copy.
- The approved positioning copy describes the Rectory Field as the shared home of Cricket, Rugby Football and Lawn Tennis since the late nineteenth century, and Squash since the 1930s; around 1,100 adult and 700 junior playing members; year-round coaching, training and match play; social membership; pavilion bars and terrace; and private hire for birthdays, weddings, funeral wakes and other special events.
- The corporate footer must identify **Blackheath Cricket, Football and Lawn Tennis Company Limited**, company number **00021418**, at **The Rectory Field, Charlton Road, London SE3 8SR**.
- The local working copy requested by the stakeholder is `C:\Users\jzarb\blackheath-sports-club-redesign`.
- Do not make additional npm registry/audit/install requests without first discussing them with the stakeholder. Microsoft Defender displayed organisational “NPM URL Block” alerts during registry access in this session.

## Delivered Sprint Snapshot

- Core redesign/spec/handover: delivered.
- Cloudflare Pages deployment: delivered.
- Privacy-friendly analytics scaffold and conversion hooks: delivered; Cloudflare Web Analytics provider enablement is managed in the Cloudflare dashboard/build env.
- Deeper accessibility: delivered; rerun screen-reader/axe passes after major UI changes.
- Local SEO expansion: delivered against the current Pages URL; update canonical/sitemap/OG URLs when the real domain is connected.
- PWA/offline: delivered; retest installability, service-worker scope and offline fallback when the real club domain replaces the temporary Pages URL.
- **Dependency maintenance (2026-07-08):** all Dependabot PRs resolved; repo has 0 open PRs and 0 stale branches.
  - GitHub Actions pinned: `actions/checkout` 4→7, `actions/setup-node` 4→6, `actions/deploy-pages` 4→5, `actions/upload-pages-artifact` 3→5.
  - npm major upgrades: `vite` 7→8.1.3, `@vitejs/plugin-react` 5→6.0.3 (coupled), `lucide-react` 0.468→1.23.0.
  - **Breaking change handled:** lucide-react v1 dropped all social/brand icons. `Twitter` and `Facebook` lucide imports replaced with inline SVG components (`XTwitterIcon`, `FacebookIcon` in `src/main.jsx`) using official brand SVG paths. Site appearance is unchanged.
- **CI fix (2026-07-08):** `lycheeverse/lychee-action` SHA in `.github/workflows/ci.yml` was invalid (fabricated). Corrected to real v2.8.0 SHA `8646ba30...` (commit `101ede3`).
- **Image updates (2026-07-08):**
  - `src/assets/club/sitemap.webp` — replaced with new professionally branded grounds map using club red/dark-navy colour scheme, 1149×1369px, 193 KB WebP (commits `682db08`, `7741c31`).
  - `src/assets/club/gallery-juniors.webp` — replaced with new junior players action photo, 1200×904px, 277 KB WebP (commit `a40e6eb`).
  - `src/assets/club/gallery-rugby-cinderford.webp` — replaced with Age Grade Rugby action photo, 1200×800px, 109 KB WebP; caption updated from "Rugby v Cinderford" to "Age Grade Rugby" in `src/data.js` (commit `a8ce938`).
- **Enquiry form live (2026-07-08):** Web3Forms access key set for `bhsportsclub@outlook.com` — form now POSTs submissions directly. Honeypot anti-spam in place (commit `ba04212`).
- **Nav improvements (2026-07-08):** Reordered to Sports → Membership → Venue hire → Heritage → Visit. Media nav item + section hidden until `media.video.source` is set in `data.js` (auto-reveals when video is supplied). Removed `justify-content: space-between` dead zone; nav sits flush right via `margin-left: auto` (commit `81995dd`).
- **Official identity and copy (2026-07-30):**
  - Preserved the supplied `.ai`, `.eps`, `.jpg` and `.png` masters in `src/assets/brand/source/`.
  - Added `src/assets/brand/bsc-logo-outlined-512.webp` as the optimised live crest and incorporated it into the header, hero and corporate footer.
  - Regenerated the favicon, Apple/PWA icons and social sharing image from the official crest.
  - Reworked the visual system around the crest colours: red `#e30613`, lime `#b8cf00`, green `#1f5736`, black and white. Refined Fraunces headings, Inter body copy, section rules, cards and calls to action.
  - Centralised the approved stakeholder wording in `coreMessaging`.
  - Standardised the four clubs and external links in this exact order: Cricket, Rugby Football, Lawn Tennis, Squash.
  - Replaced visitor-facing “Tennis” labels with “Lawn Tennis”.
  - Added the exact legal company name, number and postal address to the corporate footer.

## What is built (as-built)

Single-page site (`src/main.jsx`) with these sections, all content-driven from `src/data.js`:

- **Hero** — responsive WebP image with blur-up + subtle parallax; staggered load animation.
- **Welcome** — real club intro copy, fact chips, no-dogs notice.
- **Sports** — Cricket/Rugby Football/Lawn Tennis/Squash cards, in that order, with real club photos and custom SVG sport icons (`src/icons.jsx`); each links out to that club's official site (correct URLs).
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
- **Footer** — official crest, corporate company details and address, copyright, Privacy link and socials.

Standalone pages in `public/`: `privacy.html`, `offline.html`, `robots.txt`, `sitemap.xml`, `og-image.jpg`, PWA icons in `public/icons/`.

## Architecture & file map

- `index.html` — head: CSP + referrer meta, Cloudflare canonical, Open Graph/Twitter, PWA/Apple install metadata, local SEO geo meta, JSON-LD `@graph` (`SportsClub`, `LocalBusiness`, `SportsActivityLocation`, `WebSite`, `BreadcrumbList`), inline SVG favicon.
- `src/main.jsx` — the whole app: section components + `Hero`, `MapEmbed` (click-to-load), `Enquiry` (form), `Media`, `App` (header/nav/footer). Motion via `LazyMotion features={domAnimation}` + `m.*` components; `Reveal` wrapper does scroll-in animations. Header includes skip link, mobile focus trap and Escape-to-close. Also defines `XTwitterIcon` and `FacebookIcon` — inline SVG social brand icons (lucide-react v1 dropped brand icons, so these are baked directly into the file).
- `src/data.js` — **all site content** (club facts, local SEO facts, contact, sports + URLs, facilities, gym/nursery, venue facilities, heritage timeline, gallery, media/video config, grounds map, the `enquiry` config and analytics config). Edit content HERE, not in JSX.
- `src/analytics.js` — opt-in privacy-friendly analytics loader and conversion-event helper. Cloudflare Web Analytics is off until `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` is configured or Cloudflare Pages Web Analytics is enabled in the dashboard.
- `src/icons.jsx` — custom SVG sport icons (lucide-styled).
- `src/styles.css` — design tokens (colours, radii, fonts, easing) + all component styles + responsive + `prefers-reduced-motion`.
- `src/assets/` — hero WebP set + `hero-blur.js`; `src/assets/club/` — optimised club photos (WebP); `src/assets/brand/` — the optimised live crest plus preserved source masters in `src/assets/brand/source/`.
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

Branch protection requires changes to reach `main` through a pull request with the required `Build, audit, Lighthouse & links` check passing. Do not attempt to bypass this with a direct push.

## Release and CI handover

- PR [#20 — Apply the official Blackheath Sports Club identity](https://github.com/zarbjustin/blackheath-sports-club-redesign/pull/20) merged successfully into `main`.
- Required GitHub Actions check `Build, audit, Lighthouse & links` passed before merge.
- CI audits deployed dependencies with `npm audit --omit=dev --audit-level=high`; Dependabot continues tracking development dependencies.
- Cloudflare production deployment `e3c4604a-3c9c-40cf-a306-ee1b9c9dec7a` succeeded for commit `c3ed531`.
- The Pages URL and both configured `new.blackheathsportsclub` aliases were verified with HTTP 200 and the correct Cricket, Rugby Football, Lawn Tennis and Squash title.

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

1. **npm registry and Defender:** the global npm config points at an internal Microsoft proxy that may fail auth. Public npm registry requests made during this session also triggered organisational Microsoft Defender “NPM URL Block” alerts. Dependencies are already present locally; prefer non-networked build/inspection commands and get stakeholder confirmation before any further npm install, audit or registry request.
2. **git push permissions:** the repo belongs to GitHub account `zarbjustin`, but the machine's active `gh` account may be `jzarb_microsoft` (no write access → 403). For an approved branch push, switch to `zarbjustin`, push the feature branch, then switch back to the prior account. `main` is protected and must be updated through a passing PR.
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

- **Content sign-off:** confirmed membership prices, confirmed booking/fixture links, real photography/video (the club's promo video `Lxx-1.mp4` — set `media.video.source` in `src/data.js` to enable the Media section).
- **Enquiry form** ✅ live — submissions go to `bhsportsclub@outlook.com` via Web3Forms.
- **Custom domain** decision (would enable real security headers and replace the temporary Cloudflare Pages canonical with the club domain).
- Safeguarding/welfare/policy content and named contacts.

## Where the next work is planned

See **`docs/backlog.md`** — a ranked roadmap produced from a multi-model analysis (GPT-5.5 + Gemini 3.1 Pro + Claude Opus), scored by user-impact, security and effort, with quick wins vs big bets and blockers flagged.

## Resume checklist

- Read `docs/ai-handover.md` (this), `docs/site-spec.md`, `docs/backlog.md`.
- Start in `C:\Users\jzarb\blackheath-sports-club-redesign` and inspect `git status`, the current branch and PR #20 checks.
- Do not start with `npm install` or `npm audit`; registry access triggered organisational Defender alerts. Existing dependencies and the production build were already verified for commit `a5ca98a`.
- Ask the stakeholder before applying the proposed CI audit-scope change. If approved, commit it to `codex/official-logo-copy`, push the branch, watch the required check, merge PR #20 only when green, and verify Cloudflare production.
- To push an approved branch: switch `gh` to `zarbjustin`, push the feature branch, then switch back to the prior account.
- Content edits go in `src/data.js`; image changes: replace the WebP in `src/assets/club/` using `node -e "require('sharp')(...).webp({quality:85}).resize({width:1200}).toFile(...)"` (sharp is already a devDep), then `npm run build` to verify, then commit.
