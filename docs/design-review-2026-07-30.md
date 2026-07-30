# Multi-model design, UX & front-end review — Blackheath Sports Club

**Date:** 2026-07-30 · **Branch reviewed:** `codex/official-logo-copy` @ `0ced760` (impl `a5ca98a`)
**Method:** Consolidated review synthesising two perspectives — a Product/UX & Visual Design lead
and a Principal Web Architect / research lead. Where they disagreed, the trade-off and the chosen
call are recorded. Evidence is drawn from the repository (source of truth), the live Cloudflare
Pages site, and cited external research.

**Legend for claims:** `[E]` evidence (observed in repo/live) · `[I]` interpretation · `[A]` assumption · `[R]` recommendation.

---

## 1. Executive summary

Blackheath Sports Club's redesign is a **well-engineered, single-page marketing site** built on a
modern stack (Vite 8, React 19, Framer Motion via `LazyMotion`, self-hosted variable fonts, PWA,
sharp-optimised WebP). `[E]` The recent official-identity work (crest, club colours, corrected
club order and legal footer) lifts brand credibility materially. The foundation is strong: real
content in `src/data.js`, a considered token system, accessibility scaffolding (skip link, focus
trap, reduced-motion), CSP hardening, JSON-LD `@graph`, and CI with Lighthouse/axe/link checks. `[E]`

The gaps are **not** in polish — they are in **product depth and information architecture**:

1. **No fixtures / events / "what's on"** — the single biggest repeat-visit driver for a sports
   club, and the top pattern in competitor research. `[E][I]`
2. **No online join or pay** — membership is presented as read-only info + an enquiry form; best-in-class
   club sites lead with register-and-pay. `[E][I]`
3. **The enquiry form (`#enquire`) renders _before_ the venue-hire section (`#hire`) it refers to** —
   the conversion ask precedes its own context. `[E]`
4. **SEO exposure from client-only rendering** — only `<title>`, meta and JSON-LD are in the static
   HTML; all body content is injected by React into an empty `#root`. The live production title still
   reads the *old* "Rugby, Cricket, Tennis & Squash" ordering, confirming PR #20 is unmerged. `[E]`
5. **Design tokens are half a system** — colour/radius/shadow/font tokens exist, but there is **no
   spacing scale and no type scale**; sizes and section padding are hardcoded magic numbers across
   34 KB of CSS. `[E]`

**Recommended path:** do **not** rewrite. The architecture is sound and the visual language is close.
Ship PR #20, then invest incrementally in (a) IA re-order + fixtures + a real membership CTA, and
(b) completing the token system. The recommended visual direction below ("Heritage Turf") is an
**evolution** of the current design, not a replacement.

### Scorecard (1–5, 5 = excellent)

| Dimension | Score | One-line rationale |
|---|:--:|---|
| Overall maturity | 3.5 | Strong build & brand; product depth & IA incomplete |
| Product clarity | 3.5 | "Four clubs, one home" is clear; membership/venue value under-explained |
| Visual quality | 4.0 | Distinctive crest-led identity, good type pairing, tasteful motion |
| UX | 3.0 | Good a11y scaffolding; IA order, dual contact paths, no fixtures |
| Accessibility | 3.5 | Solid base; lime-on-white and focus/contrast edges need an audit |
| Performance | 4.0 | Lean bundle (~101 KB JS gz), responsive hero, fetchpriority |
| Technical maintainability | 3.5 | Clean, but one 35 KB component + no spacing/type tokens |

---

## 2. Repository & product discovery report

**What it is `[E]`:** a single-page brochure site for Blackheath Sports Club at the Rectory Field,
Charlton Road, London SE3 8SR — the shared home of four constituent clubs: **Cricket, Rugby Football,
Lawn Tennis, Squash** (registered order, enforced in `src/data.js`).

**Who it serves `[E][I]`:**
- Prospective **players / parents** (junior pathways, ~700 junior + ~1,100 adult members).
- **Social members** (£50/yr non-playing — bar, terrace, community).
- **Venue-hire buyers** (weddings, birthdays, wakes, conferences, training).
- **Local/SEO visitors** for SE3/Charlton/Greenwich searching for the club.

