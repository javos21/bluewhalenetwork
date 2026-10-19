# Blue Whale Consulting — bluewhalenetwork.com

Marketing and lead-generation site for Blue Whale Consulting, built to Nic's
October 2026 website brief. Static Astro site, deployed on Cloudflare Pages.

## Run locally

Node.js 22.12+.

```sh
npm ci
npm run dev        # http://localhost:4321
npm run dev:labs   # same, with preview-only concepts under /labs
npm run build      # static output in dist/
npm run preview    # serve the build
```

## Structure

| Path | What it is |
|---|---|
| `src/pages/` | One file per page. `labs/` builds only when `PUBLIC_SHOW_LABS=true`. |
| `src/layouts/BaseLayout.astro` | `<head>`, SEO tags, page transitions, header and footer. |
| `src/components/brand/` | The mark (inline SVG, recolourable) and the header lockup. |
| `src/components/motion/` | `RevealHeading` (masked line reveal) and `FlowDivider` (logo flow lines). |
| `src/scripts/` | `motion.ts` (scroll reveals) and `hero-intro.ts` (GSAP signature moment). |
| `src/styles/global.css` | Design tokens, typography utilities, buttons, motion CSS. |
| `src/data/site.ts` | Navigation and site-wide copy. |
| `blue-whale-svg-assets/` | Logo vector sources. The refined version is awaiting Nic's sign-off. |

## Build flags

| Variable | Value | Effect |
|---|---|---|
| `PUBLIC_SITE_ENV` | `production` | Allows indexing. Every other build gets `noindex`. |
| `PUBLIC_SHOW_LABS` | `true` | Builds the `/labs` proofs of concept. A production build fails if both are set. |

Deployment and the launch-day domain checklist are in [docs/deploy.md](docs/deploy.md).
Design and motion decisions are in [design.md](design.md).

The earlier Vite/React whale prototype lives on the `codex/landing-concept-review`
branch; its notes are kept in `docs/prototype-notes/`.
