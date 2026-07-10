# Blackheath Sports Club redesign concept

Modern website concept for Blackheath Sports Club at Rectory Field.

Live deployments:

- Cloudflare Pages: https://blackheath-sports-club-redesign.pages.dev/
- GitHub Pages mirror: https://zarbjustin.github.io/blackheath-sports-club-redesign/

## What this repo contains

- A Vite and React static website.
- A generated concept hero image at `src/assets/rectory-field-concept.png`.
- A GitHub Pages workflow in `.github/workflows/deploy.yml`.
- Cloudflare Pages deployment connected to `main`.
- A review-led information architecture for the club's next public website.
- A working website specification and sprint roadmap in `docs/site-spec.md`.
- AI handover notes in `docs/ai-handover.md`.
- A sprint execution plan in `docs/sprint-plan.md`.
- PWA/offline support with installable app metadata, generated icons and an offline visit/contact page.
- Privacy-friendly analytics scaffolding and conversion hooks ready for the Cloudflare Web Analytics/dashboard setup.
- Cloudflare response security headers, hCaptcha form protection and immutable asset caching.
- Vitest, Playwright/axe and a locked three-run Lighthouse quality gate.

## Review summary

The current public presence appears dated and fragmented. The redesign prioritises:

- Faster orientation: Rugby, Cricket, Tennis and Squash are visible immediately.
- Stronger venue-hire visibility for the clubhouse and event spaces.
- A clearer membership journey for juniors, adults, social members, coaching and casual play.
- A more confident first impression that reflects the club's history at Rectory Field.
- Space for future club photography, videos, fixture feeds, booking links and sponsor content.

## Source notes

Research was based on the current club website and public search results for:

- Blackheath Sports Club: https://www.blackheathsportsclub.co.uk/
- Rectory Field location and club context: https://www.blackheathsportsclub.co.uk/
- Blackheath Lawn Tennis Club: https://www.blackheathlawntennisclub.org.uk/
- Blackheath Squash Club: https://www.blackheathsquashclub.co.uk/
- Blackheath Cricket Club public listings and Rectory Field references.

The current site is fact-grounded against public club sources, but it remains a concept until the club signs off operational details, media rights and the production domain.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm test
PLAYWRIGHT_CHANNEL=msedge npm run test:e2e
CHROME_PATH="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" npm run lighthouse
```

CI installs Chromium automatically; the environment variables above select the system Edge browser
for local browser and Lighthouse checks.

Useful maintenance scripts:

```bash
npm run optimize:hero
npm run optimize:og
npm run optimize:pwa-icons
```

## Content still needed from the club

- Final club sign-off on contact/address/telephone details.
- Current membership categories and prices.
- Confirmed booking links for courts, clubhouse hire and sports sections.
- Real photography and video of Rectory Field, clubhouse interiors, match days and juniors.
- Sponsor list, safeguarding information, accessibility guidance and privacy/legal pages.
- Production domain connection; when that happens, update canonical/sitemap/OG URLs and retest PWA service-worker scope/installability.

## Product specification

The current improvement plan, sprint structure and acceptance criteria live in [`docs/site-spec.md`](docs/site-spec.md).

For another AI/LLM or developer taking over the work, start with [`docs/ai-handover.md`](docs/ai-handover.md) (current state, architecture, build/deploy gotchas), then [`docs/backlog.md`](docs/backlog.md) for the ranked next-work roadmap.
