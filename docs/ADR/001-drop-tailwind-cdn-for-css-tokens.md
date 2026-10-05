# ADR 001 — Replace the Tailwind Play CDN with a token-based stylesheet

- **Status**: Accepted
- **Decided by**: Sebastian Romero Laguna
- **Date**: 2026-10-05
- **Tickets**: none

## Context
`index.html` loaded Tailwind through `cdn.tailwindcss.com`, which compiles CSS in the browser on every visit, logs a "not for production" warning, and mixed utility classes with ~700 lines of inline CSS and ad-hoc `style=""` attributes. The printable CV used a separate, unrelated stylesheet, so colours and spacing drifted between the two pages.

## Options considered
1. **Keep the Play CDN** — zero work. Pro: nothing to change. Con: runtime compiler on a static site, unsupported for production, two unrelated styling systems.
2. **Add a Tailwind build step** — compile utilities ahead of time. Pro: keeps utility classes. Con: introduces Node tooling and a build to a repo whose whole point is "edit `cv.json`, push".
3. **Plain CSS with shared tokens** — one `tokens.css` of custom properties consumed by `site.css` and `cv.css`. Pro: no dependency, no build, both pages share one palette and scale. Con: component classes must be hand-written.

## Decision
**Option 3**, because the site is two static pages with a small number of components, and the only thing worth sharing between them is the token set. A build step buys nothing here, and the runtime CDN was the one real production defect.

## Consequences
- Positive: no external CSS or Day.js dependency, no console warning, one place to change the palette, the CV view stays plain for ATS and OCR parsers.
- Negative / accepted cost: new components need a class in `site.css` rather than a utility string.
- Follow-ups: none.