**Primary journeys `[E][I]`:** (1) discover a sport → click out to that club's own site;
(2) enquire about venue hire; (3) understand/enquire about membership; (4) find/visit the ground.

**Tech & deployment `[E]`:** Vite 8 + React 19 SPA, plain CSS with custom properties, Framer Motion
(`LazyMotion` + `m.*`), lucide-react 1.23, `@fontsource-variable` Inter + Fraunces, `vite-plugin-pwa`,
`sharp` build scripts. Hosted on Cloudflare Pages (primary) + GitHub Pages mirror; no backend, DB or auth.
Content is fully centralised in `src/data.js`; the whole UI is one file, `src/main.jsx` (~1,050 lines).

**Design system present `[E]`:** `src/styles.css` `:root` tokens — club colours (`--club-red #e30613`,
`--club-lime #b8cf00`, `--club-green #1f5736`, `--club-black`), an ink/paper/muted neutral set, a
`--brand-stripe` gradient, radii (`--r-sm/md/lg/pill`), three shadows, two font stacks, one easing curve.

**In-progress / known constraints `[E]`:** PR #20 (official identity) awaits a `npm audit --audit-level=high`
gate that fails only on **dev-tooling** transitive deps (`vite-plugin-pwa → workbox → … → brace-expansion`);
candidate fix `--omit=dev` is documented but not applied. npm registry access triggers org Defender alerts —
avoid unsolicited installs. Production is protected; changes land via passing PR.

**Which URL is production `[E][I]`:** `https://blackheath-sports-club-redesign.pages.dev/` is canonical
(set in `index.html` and `data.js`); the GitHub Pages URL is a mirror. A real club domain
(`blackheathsportsclub.co.uk`) is not yet connected.

---

## 3. External research summary

Sources: CLUBView, SportNest, Finley Design, MyClubPro, and specialist agencies (Oak Creative, Impact
Digital, MB Web) via 2025 market research. Consistent best-in-class patterns for UK club sites:

- **Fixtures/results front-and-centre**, filterable by team, exportable to personal calendars. `[E-ext]`
- **Mobile-first, app-like** experiences with quick access to news/fixtures. `[E-ext]`
- **Conversion onboarding** — minimal-friction **join + pay** and event booking. `[E-ext]`
- **Venue hire** presented with guided booking forms (ideally availability), maps inline. `[E-ext]`
- **Community content** (photo/video/news, social share) to drive return visits. `[E-ext]`

**Interpretation for this club `[I]`:** BSC is a **federation of four independent clubs**, each with its
own site handling fixtures/registration. So BSC's site should **not** rebuild league tables — it should
**aggregate** an "Upcoming at the Rectory Field" view and **signpost** to each club, while owning the two
journeys the constituent sites don't: **social membership** and **venue hire**. That is the differentiation
lane. Trend caution: avoid heavy SaaS-dashboard patterns; they don't fit a static, volunteer-run brochure site.

---

## 4. Current website assessment

### 4.1 Visual design `[E][I]`
Strong, distinctive first impression: full-bleed hero of the Rectory Field with blur-up + subtle
parallax, crest lockup, Fraunces display headline (`clamp(3rem, 9vw, 7.4rem)`), Inter body, a
red/lime/green brand stripe under the fixed glass header. Colour discipline is good — the club created
`--club-lime-ink #657300` precisely because raw lime fails on white (verified contrast ~1.8:1). Motion
is tasteful and reduced-motion-aware. **Weaknesses:** the palette leans generic-club when the stripe
isn't visible; card/section rhythm is inconsistent because spacing is ad-hoc; no signature recurring
motif beyond the crest.

### 4.2 User experience `[E][I]`
Navigation is a fixed glass bar collapsing to a dropdown panel < 960 px with a real focus trap and
Escape-to-close — good. **Friction points:**
- **IA ordering:** DOM order is Hero → Welcome → Sports → Other facilities → Membership → **Enquiry
  (`#enquire`)** → **Venue hire (`#hire`)** → Heritage → Gallery → Media → Visit → Grounds → Contact.
  The enquiry **form** sits above the venue-hire **explainer**, and nav "Venue hire" jumps past the form. `[E]`
