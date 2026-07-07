# AI handover: Blackheath Sports Club website

This document is written for another AI/LLM taking over the project. It summarises current state, intent, constraints, implementation details and the recommended next work.

## Project snapshot

- Repository: `zarbjustin/blackheath-sports-club-redesign`
- Live site: https://zarbjustin.github.io/blackheath-sports-club-redesign/
- Current branch: `main`
- App stack: Vite, React, plain CSS, lucide-react icons
- Deploy: GitHub Pages via `.github/workflows/deploy.yml`
- Main implementation files:
  - `src/main.jsx`
  - `src/styles.css`
  - `src/assets/rectory-field-concept.png`
  - `vite.config.js`
- Product/spec docs:
  - `docs/site-spec.md`
  - `docs/sprint-plan.md`

## Current state

The repo contains a first-pass concept website for Blackheath Sports Club at Rectory Field. It is a polished single-page concept, not a finished production replacement for the current live club site.

The current site includes:

- Homepage hero with a generated concept image.
- Navigation for Sports, Membership, Venue hire, Visit and Enquire.
- Sections for review-led priorities, sports cards, membership pathways, activity rhythm, venue hire, visit/location and contact.
- Responsive layout verified locally on desktop and mobile.
- GitHub Pages deployment verified.

## Design intent

The site should feel:

- Historic but not old-fashioned.
- Community-focused rather than corporate.
- Sporty, energetic and practical.
- Premium enough to support clubhouse venue hire.
- Clear enough for parents, players, supporters and volunteers.

The strongest product direction is:

- Put Rectory Field and the clubhouse at the centre of the brand.
- Make Rugby, Cricket, Tennis and Squash visible immediately.
- Treat venue hire as a primary conversion journey.
- Make membership easier to understand.
- Avoid publishing operational details until confirmed by the club.

## Important assumptions

Do not treat these as final facts without confirmation:

- The four main sports are Rugby, Cricket, Tennis and Squash.
- The club operates from Rectory Field, Charlton Road, London SE3 8SR.
- Separate tennis and squash club sites exist and may need to remain linked rather than replaced.
- Some current-site pages were protected by browser verification during automated review, so automated extraction was incomplete.

High confidence source URLs already reviewed:

- https://www.blackheathsportsclub.co.uk/
- https://blackheathlawntennisclub.com/
- https://www.blackheathsquashclub.com/

## Do not hard-code without confirmation

- Membership prices.
- Current officers, captains, coaches or welfare contacts.
- Phone numbers and email addresses beyond what the club confirms.
- Venue capacities.
- Food/bar packages.
- Training times.
- Fixture details.
- Safeguarding/legal/policy text.
- Sponsor obligations.

## Local setup

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Deployment happens automatically from `main` through GitHub Pages.

## Implementation notes

- `vite.config.js` uses `base: "./"` so assets work on GitHub Pages under the repository subpath.
- The hero image is imported from CSS via `url("./assets/rectory-field-concept.png")`.
- The current design is intentionally one-page to prove direction quickly.
- The next build phase should introduce page routing and structured content.
- Keep the visual direction, but replace generated media with real club photography as soon as possible.

## Validation already done

- `npm run build` passed.
- Desktop visual check passed.
- Mobile visual check at 390px wide passed.
- No horizontal overflow was found during mobile check.
- Browser console had no errors during local verification.
- GitHub Pages deployed successfully.

## Recommended next prompt for an AI

Use this prompt when handing the repo to another AI:

```text
You are taking over the Blackheath Sports Club website repo. First read README.md, docs/site-spec.md, docs/sprint-plan.md and docs/ai-handover.md. Then inspect src/main.jsx and src/styles.css.

Your goal is to begin Sprint 1: convert the single-page concept into a scalable multi-page site with structured content, while preserving the current visual direction and GitHub Pages deployment. Do not invent unverified club details. Use placeholders clearly marked as pending confirmation. Keep the site building with npm run build and commit your changes.
```

## Recommended next technical move

Start Sprint 1 by:

1. Creating structured data files for sports, events, pathways and navigation.
2. Extracting reusable components from `src/main.jsx`.
3. Adding routing for Home, Sports, Membership, Venue Hire, Visit and Contact.
4. Keeping all current homepage content working during the refactor.
5. Adding placeholder pages for Rugby, Cricket, Tennis and Squash with clearly marked unconfirmed content.

## Handover checklist

Before making substantial changes, the next AI should:

- Read `docs/site-spec.md`.
- Read `docs/sprint-plan.md`.
- Run `npm install` if dependencies are not present.
- Run `npm run build`.
- Check `git status -sb`.
- Preserve the GitHub Pages subpath-safe asset setup.
- Avoid changing live deployment settings unless asked.

Before handing back to the user, the next AI should:

- Run `npm run build`.
- Commit meaningful changes.
- Push to `main` or open a branch/PR if requested.
- Summarise what changed and what remains unconfirmed.
