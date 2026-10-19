# Blue Whale Consulting — design and build decisions

Agreed with Javed on 19 Oct 2026 after reviewing Nic's brief. Nic's brief is the
source of truth for page structure and copy; this file records how it is built.

## Positioning and content

- Page structure, headlines and CTAs follow Nic's brief. Body copy gets a light
  tightening pass (fewer repeats of "opportunity" and "commercial"), sent to Nic
  as suggested edits.
- Navigation: Home, What We Do, Products & Services, About, Contact, plus the
  **Discuss an Opportunity** button. "Our Work" and "Insights" stay out until
  real case studies and articles exist.
- Home carries a short founder section for credibility.
- Each of the seven offers gets its own page (`/services/<slug>`) from one
  template: promise, who it's for, 3 deliverables, duration and format, how it
  works, related offer, and a CTA that pre-fills the contact form.

## Visual system

- **Colour** comes from the logo; flat fills only, no gradients.
  Midnight `#00151B`, Deep Ocean `#03466E`, Current Blue `#4A95CF`,
  Aqua Mist `#77CFF1` (the single accent on dark), Paper `#F5F3EE`.
- **Dark hero** with big white type. Content-heavy sections are light for
  readability; dark blocks mark emphasis.
- **Type**: Outfit (variable, self-hosted), a free geometric sans close to
  the Gilroy-style face in the Compally reference Javed chose. Changed from
  Archivo Expanded on 19 Oct 2026.
- **Reference**: Compally (Dribbble, Arif Mahmud). We borrow its structure
  and motion, mapped onto the Blue Whale palette: Aqua plays its lime accent
  role and Current Blue its violet. The ingredients:
  - B&W cut-out portraits rising out of notched colour blocks (`PortraitFrame`)
  - floating white chips with icon discs (`Chip`)
  - dashed blueprint connectors and dots
  - an Aqua highlight block on a key phrase
  - grid-paper cards
  - an accordion with a side panel
  - a loud closing band with a rotating badge
- **Photography**: a stock headshot stands in for Nic until his own photo
  arrives (`src/data/media.ts`). Process his photo the same way: cut out,
  greyscale, WebP.
- No eyebrow labels above headings.
- The whale and ocean journey from the prototype is retired. The mark appears
  in the header, the first-visit intro, the cards and the favicon.

## Motion vocabulary

Restrained and consistent. There is no scroll-jacking or pinning anywhere.

1. **Intro**: on the first home visit of a session, the mark draws in on
   midnight, then flies into the header as the overlay lifts (~1.6s).
2. **Hero build**: the headline rises, the Aqua highlight sweeps in, the
   portrait rises out of its block, then the chips pop in and float and the
   connectors draw.
3. **Headline reveals**: lines rise out of a mask on scroll.
4. **Scroll-filled text**: the opening statement fills in word by word.
5. **Parallax**: oversized flow bands drift behind the Opportunity section.
6. **Count-up stats**: numbers count up when revealed.
7. **Approach track**: the progress line fills and the steps light up as you scroll.
8. **Accordion**: the capabilities panel follows the open row.
9. **Rotating badge** on the closing band.
10. **Page transitions and hover states.**

There is no scroll-locking or pinning anywhere. All motion uses CSS and the
Web Animations API, with no animation library.

Easing everywhere is `cubic-bezier(0.22, 1, 0.36, 1)`. With reduced motion
everything is shown immediately. Without JS, content is simply visible.

## Architecture

- Astro static output. Pages ship the router and motion scripts (~16 KB).
- React is used only for islands with real state: the contact form and the
  assessment, loaded with `client:visible`.
- Hosting: Cloudflare Pages, with a free preview URL for every branch.
- Contact form → Pages Function (Turnstile check, honeypot, rate limit) →
  Google Apps Script on Nic's account → row in a "Leads" sheet + email
  notification. Use Nic's CRM instead if he has one.
- Analytics: GA4 on Nic's Google account, Consent Mode v2, region-based
  defaults (consent required for EU/UK, opt-out elsewhere). Nic to confirm.
- QR stickers point at `/s/<code>` redirects in `public/_redirects`, which add
  UTM tags (`utm_medium=qr`, `utm_content=<code>`). A sheet records which code
  is which sticker design or location.

## Proofs of concept (preview builds only)

Behind `PUBLIC_SHOW_LABS=true` (`npm run dev:labs`), never in production.
Each block carries an "Example — Nic to supply" tag, so Nic can see what
content it needs:

- **Partner logo strip** under the hero (fictional names)
- **Stats band** with count-up. "5 industries" is real; the rest are examples.
- **Assessment**: 4–5 questions that recommend one of Nic's offers and
  pre-fill the contact form. Placeholder questions until Nic writes real ones.
  It gives a recommendation, never a numeric score.
- **Partner grid page**: obviously fictional placeholder names, captioned
  "This is how your partners would appear".

## Build order

The step-by-step checklist with status is in [docs/build-plan.md](docs/build-plan.md).
