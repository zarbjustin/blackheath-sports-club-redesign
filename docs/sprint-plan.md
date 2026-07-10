# Sprint plan

This is the execution backlog for turning the current concept into a production-ready club website. It is intentionally written in a way that another AI/LLM can pick up and work from.

## Sprint 0: Discovery and confirmation

Status: Not started.

Goal: Replace assumptions with verified requirements.

Inputs needed from the club:

- Confirmed sport structure and ownership.
- Contacts for Rugby, Cricket, Tennis, Squash, membership, venue hire and safeguarding.
- Current membership categories, pricing and eligibility.
- Venue hire details, capacities, bar/catering options and restrictions.
- Brand assets, crest/logo files and colour guidance.
- Club-approved photos and video.
- Existing policy/legal documents.
- Sponsor requirements.

Tasks:

- Audit all current website pages.
- Decide what content is kept, rewritten, redirected or retired.
- Confirm sitemap.
- Confirm content owners.
- Build a media shot list.
- Identify third-party systems: booking, fixtures, payments, calendar, forms.

Deliverables:

- Confirmed sitemap.
- Content inventory.
- Media requirements list.
- Updated open-questions list in `docs/site-spec.md`.

Acceptance criteria:

- The next sprint can proceed without inventing critical operational facts.

## Sprint 1: Site foundation and structured content

Status: Recommended next sprint.

Goal: Convert the single-page concept into a scalable site architecture.

Tasks:

- Add client-side routing or migrate to a static-site-friendly structure.
- Extract reusable components:
  - Site header
  - Footer
  - Hero
  - Section heading
  - Sport card
  - CTA button
  - Activity/event row
  - Location panel
- Move content into structured data:
  - `src/data/sports.js`
  - `src/data/navigation.js`
  - `src/data/events.js`
  - `src/data/membership.js`
- Add page shells:
  - Home
  - Sports
  - Rugby
  - Cricket
  - Tennis
  - Squash
  - Membership
  - Venue Hire
  - Visit
  - Contact
- Preserve GitHub Pages deployment.
- Preserve current visual quality and responsive behaviour.

Deliverables:

- Multi-page site structure.
- Reusable components.
- Structured data files.
- Passing production build.

Acceptance criteria:

- `npm run build` passes.
- The homepage still looks at least as good as the current concept.
- Every top-level nav item has a destination.
- No hard-coded unverified operational claims are introduced.

## Sprint 2: Sports and membership journeys

Status: Backlog.

Goal: Make it easy for visitors to understand how to play, join or get involved.

Tasks:

- Build full pages for Rugby, Cricket, Tennis and Squash.
- Add sport-specific hero sections.
- Add junior/adult pathway sections.
- Add sport-specific FAQs.
- Add confirmed booking, fixture or external website links.
- Build a proper Membership page.
- Add membership categories and pricing once confirmed.
- Add "which membership is right for me?" guidance.

Deliverables:

- Four sport pages.
- Membership page.
- Junior pathway content.

Acceptance criteria:

- Each sport page answers "Can I play here?" in the first viewport.
- Every sport has a clear next action.
- Membership options are understandable without emailing for basic information.

## Sprint 3: Venue hire and enquiries

Status: Delivered. Web3Forms submissions are live; hCaptcha dashboard enforcement is the owner follow-up.

Goal: Turn venue hire into a high-quality conversion journey.

Tasks:

- Build Venue Hire page.
- Add venue hire gallery.
- Add spaces, capacities and event types once confirmed.
- Add bar/catering information once confirmed.
- Add enquiry form. — Done: accessible `Enquiry` form (`#enquire`) with name, email, phone, event type, date, guests, message + consent.
- Add form validation. — Done: native HTML5 validation (required fields, email/date/number types).
- Add success and error states. — Done: submitting / success / error / mailto-fallback states with an `aria-live` status region.
- Decide form backend. — Done: Web3Forms (works on static GitHub Pages; access key is safe to commit).
- Build Contact page. — A Contact section already exists on the single page.

### Enquiry form owner follow-up

The access key is configured and submissions are live. The owner must select **hCaptcha** as the
spam-blocking option for this form in the Web3Forms dashboard. The site already lazy-loads the
widget, requires its token client-side, sends `h-captcha-response`, and includes the necessary CSP
and privacy disclosure.

