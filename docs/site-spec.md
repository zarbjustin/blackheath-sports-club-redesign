# Blackheath Sports Club website specification

## Purpose

Build a modern public website for Blackheath Sports Club that makes the club feel active, welcoming, historic and easy to join. The site should help visitors quickly understand what happens at Rectory Field, choose the right sport or club pathway, and make a confident enquiry.

This document is the working specification. It should evolve as the club supplies confirmed copy, photography, videos, booking links, membership details and operational policies.

For implementation handover, see `docs/ai-handover.md`. For the tactical sprint backlog, see `docs/sprint-plan.md`.

## Current concept status

The current repo contains a first-pass static concept site. It establishes the visual direction, public information architecture and core journeys, but it is not yet a production-ready replacement for the live club website.

Key assumptions in the concept:

- The club should present Rugby, Cricket, Tennis and Squash as equal first-class pathways.
- Rectory Field and the clubhouse are major brand assets and should be visible early.
- Venue hire should be treated as a primary journey, not a buried supporting page.
- The site must avoid unverified operational details until the club confirms them.

## What I would improve next

### 1. Replace concept imagery with real club media

The generated hero image gives the right composition, but production should use real photography and short video from Rectory Field.

Needed assets:

- Wide exterior hero image of the clubhouse, pitches and courts.
- Match-day rugby and cricket images.
- Tennis and squash action images.
- Junior sport and family-friendly club images.
- Clubhouse interior and event-hire images.
- Optional 8-15 second background video for the homepage hero.

Acceptance criteria:

- Homepage hero uses a real club-approved asset.
- Every sport has at least one authentic image.
- Venue hire has interior and exterior imagery.
- Images are compressed and have useful alt text.

### 2. Build real sport landing pages

The current concept has cards for four sports. Each sport needs its own page with practical next steps.

Pages:

- `/rugby`
- `/cricket`
- `/tennis`
- `/squash`

Each page should include:

- Overview and tone matched to the sport.
- Junior and adult pathways where applicable.
- Training, fixtures, booking or team links.
- Primary contact.
- Calls to action for joining, booking, watching or volunteering.

Acceptance criteria:

- Each sport page has a clear owner/contact.
- Every page answers "Can I play here?" within the first viewport.
- Sport-specific booking or external club links are confirmed before launch.

### 3. Make membership genuinely useful

The concept names membership pathways, but the next version needs real categories, eligibility, pricing and enquiry routing.

Needed decisions:

- Membership categories.
- Annual/monthly pricing.
- Family and junior options.
- Social membership.
- Whether membership is club-wide, sport-specific or both.
- Payment and renewal process.

Acceptance criteria:

- Membership page shows clear options without forcing visitors to email for basic facts.
- Users can identify the right next step in under 30 seconds.
- Pricing and terms are confirmed by the club before publishing.

### 4. Improve venue hire into a conversion journey

Venue hire should become a high-quality sales page.

Needed content:

- Spaces available.
- Capacities.
- Food and bar options.
- Event types supported.
- Accessibility.
- Parking and transport.
- Enquiry form fields.
- Photo gallery.

Acceptance criteria:

- Venue hire page has a strong image-led first viewport.
- Visitors can submit or draft a useful enquiry with date, event type, guest count and contact details.
- Page includes enough detail to reduce low-quality back-and-forth emails.

### 5. Add fixtures, events and news

The concept has a static activity rhythm. The production site should support current activity without becoming hard to maintain.

Options:

- Lightweight manually edited news/events data file.
- Embedded fixtures from existing sport platforms.
- Calendar feed integration later.

Acceptance criteria:

- Homepage can show 3-5 current items.
- Stale content is easy to detect and remove.
- Editors can update content without touching layout code in a future CMS phase.

### 6. Add trust, compliance and club governance

A sports club website needs more than marketing pages.

Needed pages:

