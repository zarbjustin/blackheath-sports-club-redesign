# Backlog — ranked next roadmap

Produced from a multi-model analysis (GPT-5.5 + Gemini 3.1 Pro + Claude Opus) on 2026-07-07.
Where all three models agreed, confidence is high. Scores are **1–5**; **Effort: 5 = low effort**.
Ranking weights **user-impact + security**, with effort as a tie-breaker.

For current state and architecture see `docs/ai-handover.md`. Items already delivered
(animations, real content, WebP media, custom icons, CSP + hardening, JSON-LD/sitemap/OG,
axe-clean a11y, Web3Forms enquiry form, Cloudflare deployment, analytics scaffold and conversion
hooks) are **not** repeated here.

## Ranked roadmap

| # | Sprint | Impact | Security | Effort | Blocked on club? |
|---|--------|:--:|:--:|:--:|:--|
| 1 | Launch gating | 5 | 4 | 4 | Yes (form key, content) |
| 2 | Privacy-friendly analytics | 4 | 5 | 5 | Part-built; enable provider |
| 3 | Custom domain + Cloudflare edge security | 3 | 5 | 4 | Yes (DNS) |
| 4 | UK governance & safeguarding pages | 4 | 5 | 4 | Yes (policy docs) |
| 5 | Deeper accessibility | 4 | 2 | 4 | No |
| 6 | CI quality gates + 404 page | 3 | 4 | 3 | No |
| 7 | Local SEO expansion | 4 | 2 | 4 | Google Business access |
| 8 | Volunteer CMS (Decap) | 4 | 3 | 2 | Who maintains it |
| 9 | Fixtures / events / news | 5 | 2 | 3 | Yes (feed URLs) |
| 10 | Media pipeline + engagement | 4 | 3 | 3 | Assets/consent |
| 11 | PWA / offline | 3 | 2 | 3 | No |

### 1. Launch gating
Turn the concept into a public candidate. Tasks: paste the Web3Forms access key; confirm prices,
booking/fixture links and public contacts; drop "concept redesign" wording; decide the domain and
update canonical/sitemap/robots/OG URLs; write a volunteer go-live checklist.

### 2. Privacy-friendly analytics
Part-built. The code now includes an opt-in Cloudflare Web Analytics loader, CSP/privacy updates,
conversion-event hooks, and `docs/monthly-analytics-report.md`. Remaining step: enable Cloudflare
Web Analytics in the Pages dashboard or set `VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN` in the build
environment. For custom conversion-event collection, enable Zaraz, Plausible, GoatCounter or another
event-capable privacy-friendly provider.

### 3. Custom domain + Cloudflare edge security
The one real security gap left: a `<meta>` CSP can't set HSTS, `frame-ancestors`,
`X-Content-Type-Options`, or `Permissions-Policy`. Put the club domain (e.g.
`blackheathsportsclub.co.uk`) behind Cloudflare's free tier → migrate CSP to a real response header,
enable HSTS + WAF, add Subresource Integrity in the Vite build. Also improves SEO, caching and trust.

### 4. UK governance & safeguarding
For a club with juniors and families: Safeguarding, Welfare (named contacts), Policies and an
Accessibility statement; footer governance links; list third-party processors (Web3Forms, Google
Maps, GitHub Pages) in the privacy notice.

### 5. Deeper accessibility (beyond automated axe)
Skip-to-content link; mobile-menu focus trap + Esc to close; keyboard and screen-reader walkthrough;
clearer assistance-dog wording alongside the no-dogs rule; verify reduced-motion with any future video.

### 6. CI quality gates + 404
Broken-link checker (e.g. lychee) for the external sport links; Lighthouse-CI budgets on PRs;
axe-in-CI; a Playwright smoke test of the enquiry flow; `npm audit`; a branded `public/404.html`.

### 7. Local SEO expansion
Align NAP (name/address/phone) exactly with the club's Google Business Profile; extend JSON-LD with
`SportsActivityLocation`/`Event`; optionally a static reviews/trust widget. Directly supports
venue-hire revenue.

### 8. Volunteer CMS (big bet)
Let non-technical committee members edit content. Decap CMS (Git-based) in `public/admin`, a
Cloudflare Worker as GitHub OAuth proxy, `src/data.js` split into collections, and a one-page SOP.
Requires deciding who maintains the site.

### 9. Fixtures / events / news (big bet)
Repeat-visit driver. A build-time Node script fetches each club's iCal/RSS → static
`public/fixtures.json`; an "Upcoming at Rectory Field" component; a scheduled GitHub Action redeploys
nightly; empty/stale states. Needs stable feed URLs from each sport section.

### 10. Media pipeline + engagement
Build-time WebP/AVIF auto-optimisation (e.g. `vite-plugin-image-optimizer`) so volunteer uploads
can't bloat the site; gallery lightbox; optional reduced-motion hero video (the club has a promo clip).

### 11. PWA / offline
`vite-plugin-pwa` manifest + service worker; cache the shell plus visit/contact and the grounds map
for match-day low-signal use; offline fallback page. Test service-worker scope on Pages carefully.

## The two lenses

- **Highest user-impact/experience:** #9 fixtures, #1 launch, #8 CMS, #2 analytics.
- **Highest security:** #3 domain + edge headers, #4 governance/compliance, #2 cookieless analytics, #6 CI.

## Quick wins vs big bets

- **Quick wins (no rebuild, mostly no club input):** #2 analytics, #5 a11y fixes, #6 CI + 404, #7 local SEO/NAP.
- **Big bets:** #8 CMS, #9 fixtures, #3 domain/edge.
- **Debated:** GPT-5.5 favoured splitting the SPA into multi-page IA; Gemini and Opus recommend keeping
  the SPA and adding a CMS + fixtures instead (more value per effort). Only go multi-page if the club
  wants owned per-sport pages for SEO.

## Doable immediately without any club input

Skip-link + mobile-menu focus management (#5), a branded 404 page and a link-checker/Lighthouse-CI/axe
GitHub Actions workflow (#6), and a cookieless analytics scaffold behind a config flag (#2).
