# Blue Whale — landing concept review

Motion-led landing page concept for Blue Whale Consulting. This review branch
replaces the older Astro implementation with the current React, TypeScript,
Vite and GSAP prototype. The existing `main` branch is unchanged.

## Run locally

Use Node.js 22.12+ (or 20.19+).

```sh
npm ci
npm run dev
```

Open **http://localhost:5173/hero-study** for the landing concept, or
**http://localhost:5173/animation-lab** for the individual motion experiments.

## Checks

```sh
npm run build
npm run lint
node --test src/lib/whaleChoreography.test.mjs
```

The motion test command uses Node.js 22.18+ for native TypeScript support.
`npm run preview` serves a local production build after `npm run build`.

## Review notes

- The whale travels from the hero dive through partners and alternating sections.
- Section boundaries use animated, flat-colour SVG waves.
- Reduced-motion visitors receive static decorative whales.
- Photography, service icons and partner marks are placeholders.
- Service copy and assessment scoring are illustrative, not approved business claims.
- Assessment and contact forms are frontend demos only: no data is sent or saved,
  no email is delivered, and there is no backend integration.

Design direction and motion notes are in `design.md` and `docs/`.