- **Duplicate contact paths:** an Enquiry section (with its own contacts list) *and* a separate Contact
  section — two overlapping "get in touch" surfaces. `[E]`
- **Dead-end membership CTA:** hero "Become a member" → `#membership`, which is informational only; there's
  no join action, only the shared enquiry form. `[E]`
- **No fixtures/what's-on**, so no reason to return between visits. `[E][I]`

### 4.3 Content & messaging `[E][I]`
Real, credible copy centralised in `coreMessaging`: heritage since the late 19th century, ~1,100 adult /
~700 junior members, seven-day bar, venue-hire use cases, correct legal entity + company number 00021418.
Value proposition ("Sporting Excellence in the Community"; "Four clubs, one home") is clear. **Gaps:**
no testimonials/reviews/social proof; membership benefits aren't spelled out (what does £50 get you?);
venue-hire lacks capacities/pricing-from/photos-per-space that buyers scan for.

### 4.4 Technical quality `[E][I]`
Clean React with `LazyMotion` (small bundle), semantic landmarks (`header`/`main`/`nav`/`address`/`footer`),
responsive `srcSet` hero with `fetchPriority="high"`, click-to-load sandboxed Google Map (GDPR-friendly),
self-hosted fonts, CSP + referrer meta, all `target=_blank` links `rel="noopener noreferrer"`. **Concerns:**
(1) client-only rendering of body content → SEO/robustness risk; (2) `main.jsx` is a single 35 KB file — every
section, the header, footer, form and map in one component module; (3) tokens lack spacing/type scales.

---

## 5. Page-by-page (section-by-section) review

The product is one page; "pages" = sections. Priority: P0 critical → P3 low.

| Section (`id`) | Purpose | Key strengths | Key issues | Priority |
|---|---|---|---|:--:|
| **Hero** | Identity + dual CTA | Crest lockup, parallax, clear slogan | "Become a member" is a dead-end; CTA copy could be more benefit-led | P1 |
| **Welcome** | Orient: one club, four sports | Real copy, fact chips, dog notice | Slightly long before first "what can I do" | P2 |
| **Sports** | Route to 4 clubs | Real photos, custom SVG icons, correct order, outbound links | Cards don't hint "you'll leave this site"; no season/what's-on hook | P1 |
| **Other facilities** | Gym + nursery | Honest, useful | Visually competes with the 4 core sports | P3 |
| **Membership** (`#membership`) | Explain joining | Price + pathways | No benefits list, no join/pay, dead-ends into enquiry | P1 |
| **Enquiry** (`#enquire`) | Capture leads | Accessible, honeypot, Web3Forms live, graceful mailto fallback | **Renders before the venue-hire context**; overlaps Contact | P1 |
| **Venue hire** (`#hire`) | Sell the space | Facilities list, bar photo, CTA | Sits after the form; no capacities/pricing-from/gallery | P1 |
| **Heritage** | Trust via history | 1883/1885/1937 timeline, Carpmael note, historic imagery | Could carry a stronger "why it matters today" line | P2 |
| **Gallery** | Life at the club | Real photos, responsive grid | No lightbox; captions only | P2 |
| **Media** | Video-ready slot | Auto-hides until a clip is set | Placeholder value until asset supplied | P3 |
| **Visit** | Find/travel | Address, sat-nav postcode, click-to-load map, areas served | Map is a jump target after Grounds | P2 |
| **Grounds** | Orient on site | Branded sitemap + legend | Static image; no interactivity needed | P3 |
| **Contact** | Reach the club | Email/phone/hours/social | Duplicates Enquiry's contact list | P2 |
| **Header/Nav** | Wayfinding | Glass bar, focus trap, Esc, brand stripe | No active-section highlight; "Enquire" vs "Venue hire" targets differ | P2 |
| **Footer** | Legal + trust | Crest, legal entity, company no., address, privacy | Fine | P3 |
| **Error/offline** | Resilience | `public/404.html` + `offline.html` branded | Retest on custom domain | P3 |

