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
- **Type**: Archivo (variable, self-hosted). Headlines at 125% width,
  weight 700–800, which echoes the wide wordmark. Body text uses Archivo at normal width.
- No eyebrow labels above headings. No stock photography; real photography
  only when it exists.
- The whale and ocean journey from the prototype is retired. The mark appears
  in the header, the hero signature moment and the favicon.

## Motion vocabulary

Restrained and consistent. There is no scroll-jacking or pinning anywhere.

1. **Signature moment**: on the first home visit of a session, the flow bands
   draw in left to right, the whale settles, and the headline rises (~1.5s, GSAP).
2. **Headline reveals**: lines rise out of a mask on scroll (CSS, 700ms).
3. **Flow-line dividers**: three strokes from the logo curves draw on scroll.
4. **Page transitions**: Astro ClientRouter cross-fade with a small rise.
5. **Hover states**: arrows nudge 4px, cards lift 3px, colour shifts in 200ms.

Easing everywhere is `cubic-bezier(0.22, 1, 0.36, 1)`. With reduced motion
everything is shown immediately. Without JS, content is simply visible.

## Architecture

- Astro static output. Most pages ship only the router and reveal script
  (~16 KB). GSAP loads on the home page only.
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

Behind `PUBLIC_SHOW_LABS=true`, never in production:

- **Assessment**: 4–5 questions that recommend one of Nic's offers and
  pre-fill the contact form. Placeholder questions until Nic writes real ones.
  It gives a recommendation, never a numeric score.
- **Partner grid**: obviously fictional placeholder names, captioned
  "This is how your partners would appear".

## Build order

1. Shell: tokens, type, layout, nav/footer, motion, previews (done)
2. Home
3. Products & Services + 7 offer pages
4. Contact + form pipeline
5. `/opportunity` + QR redirects
6. What We Do, About
7. Labs: assessment, partner grid
8. GA4 + consent, SEO, accessibility pass, real-phone testing
