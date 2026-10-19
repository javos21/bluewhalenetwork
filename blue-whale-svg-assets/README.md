# Blue Whale Consulting — SVG Asset Pack

These SVGs were reconstructed from the supplied transparent PNG and are intended for the Blue Whale website animation work.

## Files

- `blue-whale-logo-master.svg` — faithful full logo vector. Use this as the static/source-of-truth SVG.
- `blue-whale-logo-animatable.svg` — full logo with stable IDs, individual wordmark letters, independent colored flow paths, reveal clips, and a hidden water-spout group.
- `blue-whale-mark.svg` — isolated whale/flow mark with a cropped viewBox.
- `blue-whale-mark-animatable.svg` — isolated mark prepared for hero/scroll animation. Includes independent flow paths, reveal clips, and hidden spout.
- `blue-whale-spout-overlay.svg` — standalone visible spout aligned to the same mark coordinate system.
- `blue-whale-animation.css` — optional helper styles and reduced-motion baseline.

## Brand colors sampled from the supplied logo

- Primary deep blue: `#03466E`
- Secondary blue: `#4A95CF`
- Light water blue: `#77CFF1`
- Consulting text: `#00151B`

## Important animation IDs

Mark:
- `#blue-whale-mark`
- `#whale-primary-mark`
- `#wave-medium-upper`
- `#wave-light`
- `#wave-medium-lower-left`
- `#wave-medium-lower-right`

Water spout:
- `#spout`
- `#spout-center`
- `#spout-left`
- `#spout-right`
- `#spout-drop-1` through `#spout-drop-4`

The spout group is translated to the upper front body at rendered origin `(357.5, 157)`. Keep the group transform synchronized across the full logo, mark-only, and standalone overlay assets.

Wave reveal rectangles:
- `#reveal-wave-medium-upper`
- `#reveal-wave-light`
- `#reveal-wave-medium-lower-left`
- `#reveal-wave-medium-lower-right`

Wordmark groups:
- `#blue-whale-wordmark`
- `#consulting-wordmark`

Every letter in `BLUE WHALE` and `CONSULTING` is also an individual path for staggered reveals.

## Seamless-mark decision

The deep-blue whale + its primary flowing form remains **one path** (`#whale-primary-mark`) so the signature silhouette is not broken apart.

Only the already visually separate colored flow bands are individual animation paths. That preserves the original mark at rest while still giving us enough independent layers for subtle current/wave movement.

## GSAP usage note

For direct DOM animation, **inline** `blue-whale-logo-animatable.svg` or `blue-whale-mark-animatable.svg` in the page. If it is loaded with a plain `<img>` tag, GSAP in the parent page cannot directly select the internal path IDs.

Example selectors:

```js
const tl = gsap.timeline();

tl.to("#wave-medium-upper", { x: 4, duration: 1.8, yoyo: true, repeat: -1 }, 0)
  .to("#wave-light", { x: -3, duration: 2.2, yoyo: true, repeat: -1 }, 0)
  .to("#wave-medium-lower-left", { x: 5, duration: 2.5, yoyo: true, repeat: -1 }, 0);
```

Show the spout:

```js
gsap.set("#spout", { opacity: 1 });

gsap.fromTo(
  ["#spout-center", "#spout-left", "#spout-right"],
  { strokeDasharray: 100, strokeDashoffset: 100 },
  { strokeDashoffset: 0, duration: 0.55, stagger: 0.06 }
);
```

For the scroll journey, animate `#blue-whale-mark` as a single branded object along a GSAP MotionPath. The individual flow bands can continue their subtle motion while the whole mark dives/rotates.

## Reconstruction note

The original source was a 500×500 transparent PNG, not a native vector file. The paths in this pack are true vector outlines and do not embed the raster image. Text is outlined, so there is no font dependency.