---

## 6. Competitor analysis

| Pattern (best-in-class) | BSC today | Gap / opportunity |
|---|---|---|
| Fixtures/results, filterable & exportable | None (each club hosts its own) | **Aggregate** "Upcoming at Rectory Field" + signpost — differentiator `[I]` |
| Join + pay online | Info + enquiry only | Add clear membership CTA; social-join could be a simple form/Stripe-link `[I]` |
| Venue-hire guided booking | Enquiry form (generic) | Space-by-space cards (capacity, use, photos) → enquiry `[I]` |
| Mobile-first app feel | Good responsive SPA, PWA | Already competitive — retain `[E]` |
| Community content/return visits | Gallery, video-ready | Add news/what's-on; lightbox gallery `[I]` |
| Trust/social proof | Heritage + member counts | Add testimonials/Google reviews block `[I]` |

**Where BSC already wins `[E]`:** heritage storytelling, brand/crest execution, accessibility scaffolding,
performance and privacy posture typically exceed template-driven club sites. Don't lose these.

---

## 7. Three visual directions

All three keep Fraunces + Inter and the official crest; they differ in system, texture and motion.

### Direction A — "Heritage Turf" (evolution of current) ✅ recommended
- **Feel:** established, warm, credible — a 140-year club that's still alive.
- **Colour:** club green as the primary surface accent, red for CTAs, lime *only* as `lime-ink` detail;
  cream paper. **Motif:** the red/lime/green stripe as a recurring rule under headings + card tops.
- **Type/layout:** current Fraunces display, generous white space via a **new spacing scale**; editorial
  two-column blocks. **Imagery:** documentary club photography, slight warm grade.
- **Motion:** current subtle reveals + hero parallax. **Complexity:** **S** (tokens + polish, no re-architecture).
- **Strengths:** lowest risk, keeps brand equity, ships fastest. **Risks:** less "wow" than a bolder rebrand.

### Direction B — "Matchday" (bold, energetic)
- **Feel:** dynamic, sporty, contemporary. **Colour:** high-contrast black/white with red as a loud accent,
  lime as an electric highlight. **Type:** oversized condensed display, tighter grid, big number stats
  (1,100 / 700 / 1883). **Imagery:** action photography, duotone treatments. **Motion:** stronger scroll
  and hover choreography, marquee stat band. **Complexity:** **M–L**.
- **Strengths:** most differentiated, great for juniors/energy. **Risks:** can read too "pro-sport", may
  clash with the heritage/venue-hire (wedding) audience; accessibility work for duotone contrast.

### Direction C — "Rectory Field" (calm, premium venue-led)
- **Feel:** refined, spacious, hospitality-grade — leans into venue hire and social membership.
- **Colour:** muted greens + stone neutrals, red reserved for a single primary action. **Type:** larger
  Fraunces, airy leading, lots of negative space. **Imagery:** golden-hour grounds, interiors, terrace.
- **Motion:** minimal, slow fades. **Complexity:** **M**.
- **Strengths:** best for venue-hire conversion and "quality" perception. **Risks:** under-serves the
  competitive-sport/junior audience; risks feeling like a wedding venue, not a sports club.

---

## 8. Recommended visual direction — "Heritage Turf" (A)

**Why `[R]`:** it maximises value per effort. The current design is already ~80% of this direction; the
uplift is (1) finishing the token system, (2) enforcing green-primary/red-CTA/lime-as-ink discipline, and
(3) tightening rhythm. It serves **all four audiences** (players, parents, social, venue) without alienating
the heritage/venue buyers a bold "Matchday" would risk, and without under-serving juniors as "Rectory Field"
would. It preserves the brand equity just invested in PR #20. **Evidence:** competitor research rewards
clarity + trust + mobile speed over spectacle; BSC's differentiators are heritage and being the shared home.
**Compromise:** less visual novelty than B — mitigated by the stripe motif and stronger stat/testimonial blocks.

---

## 9. Design-system specification (for "Heritage Turf")

