# Blue Whale Consulting — design and build decisions

Nic's brief (Oct 2026) and his answers of 21 Oct 2026 are the source of truth
for structure and copy; this file records how the site is built.

**21 Oct 2026, the merge.** Nic chose the motion-led concept on this branch
(the whale's dive and its journey down the page). Javed preferred the type,
colour and restraint of the `astro-rebuild` branch. This branch now combines
the two: the whale journey rebuilt on the Astro foundation. The React
concept it replaces is tagged `concept-v1-react`.

## Positioning and content

- Blue Whale identifies opportunities, turns them into commercial
  propositions and helps bring them to market. Offers and case studies
  reinforce that one line.
- Navigation: Home, What We Do, Services, Our Work, About, plus the
  **Discuss an Opportunity** button. "Insights" stays out until articles exist.
- **Four offers** (`src/data/offers.ts`), replacing the brief's seven:
  Opportunity & Commercial Feasibility, Growth & Commercial Strategy,
  Product Opportunity Development (POD), Campaigns & Communications. Each has
  its own page with deliverables, timeline and delivery. No pricing.
- **Selected Work** (`src/data/work.ts`): three anonymised cases, each
  The Opportunity → Our Approach → The Outcome. No client names, brands or
  figures beyond Nic's approved outcomes.
- **Client logos** (`src/data/clients.ts`) appear in the Clients section
  only, **never beside the case studies**. On Home they sit at the top of the
  page and the work sits near the bottom, with other sections between them.
- Customer-facing copy written for this build is logged in
  [docs/copy-edits.md](docs/copy-edits.md) for Nic's approval.

## Visual system

- **Colour** comes from the logo; flat fills only, no gradients.
  Midnight `#00151B`, Deep Ocean `#03466E`, Current Blue `#4A95CF`,
  Aqua Mist `#77CFF1`, Paper `#F6F4EF`, Ice `#EAF2F5`.
- **The ocean is made of the logo.** The wave layers are the mark's own
  colours (Aqua behind, Current, then the colour of the water below), so the
  page reads as the whale's world rather than a stock ocean.
- **Type**: Outfit (variable, self-hosted) throughout. One family; size and
  weight make the hierarchy. No italic serif accent lines.
- **Header**: Paper, sticky, Deep primary button. It sits on the sky.
- **Photography**: Nic's studio portrait, cut out and greyscale, on an Aqua
  notched block (`PortraitFrame`). A colour cut-out is kept beside it.
- **Logos**: the 13 client logos are one-colour SVGs traced from the brochure
  and shown in Paper on Deep Ocean via CSS masks. Interim: replace each with
  the brand's official vector when available.

### The journey (Home)

The page is one dive, from the surface to the deep and back up.

| # | Water | Section | Whale |
|---|---|---|---|
| 1 | Paper sky, waves | Hero | Rests beside the headline, waves drift |
| 2 | Deep (pinned) | Selected Clients & Collaborations | Dives through the waterline with a splash; logos arrive like a school of fish |
| 3 | Ice | Opportunity statement (scroll-filled) | Left |
| 4 | Midnight | What We Do | Right |
| 5 | Paper | Our offers | Left |
| 6 | Deep | Approach | Swims along the track as the steps light up |
| 7 | Midnight (deepest) | Selected Work | Right |
| 8 | Ice | Founder | Swims on ahead and gives this section room |
| 9 | Paper sky, waves | Closing | Surfaces at the waterline and spouts |

Each section ends in a slowly drifting wave of the next section's colour.
Water alternates light and dark for rhythm, deepest at the work, rising
through the founder to the surface.

### Rules (from both branches)

- No eyebrow labels: no small uppercase tracked labels above headings.
- No gradients, grain, blur or texture. Flat colour.
- The whale is never cartoonish or bouncy, and **never covers copy or
  controls**. It travels behind the text layer, rests in its own "water"
  column, and crosses at section boundaries where there is no text.
- Don't repeat large versions of the full logo in one viewport.
- No generic consulting-template compositions (headline + giant logo, floating
  UI chips, dashed connectors). The whale journey is the signature.
- Rejected raster mockups and AI logo approximations are not masters.

## Motion vocabulary

1. **Whale journey** (`src/scripts/whale-journey.ts`, GSAP + ScrollTrigger +
   MotionPath): the pinned dive, then the follow-through. It is the only
   pinned moment on the site. Pose maths in `src/lib/whaleChoreography.ts`
   (with a Node test).
2. **Drifting water**: hero wave layers and section wave edges.
3. **Headline reveals**: lines rise out of a mask; the hero's highlight phrase
   flips through three phrases.
4. **Scroll-filled text** on the opening statement.
5. **Approach track** fills and lights steps as the whale swims it.
6. **Fade-ups, accordion, hover states, page transitions.**

Easing for CSS motion is `cubic-bezier(0.22, 1, 0.36, 1)`.
**Reduced motion**: no pinning, no travelling whale; a still whale sits in
every resting point and everything is shown immediately. **No JS**: same.

## Architecture

- Astro static output. GSAP loads on Home only.
- React only for islands with real state (contact form, assessment), loaded
  with `client:visible`.
- Hosting: Cloudflare Pages, a preview URL for every branch.
- Contact form → Pages Function (Turnstile, honeypot, rate limit) → Google
  Apps Script on Nic's account → "Leads" sheet + email. Nic's CRM instead if
  he has one.
- Analytics: GA4 on Nic's account, Consent Mode v2, region-based defaults.
- QR stickers → `/s/<code>` redirects in `public/_redirects` with UTM tags.

## Proofs of concept (preview builds only)

Behind `PUBLIC_SHOW_LABS=true` (`npm run dev:labs`), never in production:
the stats band (two real figures, two examples) and the assessment.

## Build order

The checklist with status is in [docs/build-plan.md](docs/build-plan.md).
