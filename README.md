# Blue Whale Consulting — bluewhalenetwork.com

Marketing and lead-generation site for Blue Whale Consulting, built to Nic's
October 2026 website brief. Static Astro site, deployed on Cloudflare Pages.

## Run locally

Node.js 22.22+ (Astro 7 requirement).

```sh
npm ci
npm run dev        # http://localhost:4321
npm run dev:labs   # same, with the preview-only proofs of concept
npm run build      # static output in dist/
npm run preview    # serve the build
```

## Structure

| Path | What it is |
|---|---|
| `src/pages/` | One file per page. `labs/` builds only when `PUBLIC_SHOW_LABS=true`. |
| `src/layouts/BaseLayout.astro` | `<head>`, SEO tags, page transitions, header and footer. |
| `src/components/brand/` | The mark (inline SVG, recolourable) and the header lockup. |
| `src/components/motion/` | `RevealHeading`, `ScrollFill` and `FlowDivider`. |
| `src/components/ui/` | `PortraitFrame`, `Chip` and `Icon`. |
| `src/components/labs/` | Preview-only proof-of-concept blocks. |
| `src/scripts/` | `motion.ts` (reveals, counters, scroll fill, parallax, progress) and `hero-intro.ts` (first-visit intro). |
| `src/data/` | All copy and content: site, home, offers, capabilities, media and labs. |
| `src/styles/global.css` | Design tokens, typography utilities, buttons, motion CSS. |
| `src/data/site.ts` | Navigation and site-wide copy. |
| `blue-whale-svg-assets/` | Logo vector sources. The refined version is awaiting Nic's sign-off. |

## Build flags

| Variable | Value | Effect |
|---|---|---|
| `PUBLIC_SITE_ENV` | `production` | Allows indexing. Every other build gets `noindex`. |
| `PUBLIC_SHOW_LABS` | `true` | Builds the proofs of concept. `npm run dev:labs` / `build:labs` set it through `.env.labs`. A production build fails if both are set. |

Deployment and the launch-day domain checklist are in [docs/deploy.md](docs/deploy.md).
Design and motion decisions are in [design.md](design.md).

The earlier Vite/React whale prototype lives on the `codex/landing-concept-review`
branch; its notes are kept in `docs/prototype-notes/`.