Extend the **existing** `:root` in `src/styles.css` — do not replace it. Add the two missing scales.

### Colour (retain existing hex; formalise roles)
```
--club-red:#e30613;  --club-red-deep:#b8000a;      /* primary action (white text OK: ~4.9:1) */
--club-green:#1f5736; --forest-deep:#0d3020;        /* primary brand surface / headings accent */
--club-lime:#b8cf00;  --club-lime-ink:#657300;      /* lime DECOR only; text uses lime-ink */
--ink:#101713; --muted:#53615a; --paper:#fdfcf8; --soft:#f3f2ea;
/* semantic (new) */
--action:var(--club-red); --action-ink:#fff;
--success:#1f5736; --warning:#8a6d00; --danger:#b8000a; --info:#285d45;
--focus:var(--forest);
```
**Rule `[R]`:** never render `--club-lime` as text or as a CTA fill on paper; audit for violations.

### Spacing scale (NEW — currently missing `[E]`)
```
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px;
--space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px; --space-10:128px;
--section-y:clamp(var(--space-8),9vw,var(--space-10)); /* replace hardcoded 68px/section padding */
```

### Type scale (NEW — formalise the scattered clamps `[E]`)
```
--fs-eyebrow:0.76rem/0.14em; --fs-body:1.06rem; --fs-lead:clamp(1.08rem,2vw,1.4rem);
--fs-h3:1.42rem; --fs-h2:clamp(2rem,4vw,3.8rem); --fs-h1:clamp(3rem,9vw,7.4rem);
--lh-tight:1.05; --lh-body:1.6; --lh-loose:1.75;
```

### Layout, radius, elevation, motion (retain)
- Container `max-width:1180px`; breakpoints **formalise as tokens**: `--bp-sm:640px; --bp-md:960px; --bp-lg:1000px`.
- Radii `--r-sm/md/lg/pill`; shadows `--shadow/-sm/-lift`; easing `--ease` — keep.
- **Focus state (formalise):** `outline:2.5px solid var(--focus); outline-offset:3px` (already used) — apply globally and verify visibility on red/green surfaces.
- **Motion:** keep `MotionConfig reducedMotion="user"` + the reduced-motion media block.

### Components to standardise
Buttons (primary red / ghost), links, form fields + labels + inline errors, cards (sport/facility/venue),
nav (add active-section state), notifications (form success/error), status chips, loading + empty + error
states, hover/focus/disabled — all consuming the tokens above.

---

## 10. Homepage redesign specification (wireframe)

Re-order so **context precedes the ask** and each section answers one visitor question. `[R]`

```
1.  Header / nav ............ "Where can I go?" (+ active-section highlight)
2.  Hero ................... "What is this & what can I do?" (benefit CTA + venue CTA)
3.  Proof strip ............ "Can I trust it?" — est. 1883 · ~1,100 adult · ~700 junior · 7-day bar
4.  Four clubs, one home ... "Which sport?" (cards → each club site; label outbound)
5.  What's on / Upcoming ... "Is it active?" — aggregated fixtures/events (NEW, see Backlog)
6.  Membership ............. "How do I join & why?" — benefits + PRIMARY join CTA
7.  Venue hire ............. "Can I hire it?" — space cards (capacity/use/photo) → enquiry
8.  Enquiry form .......... "Ask" — comes AFTER venue context; single lead-capture surface
9.  Heritage .............. "Why does it matter?" — timeline + Carpmael
10. Gallery ............... "Show me" — lightbox
11. Visit + map ........... "How do I get there?" — address, sat-nav, click-to-load map, grounds legend
12. Footer ................ legal entity, company no., address, privacy, social
```

**Copy suggestions `[R]`:** Hero H1 stays `Blackheath Sports Club`; sub-CTA "Become a member" → link to a
membership section that *sells* (benefits + join), not just informs. Add a one-line venue value prop with a
"from £—" or "capacity up to —" hook once the club confirms. Merge the standalone **Contact** into the
Enquiry section's contact list to remove the duplicate path. **Mobile:** stack all grids to 1-col (already
done < 960 px); keep CTAs full-width (already done < 640 px). **A11y:** maintain focus trap, add `aria-current`
to the active nav link.

