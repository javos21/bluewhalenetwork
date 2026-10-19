# Hero motion sequence

The `/hero-study` experiment uses one whale mark throughout the hero and partner section.

- On desktop, the whale starts on the left, above the larger SVG ocean. Copy sits on the right.
- On entry, the whale gently rises into view, its flow bands follow, and the heading, description and action reveal in sequence. There is no blocking loading screen.
- After entry, the whale stays still. Only the three ocean layers provide slow, opposing idle currents; the whale has no bobbing or hovering loop in either section.
- The scene pins during a smoothed scroll sequence (2.6 viewport heights on desktop, 1.7 on mobile). Copy clears first; only then does the whale move into the cleared space, pitch downward, and travel underwater toward the right of the partner scene. The scenery moves from hero to partners inside the pin, then releases to normal page scrolling. No wheel/touch events are intercepted.
- The dive follows one continuous cubic SVG motion path, pitches to 48 degrees, and levels out underwater. The idle ocean pauses during the dive. A high-contrast SVG splash and expanding rings mark the water entry. All four flow bands remain visible; navy artwork contrasts against the light-blue partner section. A separate facing wrapper turns 180 degrees around its vertical axis so the whale looks left toward incoming partner marks.
- Reverse scrolling reverses the choreography. Geometry is recalculated on responsive refresh.
- Splash onset and placement are measured from the transformed whale head and actual SVG wave fills at the current viewport size, not fixed breakpoint timestamps. Its animation scrubs relative to first contact; resizing invalidates contact and reverse scrolling resets it.
- Desktop delays pitching until timeline position 0.54, after the horizontal approach, reaching 84 degrees at 0.76. Mobile retains its earlier turn (0.34–0.64) for its shorter approach. Both retain the underwater hold until 0.96.
- The dive pitches to 84 degrees and holds that near-vertical pose into the partner scene, leveling out only near arrival. Three thin, flat-colour dashed trails follow the rear fin underwater and fade before the whale settles. Their movement shares the swimming clock; reduced motion leaves them hidden.
- During the dive and underwater travel, a real-time 1.8-second tail stroke flexes the rear silhouette by up to 24 SVG units, tapering to zero at the shoulder. The scroll journey smoothly gates its amplitude at departure and arrival, rather than scrubbing each beat. The tail settles into the original outline on arrival; there is no opening or partner idle swimming loop. It pauses in hidden tabs, is cleaned up on responsive rebuilds, and is skipped for reduced motion.
- Mobile stacks the opening copy and whale. Reduced motion skips the entrance and scroll choreography and shows a static left-facing whale in the partner scene.

Eight partner marks enter by row into a two-column, four-row grid. Desktop places the full whale beside the grid; mobile places it above the grid. Partner marks remain explicitly labelled placeholders, not assertions of business relationships. No eyebrow headers are used.