Possible form backend options (for reference):

- Web3Forms (chosen).
- Formspree.
- Basin.
- Serverless function (Azure Functions / Cloudflare Worker).
- Email link fallback when a future environment intentionally removes the key.

Deliverables:

- Venue Hire section.
- Enquiry form with staged/working submission.

Acceptance criteria:

- A visitor can provide event type, date, guest count and contact details. — Met.
- The page reduces basic back-and-forth questions. — Met.
- Spam and privacy implications are considered before launch. — Met (honeypot + consent + privacy notice).

## Sprint 4: Events, news and activity

Status: Backlog.

Goal: Make the site feel alive without creating a volunteer maintenance problem.

Tasks:

- Build Events/News page.
- Add homepage latest activity module.
- Create structured event/news data.
- Add stale-content handling.
- Decide whether to embed third-party fixtures or maintain content manually.
- Write a short content-update guide.

Deliverables:

- Events/News page.
- Homepage latest activity section.
- Content maintenance notes.

Acceptance criteria:

- Current activity can be updated without editing layout code.
- Stale items are easy to remove.
- The homepage does not look abandoned if there are no current posts.

## Sprint 5: Trust, governance and launch readiness

Status: Backlog.

Goal: Prepare the site for public stakeholder review and launch.

Tasks:

- Add Safeguarding page.
- Add Welfare contacts once confirmed.
- Add Policies page.
- Add Privacy page.
- Add Accessibility statement.
- Add footer governance links.
- Add metadata and Open Graph assets.
- Run accessibility checks.
- Run Lighthouse/performance checks.
- Prepare redirect plan from old website URLs.
- Prepare launch checklist.

Deliverables:

- Governance pages.
- Launch checklist.
- Redirect plan.
- Accessibility and performance fixes.

Acceptance criteria:

- Critical policy pages are visible and accurate.
- Mobile performance and accessibility are acceptable.
- Launch risks are documented.

## Sprint 6: Post-launch iteration

Status: Backlog.

Goal: Improve the site using real behaviour and club feedback.

Tasks:

- Review enquiry quality.
- Review analytics if enabled.
- Improve weak journeys.
- Add sponsor modules.
- Add real videos.
- Add CMS/editor workflow if needed.
- Add search if content volume justifies it.

Deliverables:

- Measured improvement backlog.
- CMS recommendation.
- Updated content roadmap.

Acceptance criteria:

- Maintenance is sustainable for the club.
- The site can evolve without another full rebuild.

## Sprint 16: Security and repository controls

Status: Delivered.

- Cloudflare response CSP, `frame-ancestors`, Permissions Policy and clickjacking headers.
- Web3Forms hCaptcha client integration, bounded fields and privacy disclosure.
- Least-privilege GitHub Actions and locked audit/Lighthouse dependencies.
- Protected `main`, secret scanning/push protection and Dependabot security alerts.

Owner follow-up: enable hCaptcha for the form in the Web3Forms dashboard.

## Sprint 17: Performance and PWA refinement

Status: Delivered.

- Responsive hero preload and immutable caching for hashed assets.
- Service worker remains non-cacheable so updates arrive promptly.
- Large gallery photo reduced from 270 KB to 144 KB.
- PWA precache reduced from 2.17 MiB to approximately 410 KiB.
- Three-run homepage baseline: performance 93, accessibility 100, best practices 100, SEO 100.

## Sprint 18: Automated regression testing

Status: Delivered.

- 10 Vitest component/integration tests for forms, analytics, navigation and conditional content.
- 12 Playwright checks across desktop and mobile Chromium profiles.
- Automated axe WCAG A/AA, offline fallback, PWA policy and Cloudflare header assertions.
- Repository-owned Lighthouse runner with hard thresholds and no temporary public reports.

## Cross-sprint rules

- Do not invent unconfirmed club facts.
- Keep content structured where practical.
- Run `npm run build` before committing.
- Preserve responsive quality.
- Keep GitHub Pages deployment working.
- Document new assumptions in `docs/site-spec.md`.
- Prefer real club imagery over generated imagery when available.