---

## 11. Visual asset plan

| Asset | Verdict | Action |
|---|---|---|
| Official crest (`src/assets/brand/`) + preserved masters (`/source`) | **Retain** | Core equity; keep source masters |
| Hero WebP set (`hero-640…1920`) + blur | **Retain** | Well-optimised, responsive; regen if a stronger golden-hour frame exists |
| Club photos (`src/assets/club/*.webp`) | **Retain / top-up** | Good; add per-venue-space photos for hire |
| Sitemap/grounds image | **Retain** | Branded, on-palette |
| Gallery images | **Retain + enhance** | Add lightbox; ensure consistent grade |
| OG/PWA icons | **Retain** | Regenerated from crest |
| Testimonials/reviews imagery | **Missing** | Add member/wedding quotes (text, not baked into images) |

**New assets needed `[R]`:**
- **Venue-hire space photos** — each hireable room/terrace: purpose = help buyers choose; composition =
  wide, eye-level, dressed for an event; warm natural light; negative space top-left for an overlaid label
  (label in HTML, **not** in the image); desktop 16:9, mobile 4:5 crop-safe; avoid clutter/empty-pint-glass shots.
- **Optional hero video** — muted, captioned, 8–15 s, reduced-motion fallback (slot already exists in `media`).

**Prompt (illustrative, for a stock/photo brief — no readable text in image):** "Warm golden-hour photograph
of a traditional English cricket/rugby pavilion terrace set for a celebration, string lights, tables dressed,
mature trees and a green field behind, natural light, editorial documentary style, generous empty sky for
overlay, no visible signage or text."

---

## 12. Accessibility audit (WCAG 2.1 AA)

| Sev | Finding | Evidence | Remediation | Acceptance |
|---|---|---|---|---|
| High | Verify no lime-on-paper text/CTAs | `--club-lime #b8cf00` ≈ 1.8:1 on white | Audit CSS; text must use `--club-lime-ink`; lime = decor only | axe 0 contrast violations |
| High | Confirm red-CTA contrast in situ | white-on-`#e30613` ≈ 4.9:1 (passes AA normal, borderline) | Prefer `--club-red-deep #b8000a` for small text on red | ≥4.5:1 all button text |
| Medium | Active-section wayfinding | Nav has no current state `[E]` | Add `aria-current="page"` + visual highlight | SR announces current section |
| Medium | Duplicate contact landmarks | Enquiry + Contact both "get in touch" `[E]` | Consolidate; one clear labelled region | No redundant nav confusion |
| Medium | Focus visibility on dark/hero | Global outline is forest green | Verify on hero/`.hire` (they switch to gold) | Visible focus on every surface |
| Low | Gallery keyboard access if lightbox added | No lightbox yet `[E]` | Ensure focus-trap + Esc when built | Keyboard-operable dialog |
| Low | Form inline error semantics | Native `required` only `[E]` | Add `aria-describedby` error text on invalid | Errors announced |

**Already good `[E]`:** skip link, mobile focus trap + Esc, reduced-motion block, intrinsic `width/height`
(no CLS), semantic landmarks, labelled inputs with `autoComplete`, click-to-load map (no forced 3rd-party).

---

## 13. Technical & performance review