- Safeguarding.
- Welfare and contacts.
- Policies.
- Accessibility.
- Privacy policy.
- Cookie notice if analytics or embedded third-party tools are used.
- Contact and location.

Acceptance criteria:

- Critical policy pages are discoverable from the footer.
- Welfare and safeguarding contacts are prominent and accurate.
- Privacy/cookie handling matches the actual tools used.

### 7. Add CMS or structured content editing

The current site is static React. That is fine for concept and early build, but the club will likely need non-developer editing.

Recommended direction:

- Keep the frontend static and fast.
- Move page content into structured Markdown or JSON first.
- Add a lightweight CMS later, such as Decap CMS, Sanity, Contentful, or a GitHub-backed editing workflow.

Acceptance criteria:

- Common edits do not require changing React components.
- Sports, events, FAQs and venue details have structured content models.
- Editing workflow is simple enough for club volunteers.

### 8. Raise production quality

The concept should mature into a robust site.

Improvements:

- Add route structure with React Router or a static-site framework.
- Add metadata per page.
- Add Open Graph images.
- Add analytics only after privacy decisions.
- Add accessibility checks.
- Add Lighthouse/performance checks.
- Add form handling with spam protection.
- Add error and success states for enquiries.

Acceptance criteria:

- Lighthouse performance, accessibility and SEO scores are healthy on mobile.
- Forms have validation and clear confirmation states.
- The site works without layout shifts or horizontal overflow.

## Recommended information architecture

Primary navigation:

- Sports
- Membership
- Venue Hire
- Events
- About
- Visit
- Contact

Footer navigation:

- Rugby
- Cricket
- Tennis
- Squash
- Juniors
- Safeguarding
- Policies
- Privacy
- Contact

Core pages:

- Home
- Sports landing page
- Rugby
- Cricket
- Tennis
- Squash
- Membership
- Juniors
- Venue hire
- Events and news
- About Rectory Field
- Visit
- Contact
- Safeguarding
- Policies

## Content model

### Sport

- Name
- Short description
- Long description
- Hero image
- Primary contact
- Booking or fixtures URL
- Junior pathway
- Adult pathway
- Training/session notes
- Calls to action
- FAQs

### Event

- Title
- Date
- Time
- Location
- Sport or club-wide category
- Description
- Image
- Booking/enquiry URL
- Published status

### Venue hire package

- Name
- Suitable event types
- Capacity
- Facilities
- Bar/catering notes
- Availability notes
- Images
- Enquiry call to action

### Policy

- Title
- Owner
- Last reviewed date
- Document link or page content
- Emergency/contact details if relevant

## Design direction

The visual design should feel:

- Historic but not old-fashioned.
- Community-focused rather than corporate.
- Sporty, energetic and practical.
- Premium enough for venue hire.
- Clear and calm enough for parents, players and volunteers.

Design principles:

- Use real club imagery wherever possible.
- Keep navigation obvious and mobile-first.
- Give each sport a distinct accent while keeping the whole club coherent.
- Avoid dense legacy pages with too many unrelated links.
- Keep calls to action specific: join, book, enquire, visit, volunteer.

## Sprint plan

### Sprint 0: Discovery and content confirmation

Goal: turn assumptions into verified requirements.

Tasks:

- Confirm sports, contacts, ownership and booking links.
- Collect current membership categories and prices.
- Audit existing pages and decide what to keep, merge or retire.
- Gather brand assets, crest/logo rules and preferred colours.
- Create photography and video shot list.
- Confirm must-have policy pages.

Deliverables:

- Updated specification.
- Content inventory.
- Confirmed page list.
- Media brief.

Exit criteria:

- No high-risk unverified claims remain in the production backlog.
- Club stakeholders agree the site map.

### Sprint 1: Foundation and content architecture

Goal: make the site scalable beyond a single-page concept.

Tasks:

- Add routing and page templates.
- Move repeated content into structured data.
- Create reusable components for hero sections, sport cards, CTAs, galleries and FAQs.
- Add page metadata.
- Establish image optimisation workflow.

