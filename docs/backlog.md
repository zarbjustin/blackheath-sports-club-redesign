# Backlog — ranked next roadmap

Produced from a multi-model analysis (GPT-5.5 + Gemini 3.1 Pro + Claude Opus) on 2026-07-07.
Where all three models agreed, confidence is high. Scores are **1–5**; **Effort: 5 = low effort**.
Ranking weights **user-impact + security**, with effort as a tie-breaker.

For current state and architecture see `docs/ai-handover.md`. Items already delivered
(animations, real content, WebP media, custom icons, CSP + hardening, JSON-LD/sitemap/OG,
axe-clean a11y, Web3Forms enquiry form, Cloudflare deployment, analytics scaffold and conversion
hooks, deeper a11y controls, local SEO expansion, PWA/offline shell) are **not** repeated here.

Sprints 16-18 delivered response security headers, CAPTCHA-ready form protection, least-privilege CI,
performance/PWA refinement and unit/browser/accessibility/Lighthouse regression coverage.

## Ranked roadmap

| # | Sprint | Impact | Security | Effort | Blocked on club? |
|---|--------|:--:|:--:|:--:|:--|
| 1 | Launch gating | 5 | 4 | 4 | Yes (content/domain) |
| 2 | Privacy-friendly analytics | 4 | 5 | 5 | Part-built; enable provider |
| 3 | Custom domain + Cloudflare edge security | 3 | 5 | 4 | Yes (DNS) |
| 4 | UK governance & safeguarding pages (parked) | 1 | 1 | 2 | No public owner yet |
| 5 | Deeper accessibility | 4 | 2 | 4 | Delivered |
| 6 | CI quality gates + 404 page | 3 | 4 | 3 | No |
| 7 | Local SEO expansion | 4 | 2 | 4 | Delivered; GBP access still useful |
| 8 | Volunteer CMS (Decap) | 4 | 3 | 2 | Who maintains it |
| 9 | Fixtures / events / news | 5 | 2 | 3 | Yes (feed URLs) |
| 10 | Media pipeline + engagement | 4 | 3 | 3 | Assets/consent |
| 11 | PWA / offline | 3 | 2 | 3 | Delivered; retest on custom domain |

### 1. Launch gating
Turn the concept into a public candidate. **Enquiry form is now live** (Web3Forms, `bhsportsclub@outlook.com`).
Remaining tasks: confirm prices, booking/fixture links and public contacts; drop "concept redesign"
wording; decide the domain and update canonical/sitemap/robots/OG URLs; write a volunteer go-live checklist.

### 2. Privacy-friendly analytics
Part-built. The code now includes an opt-in Cloudflare Web Analytics loader, CSP/privacy updates,
conversion-event hooks, and `docs/monthly-analytics-report.md`. Remaining step: enable Cloudflare
Web Analytics in the Pages dashboard or set `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the build
environment. For custom conversion-event collection, enable Zaraz, Plausible, GoatCounter or another
event-capable privacy-friendly provider.

### 3. Custom domain + Cloudflare edge security
Part-delivered: `public/_headers` now enforces response CSP, `frame-ancestors`, clickjacking controls,
`nosniff`, Permissions Policy and immutable hashed-asset caching on Pages. Remaining work is the club
domain/DNS decision, canonical migration, HSTS/WAF policy and old-domain redirects.

### 4. UK governance & safeguarding (parked)
Not a public club-wide roadmap item for now. If the club later wants public Safeguarding, Welfare
(named contacts), Policies, or an Accessibility statement, they need explicit owner approval and
final wording first. Keep this parked until the club decides it should be public-facing.

### 5. Deeper accessibility (beyond automated axe)
Delivered: skip-to-content link, mobile-menu focus trap, Esc to close, improved menu labelling,
and clearer assistance-dog wording. Remaining future check: rerun a full screen-reader walkthrough
after any major navigation/content changes, and verify reduced-motion again if video is added.

### 6. CI quality gates + 404 (delivered)
`.github/workflows/ci.yml` runs 10 Vitest tests, build/audit, 12 desktop/mobile Playwright + axe checks,
a locked three-run Lighthouse gate and lychee links. The repository-owned Lighthouse runner avoids
mutable `npx` downloads and vulnerable LHCI transitive packages. `public/404.html` remains the branded fallback.
**CI fix 2026-07-08:** lychee-action SHA corrected to real v2.8.0 (`8646ba30...`).

### 7. Local SEO expansion
Delivered: NAP checked against the current club website/public listings, Cloudflare canonical/sitemap
alignment, geo meta tags, area-served copy, and expanded JSON-LD `@graph` with `SportsClub`,
`LocalBusiness`, `SportsActivityLocation`, `WebSite` and `BreadcrumbList`. Google Business Profile
owner access would still help confirm the exact GBP category, opening-hour presentation and review
strategy.

### 8. Volunteer CMS (big bet)
Let non-technical committee members edit content. Decap CMS (Git-based) in `public/admin`, a
Cloudflare Worker as GitHub OAuth proxy, `src/data.js` split into collections, and a one-page SOP.
Requires deciding who maintains the site.

### 9. Fixtures / events / news (big bet)
Repeat-visit driver. A build-time Node script fetches each club's iCal/RSS → static
`public/fixtures.json`; an "Upcoming at Rectory Field" component; a scheduled GitHub Action redeploys
nightly; empty/stale states. Needs stable feed URLs from each sport section.

### 10. Media pipeline + engagement (partly delivered)
The site now has a media section with a video-ready poster slot and guidance for future promo clips.
Remaining work: build-time WebP/AVIF auto-optimisation (e.g. `vite-plugin-image-optimizer`) so
volunteer uploads can't bloat the site; gallery lightbox; optional reduced-motion hero video (the
club has a promo clip).

### 11. PWA / offline
Delivered: `vite-plugin-pwa` manifest, generated service worker, app icons, Apple touch icon, cached
static shell, network-first page cache and `offline.html` with match-day visit/contact essentials.
Sprint 17 reduced precache from 2.17 MiB to about 410 KiB by runtime-caching photos/fonts; Sprint 18
tests a real uncached offline navigation on desktop and mobile.
When the real club domain is connected, retest manifest `start_url`/`scope`, service-worker
registration, installability and offline fallback on that domain.

## The two lenses

- **Highest user-impact/experience:** #9 fixtures, #1 launch, #8 CMS, #2 analytics.
- **Highest security:** #3 domain + edge headers, #4 governance/compliance, #2 cookieless analytics, #6 CI.

## Quick wins vs big bets

- **Quick wins (no rebuild, mostly no club input):** #6 CI + 404.
- **Big bets:** #8 CMS, #9 fixtures, #3 domain/edge.
- **Debated:** GPT-5.5 favoured splitting the SPA into multi-page IA; Gemini and Opus recommend keeping
  the SPA and adding a CMS + fixtures instead (more value per effort). Only go multi-page if the club
  wants owned per-sport pages for SEO.

## Doable immediately without any club input

A branded 404 page and a link-checker/Lighthouse-CI/axe GitHub Actions workflow (#6).