| Area | Finding | Impact | Fix | Cplx | Pri |
|---|---|---|---|:--:|:--:|
| Rendering/SEO | Body content client-rendered into empty `#root`; static HTML has only title/meta/JSON-LD `[E]` | Crawl robustness, slow-device TTI | Consider Vite SSG/prerender of the single route (`vite-plugin-ssr`/`vite-react-ssg`) | M | P1 |
| Tokens | No spacing/type scale; magic numbers in 34 KB CSS `[E]` | Inconsistency, maintenance cost | Add scales (§9); refactor incrementally | M | P1 |
| Component size | `main.jsx` ~35 KB single module `[E]` | Hard to maintain/test | Split into `sections/` + `components/` | M | P2 |
| CI gate | `npm audit --audit-level=high` fails on **dev-only** transitive deps `[E]` | Blocks PR #20 | `--omit=dev` for the deploy audit; Dependabot keeps tracking dev | S | P0 |
| SEO headers | `<meta>` CSP can't set HSTS/`frame-ancestors`/`X-CTO`/`Permissions-Policy` `[E]` | Security headers gap | Move to real response headers on a custom domain behind Cloudflare | M | P2 |
| Analytics | Cloudflare Web Analytics opt-in, off until token/dashboard `[E]` | No usage data | Enable in Pages dashboard | S | P1 |
| Testing | No unit/e2e; QA is throwaway Playwright `[E]` | Regression risk | Add Vitest + Playwright smoke (a11y/links already in CI) | M | P2 |
| Images | Well-optimised WebP + sharp pipeline `[E]` | — | Retain; add AVIF option for hero | S | P3 |

**Performance `[E]`:** per handover, FCP ~388 ms, ~10 requests, ~409 KB initial, ~101 KB JS gz — healthy.
Keep `LazyMotion` + `m.*`, `fetchPriority` hero, self-hosted fonts.

---

## 14. Component & implementation review (against the codebase)

- **Retain:** `Hero`, `Reveal`, `MapEmbed` (click-to-load), `Enquiry` (form + honeypot + fallback), footer,
  the whole token/motion/PWA/CSP/SEO foundation, `src/data.js` content model.
- **Refactor:** split `main.jsx` into `src/sections/*` + `src/components/{Button,Field,Card,Nav}`; migrate
  hardcoded sizes/padding to the new `--space-*`/`--fs-*` tokens; add `aria-current` to nav.
- **Re-order (no new tech):** move the `Enquiry` block to **after** `VenueHire`; merge `Contact` into the
  enquiry contact list. Fix "Become a member" to target a membership section that includes a real join CTA.
- **New components:** `WhatsOn`/`UpcomingFixtures` (build-time `public/fixtures.json` from club iCal/RSS +
  scheduled Action), `VenueSpaceCard` (capacity/use/photo), `Testimonials`, `Lightbox`.
- **Content to write:** membership benefits; venue capacities/pricing-from; 3–5 testimonials/reviews.
- **Don't:** rewrite the app, add a SPA router, or introduce a component library — unjustified for one page. `[R]`

---

## 15. Prioritised backlog

Complexity S/M/L/XL. Files are indicative.

| ID | Epic | Problem | Recommendation | Pri | Cplx | Files |
|---|---|---|---|:--:|:--:|---|
| BL-A | Launch | PR #20 blocked by dev-only audit noise | Apply `npm audit --omit=dev --audit-level=high`; merge; verify prod | **P0** | S | `.github/workflows/*.yml` |
| BL-B | IA | Enquiry precedes its venue-hire context; dual contact paths | Re-order Enquiry after Venue hire; merge Contact into enquiry | **P1** | S | `src/main.jsx` |
| BL-C | Conversion | "Become a member" dead-ends into info | Membership section with benefits + real join CTA | **P1** | M | `src/main.jsx`, `src/data.js` |
| BL-D | Design system | No spacing/type tokens; magic numbers | Add `--space-*`/`--fs-*`; refactor CSS incrementally | **P1** | M | `src/styles.css` |
| BL-E | SEO/robustness | Client-only rendering | Prerender the single route to static HTML | **P1** | M | `vite.config.js`, build |
| BL-F | Engagement | No fixtures/what's-on | Aggregated "Upcoming at Rectory Field" from club feeds + nightly Action | **P1** | L | new component, `public/fixtures.json`, Action |
| BL-G | A11y | Lime/red contrast + active nav | Contrast audit; `aria-current`; error semantics | **P1** | S | `src/styles.css`, `src/main.jsx` |
| BL-H | Venue | Generic hire pitch | Space cards (capacity/use/photo) + new imagery | **P2** | M | `src/main.jsx`, `src/data.js`, assets |
| BL-I | Trust | No social proof | Testimonials/reviews block | **P2** | S | `src/main.jsx`, `src/data.js` |
| BL-J | Maintainability | 35 KB single component | Split into sections/components | **P2** | M | `src/main.jsx` → `src/sections/*` |
| BL-K | Analytics | Off | Enable Cloudflare Web Analytics | **P1** | S | Cloudflare dashboard |
| BL-L | Media | Gallery flat | Lightbox; optional hero video | **P2** | M | `src/main.jsx` |
| BL-M | Security | No real headers | Custom domain + Cloudflare response headers, HSTS, SRI | **P2** | M | infra + `vite.config.js` |
| BL-N | Testing | None | Vitest unit + Playwright smoke | **P2** | M | new tests |

