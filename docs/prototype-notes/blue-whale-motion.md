# Blue Whale motion system — lab notes

## Scope

`/animation-lab` is an isolated React/GSAP test environment. It does not implement or replace a production homepage. The workspace contained no application when this lab was created, so the root route is only a neutral placeholder.

## SVG structure

The source-of-truth animation assets remain untouched in `blue-whale-svg-assets/`. `BlueWhaleLogo.tsx` imports the full or mark-only animatable SVG as raw text and places the SVG inline so GSAP can address its paths.

Because a lab page renders several copies of the same SVG, the component namespaces every `id` and matching clip-path reference per instance. It also adds `data-bw-id` with the source ID. This avoids invalid duplicate IDs while preserving stable animation selectors.

Important source IDs:

- `blue-whale-mark`: full visual mark group
- `whale-primary-mark`: deep-blue whale and its continuous primary flow form
- `wave-medium-upper`, `wave-light`, `wave-medium-lower-left`, `wave-medium-lower-right`: independently animated flow bands
- `spout`, `spout-center`, `spout-left`, `spout-right`, `spout-drop-1` through `spout-drop-4`
- `blue-whale-wordmark` and `consulting-wordmark`

At rest, no geometry or color is changed from `blue-whale-logo-animatable.svg`.

The spout group carries `transform="translate(240 60)"`. Its paths were originally authored around the raised tail/fin at `(117.5, 97)`; the translation places the rendered stream origin at `(357.5, 157)`, on the upper front body/blowhole area.

## GSAP architecture

`src/lib/gsap.ts` is the single plugin-registration point for `ScrollTrigger` and `MotionPathPlugin`. React animation code uses `useGSAP()` with a component scope. Every GSAP context and media-query context is reverted on unmount, which prevents duplicate triggers under React Strict Mode and hot reload.

Selectors live in `animations/selectors.ts` and use `data-bw-id`, so an experiment only affects the SVG inside its scoped component.

## Experiments and timing

### 01 — Logo Idle

- Whale: `y: -2.5px`, `rotation: -0.25deg`, 6.8 seconds, `sine.inOut`, yoyo loop.
- Flow bands: independent x/y travel of roughly 1–3.5px over 5.6–7.7 seconds.
- Disabled completely for reduced motion.

### 02 — Whale Spout

- Center stroke draw: 0.48 seconds.
- Branch draw: 0.42 seconds with 0.06-second stagger.
- Droplet reveal: 0.28 seconds; restrained fall/fade over 0.7 seconds.
- Stream fade begins at 1.02 seconds. Total visible sequence is about 1.5 seconds.
- Replay kills any active timeline before starting a new one.

### 03 — Logo-to-Dive Transition

A reversible, `scrub: true` timeline runs across a 220vh stage. The logo begins untouched. The whale and bands first move together, then bands lag, stretch, and progressively fade while the primary whale form angles and exits down/right. The wordmarks remain in place. A bottom rule visualizes scroll progress.

This is the highest-priority visual review. Exact detachment timing, whale scale, and the amount of retained wake will need judgment against the future hero composition.

### 04 — Scroll Journey

A mark-only SVG follows an invisible cubic Bézier path through six neutral placeholder panels. `MotionPathPlugin` aligns the mark to the path and applies a small automatic rotation offset. `ScrollTrigger` maps page scroll directly to path progress and reverses naturally when scrolling upward.

## Responsive strategy

GSAP `matchMedia()` selects separate desktop (1024px+), tablet (640–1023px), and mobile (under 640px) paths and scales. Mobile travel stays nearer the outer edges and uses a smaller mark. CSS uses the same breakpoints to reduce canvas height, typography, and lab spacing. The layout should be reviewed at 375px, 768px, 1024px, and 1440px before production integration.

## Reduced motion

Under `prefers-reduced-motion: reduce`:

- Idle and spout playback are disabled.
- The dive stage becomes a static, non-pinned logo.
- The journey mark remains at a clean static start position.
- All section labels and page content remain visible and understandable.

## Known issues and review questions

- The real production app and homepage were not present, so global header overlap, actual hero proportions, section stacking contexts, and production route integration remain untested.
- The SVGs were reconstructed from a raster original. Brand owners should approve the static vector before the motion work is promoted.
- The primary path intentionally includes both the whale and its deep-blue flow silhouette. A truly independent whale body would require a revised source asset; the current transition works by treating that silhouette as the swimming form.
- Motion-path curves are placeholders sized to the lab panels, not final page geometry.
- Review whether the secondary flow bands should linger longer as a wake during the dive.
- Review the dive angle and scale first; that handoff determines whether the recurring-whale concept reads as sophisticated rather than illustrative.
