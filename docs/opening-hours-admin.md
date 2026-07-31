# Seasonal opening-hours administration

## Purpose

The website supports separate Summer and Winter bar schedules. An authenticated
administrator can edit all seven days, mark individual days closed, switch the active
season and publish an optional short notice. Published changes appear on the public
website without a code change or deployment.

## Administrator workflow

1. Open `https://new.blackheathsportsclub.co.uk/admin/`.
2. Sign in through Cloudflare Access.
3. Choose the active public season.
4. Select the Summer or Winter editing tab.
5. Set each day's opening and closing times, or mark the day closed.
6. Review the public preview.
7. Select **Publish changes**.

The same admin route is available on `https://new.blackheathsportsclub.com/admin/`.

Access currently allows `justin.zarb@zarb.co.uk`. Add or remove administrators in
Cloudflare Zero Trust under **Access controls > Applications > Blackheath Sports Club
Hours Admin**.

## Architecture

- Public API: `GET /api/opening-hours`
- Protected API: `GET|PUT /admin/api/opening-hours`
- Admin interface: `/admin/`
- Shared schema and validation: `shared/seasonal-hours.js`
- Database access: `functions/lib/opening-hours-store.js`
- Cloudflare migration: `migrations/0001_seasonal_opening_hours.sql`
- Production D1 database: `blackheath-sports-club-hours`
- Preview D1 database: `blackheath-sports-club-hours-preview`
- Pages binding: `OPENING_HOURS_DB`

Both seasons are initially seeded with the previously approved hours: weekdays
6pm-11pm and weekends 11:30am-11pm. The public page renders those approved values
immediately as a static fallback, then replaces them with the current D1 schedule.

## Security

- Cloudflare Access protects both the exact `/admin` path and `/admin/*` on both
  temporary club domains.
- The Function independently verifies the Access JWT signature, issuer, audience and
  expiry before returning or changing private data.
- Updates require same-origin JSON requests and strict server-side schedule validation.
- Optimistic revision locking rejects stale updates with HTTP 409.
- A D1 trigger records every successful update in the revision history.
- Admin responses use `no-store`; the admin page uses `noindex`, restrictive CSP and
  anti-framing headers.
- Cloudflare Pages uses `fail_open: false`.
- Never set `ALLOW_LOCAL_ADMIN` in Cloudflare. The bypass also checks for a localhost
  hostname and exists only for local development.

## Data and recovery

The `seasonal_hours` table stores the current configuration. The
`seasonal_hours_revisions` table stores the previous configuration, editor identity and
timestamp for every update. The admin screen shows recent publication history.

The public endpoint may be cached for up to five minutes. To restore an earlier version,
read the required revision's `config_json`, load those values into the admin interface
and publish them as a new revision. This preserves a complete audit trail.

## Development and verification

Use the repository's pinned Node.js version:

```bash
npm ci
npm test
npm run build
```

The full CI build runs on Node 22. The currently installed newer local Node runtime has
an upstream Workbox module-format conflict; `DISABLE_PWA=true npm run build` can be used
for a local application compile, but the Node 22 CI build remains the release gate for
the generated service worker.