**Acceptance/testing (representative):** BL-A — required check green, prod shows new title/order; BL-B —
DOM order verified, no duplicate contact region (axe); BL-D — zero hardcoded section paddings, visual diff
unchanged; BL-F — feed parse handles empty/stale, `aria-live` for updates, Lighthouse unaffected.

---

## 16. Sprint plan

- **Sprint 0 — Foundations & unblock:** BL-A (merge PR #20, verify prod), BL-K (analytics on), capture
  Lighthouse/axe baselines, confirm "Heritage Turf" direction.
- **Sprint 1 — Critical UX & a11y:** BL-B (IA re-order), BL-C (membership CTA), BL-G (contrast/active-nav).
- **Sprint 2 — Design system & homepage:** BL-D (tokens), BL-J (component split), homepage §10 order/copy.
- **Sprint 3 — Product depth:** BL-F (fixtures/what's-on), BL-H (venue space cards + imagery), BL-I (testimonials), BL-L (lightbox).
- **Sprint 4 — Robustness, SEO & polish:** BL-E (prerender), BL-M (domain + headers), BL-N (tests), cross-browser + reduced-motion re-check.

---

## 17. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| npm/Defender blocks installs | High | Med | Avoid unsolicited installs; get stakeholder OK; prefer non-networked commands |
| Prerender/SSG regresses motion/PWA | Med | Med | Prototype on a branch; keep SPA fallback; verify SW scope |
| Fixtures feeds unstable/absent per club | High | Med | Graceful empty/stale states; cache last-good; signpost as fallback |
| Push-permission/account mismatch (`zarbjustin` vs `jzarb_microsoft`) | Med | Low | Switch `gh` account for approved branch push, then switch back |
| Token refactor causes visual drift | Med | Med | Incremental migration + visual diff per section |
| Content sign-off delays (prices, testimonials, photos) | High | Med | Ship structure with placeholders behind flags; fill on delivery |

---

## 18. Final recommendation

**Ship, then deepen — don't rewrite.** `[R]` Merge PR #20 (fix the CI audit scope), then run the five
sprints above. The build quality, brand and accessibility base are genuinely good; the return on effort is
highest in **information architecture, a real membership CTA, a fixtures/what's-on aggregator, and finishing
the token system** — all incremental within the current stack.

**Top five problems:** (1) enquiry-before-context IA; (2) dead-end membership CTA; (3) no fixtures/return-visit
driver; (4) client-only rendering SEO exposure; (5) incomplete token system.
**Top five opportunities:** (1) own the two journeys the club sites don't (membership + venue hire);
(2) aggregate "Upcoming at Rectory Field"; (3) venue space cards + testimonials to convert; (4) prerender for
SEO/robustness; (5) formalise tokens for durable consistency.
**Recommended visual direction:** "Heritage Turf" (evolution). **Recommended first sprint:** Sprint 0 (unblock
+ merge + analytics + baselines), immediately followed by Sprint 1's IA re-order.

**Assumptions `[A]`:** constituent clubs expose iCal/RSS feeds (needs confirmation); the club will provide
venue capacities/pricing and testimonials; a custom domain is desired eventually. **Dependencies:** stakeholder
content sign-off, feed URLs, domain/DNS decision, approved npm operations.

*Evidence is cited inline to repo files (`src/main.jsx`, `src/data.js`, `src/styles.css`, `index.html`),
the live Cloudflare Pages site, and external market research (CLUBView, SportNest, Finley Design, MyClubPro
and specialist UK club-web agencies, 2025).*