Deliverables:

- Multi-page site shell.
- Structured content files.
- Reusable design system components.

Exit criteria:

- Adding a new sport/event/policy does not require rebuilding layout from scratch.

### Sprint 2: Sports and membership journeys

Goal: make "how do I play or join?" easy to answer.

Tasks:

- Build Rugby, Cricket, Tennis and Squash pages.
- Build Membership page.
- Add junior pathway content.
- Add sport-specific CTAs and confirmed external links.
- Add FAQs for common joining questions.

Deliverables:

- Four sport landing pages.
- Membership page.
- Junior participation section.

Exit criteria:

- Each visitor type has a clear next step: adult player, parent, junior, casual player, supporter or social member.

### Sprint 3: Venue hire and contact conversion

Goal: make clubhouse hire and enquiries work like a modern conversion journey.

Tasks:

- Build venue hire page.
- Add gallery and space details.
- Add enquiry form fields and validation.
- Decide form backend.
- Add confirmation and error states.
- Add contact page and location detail.

Deliverables:

- Venue hire page.
- Contact/enquiry forms.
- Visit/location page.

Exit criteria:

- A visitor can send a useful venue enquiry without needing to phone first.

### Sprint 4: Events, news and club activity

Goal: make the site feel current without creating a maintenance burden.

Tasks:

- Build events/news listing.
- Add homepage activity module.
- Decide manual content vs feed/embed approach.
- Add empty and stale-content states.
- Add editorial guidelines for volunteers.

Deliverables:

- Events/news page.
- Homepage latest activity section.
- Content update guide.

Exit criteria:

- Club activity can be updated quickly and old information can be removed safely.

### Sprint 5: Governance, accessibility and launch readiness

Goal: make the site trustworthy and ready for public launch.

Tasks:

- Build safeguarding and policy pages.
- Add footer governance links.
- Run accessibility checks.
- Run mobile performance checks.
- Add privacy/cookie handling based on actual integrations.
- Add redirects plan from old URLs if needed.
- Prepare launch checklist.

Deliverables:

- Governance pages.
- Accessibility fixes.
- Launch checklist.
- Redirect/content-retirement plan.

Exit criteria:

- The site is fit for public review by club stakeholders.

### Sprint 6: Post-launch iteration

Goal: improve based on real behaviour and stakeholder feedback.

Tasks:

- Review analytics and enquiry quality.
- Improve weak journeys.
- Add real videos and seasonal campaign sections.
- Add CMS/editor workflow if needed.
- Add sponsor modules.
- Add search if content volume justifies it.

Deliverables:

- Backlog of measured improvements.
- CMS recommendation.
- Updated visual/content roadmap.

Exit criteria:

- Site maintenance is sustainable for club volunteers.

## Success metrics

Primary metrics:

- More membership enquiries.
- More venue hire enquiries.
- Fewer confused or incomplete enquiries.
- More visitors reaching sport-specific pages.
- Better mobile engagement.

Operational metrics:

- Time needed to update events/news.
- Number of stale content items.
- Page performance on mobile.
- Accessibility issues found and resolved.

## Open questions

- Which sports are formally under the Blackheath Sports Club umbrella versus separate linked clubs?
- Who owns final copy approval?
- What is the preferred contact route for each sport?
- Does the club want online forms, email links, or a booking system integration?
- Which platform should hold fixtures and events?
- Does the club have brand guidelines or only existing crest/logo files?
- Are there sponsor obligations on the homepage or footer?
- Who will maintain the site after launch?

## Immediate next actions

1. Replace placeholder hero image with real club-approved photography.
2. Confirm sport-specific contacts and booking links.
3. Collect membership categories, prices and eligibility.
4. Collect venue hire details and photos.
5. Decide whether Sprint 1 should keep plain React or move to a static-site/CMS-friendly architecture.
