# Logo refinement and ocean hero study

Open `/hero-study` for the ocean concept and a same-size comparison of original and refined logos. The animation lab continues using the original assets for baseline comparison.

`blue-whale-svg-assets/blue-whale-logo-refined.svg` is a separate review candidate, not an exact reproduction or approved replacement. The five mark contours now use deliberate cubic Bézier curves. The BLUE WHALE letters are rebuilt from geometric paths; CONSULTING uses clean stroked outlines. Both groups retain individual letter IDs and have no font dependency. The spout origin is explicitly `(357.5, 157)`.

`BlueWhaleLogo` accepts `artwork="refined"`. The mark variant crops the same master and removes wordmark groups. Namespaced IDs and data selectors are retained.

`Ocean.tsx` contains three inline SVG layers with wide overscan. GSAP moves these layers over 8, 10, and 12 seconds with sine easing. A nested wrapper gives the whale a 6px breath independently from its scroll dive. The front water layer masks the whale naturally through stacking order. The scroll timeline travels downward, rotates 24 degrees, and fades the wake and submerged whale. Scrolling upward restores it.

GSAP matchMedia rebuilds travel for desktop/mobile and skips all animations when reduced motion is enabled. Contexts are reverted on unmount. Native browser scrolling is retained. No canvas, video, smooth-scroll package, or raster imagery is used.

Review silhouette fidelity, lettering proportions, whale visibility at the waterline, and timing of submersion. The hero copy and editorial typography are exploration candidates. Contact details remain unconfirmed; the conversation link points to an honest placeholder section.

## Second refinement pass

Ocean contours are flatter and use muted distance colors. The whale rises 9–13px over 4.6 seconds and settles over 5.4 seconds. A local two-line ripple expands and dissolves over 6 seconds with a 4-second rest. Scroll pauses and resets the idle wrapper so the reversible dive does not inherit an arbitrary idle angle. It starts with a slight rise, then a broad 18–29 degree turn. A second decorative instance, identically positioned and clipped below the waterline, briefly reveals the submerged silhouette at 20% opacity before it fades. Both instances share the same scroll transforms. Reduced motion skips all animation and leaves the submerged instance hidden.

The supporting copy now describes commercial opportunities, strategy, partnerships, and operations directly. Refined lettering widths were adjusted closer to the original; wave contours received small taper adjustments.
