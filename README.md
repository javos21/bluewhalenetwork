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
| `src/components/motion/` | `RevealHeading` and `ScrollFill`. |
| `src/components/ocean/` | The whale (`Whale`), wave layers, wave edges and the `DepthSection` wrapper for the Home journey. |
| `src/components/ui/` | `PortraitFrame` and `Icon`. |
| `src/components/labs/` | Preview-only proof-of-concept blocks. |
| `src/scripts/` | `motion.ts` (reveals, counters, scroll fill, parallax, progress) and `whale-journey.ts` (the Home whale journey, GSAP). |
| `src/data/` | All copy and content: site, home, offers, work, clients, capabilities, media and labs. |
| `public/logos/clients/` | Client logos (one-colour SVG). Replace with official vectors, same filenames. |
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

## Checks

```sh
npm run build
node --test src/lib/whaleChoreography.test.mjs   # Node 22.18+
```

This branch combines the whale-journey concept Nic chose with the Astro build
(21 Oct 2026). The earlier Vite/React version is tagged `concept-v1-react`;
its notes are in `docs/prototype-notes/`.
