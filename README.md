# Blackheath Sports Club redesign concept

Modern website concept for Blackheath Sports Club at Rectory Field.

## What this repo contains

- A Vite and React static website.
- A generated concept hero image at `src/assets/rectory-field-concept.png`.
- A GitHub Pages workflow in `.github/workflows/deploy.yml`.
- A review-led information architecture for the club's next public website.
- A working website specification and sprint roadmap in `docs/site-spec.md`.
- AI handover notes in `docs/ai-handover.md`.
- A sprint execution plan in `docs/sprint-plan.md`.

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
- Blackheath Lawn Tennis Club: https://blackheathlawntennisclub.com/
- Blackheath Squash Club: https://www.blackheathsquashclub.com/
- Blackheath Cricket Club public listings and Rectory Field references.

Some live pages were protected by a browser verification layer during automated review, so the design deliberately avoids hard-coding unverified operational claims beyond high-confidence club structure and location context.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Content still needed from the club

- Confirmed contact addresses and telephone numbers.
- Current membership categories and prices.
- Confirmed booking links for courts, clubhouse hire and sports sections.
- Real photography and video of Rectory Field, clubhouse interiors, match days and juniors.
- Sponsor list, safeguarding information, accessibility guidance and privacy/legal pages.

## Product specification

The current improvement plan, sprint structure and acceptance criteria live in [`docs/site-spec.md`](docs/site-spec.md).

For another AI/LLM or developer taking over the work, start with [`docs/ai-handover.md`](docs/ai-handover.md) (current state, architecture, build/deploy gotchas), then [`docs/backlog.md`](docs/backlog.md) for the ranked next-work roadmap.
