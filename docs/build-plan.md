# Build plan

The working checklist for the Blue Whale site. Tick items off as they land on
`astro-rebuild`. Decisions behind the plan are in [design.md](../design.md);
copy changes awaiting Nic are in [copy-edits.md](copy-edits.md).

Status key: ✅ done · 🔄 in progress · ⬜ not started · ⏸ blocked on Nic

---

## 1. Site shell ✅

- ✅ Astro static site with pinned dependencies
- ✅ Design tokens from the logo, Archivo Expanded headlines, dark hero
- ✅ Header with the Discuss an Opportunity button (stays visible on mobile), mobile menu, footer
- ✅ Motion: logo draw-in, masked headline reveals, flow-line dividers, page transitions, hover states
- ✅ Reduced-motion support and a no-JS fallback
- ✅ Build flags: `/labs` in preview builds only, `noindex` on every non-production build
- ✅ Placeholder pages for every nav item, using Nic's headlines
- ⬜ Connect the repo to Cloudflare Pages ([deploy.md](deploy.md)) — **Javed**

**Done when:** every nav link loads a page, and a preview link can be shared.

## 2. Home ✅ (design pass pending)

- ✅ Hero, The Opportunity, What We Do, Our Solutions, Our Approach, Founder, Closing CTA
- ✅ Shared offer data for all seven offers
- ✅ Copy edits logged for Nic
- 🔄 **2b. Visual depth pass**: the site currently reads as flat. Fix this before step 3, so the offer pages inherit the improved look.

**Done when:** a visitor can answer "what does Blue Whale do?" in the first screen, and Javed signs off on the look.

## 3. Products & Services + offer pages ⬜

- ⬜ `/services` overview listing all seven offers, with Ongoing Communications Support visually secondary
- ⬜ Offer page template: promise, who it's for, 3 deliverables, duration and format, how it works (3 steps), related offer, CTA that pre-fills the contact form
- ⏸ Real deliverables, durations and formats (draft copy until Nic answers)
- ⏸ Whether Campaigns and Ongoing Communications merge

**Done when:** every offer has its own page, and every page leads to an enquiry.

## 4. Contact + lead pipeline ⬜

- ⬜ Contact form as a React island with the brief's fields; area of interest pre-filled from `?interest=`
- ⬜ Cloudflare Pages Function: validation, Turnstile, honeypot, rate limit
- ⬜ Google Apps Script on Nic's account: append a row to the "Leads" sheet and email the notification
- ⬜ Confirmation message from the brief, plus accessible error messages
- ⬜ Privacy notice and consent wording on the form
- ⏸ Does Nic use a CRM? (if so, send leads there instead)

**Done when:** a test enquiry from a phone arrives in Nic's inbox and in the sheet.

## 5. QR landing page + redirects ⬜

- ⬜ `/opportunity`: mobile-first, "Choose your starting point", five routes into the offers
- ⬜ `public/_redirects` with `/s/<code>` → `/opportunity?utm_…` for each sticker
- ⬜ QR code image files for each code, plus a sticker register (code → design/location)
- ⬜ Sticker artwork: "WHAT IF THERE'S A BETTER WAY?", the QR code and a small Blue Whale mark

**Done when:** scanning a printed test sticker lands on `/opportunity` and the visit shows up in GA4 as `medium=qr`.

## 6. What We Do + About ⬜

- ⬜ What We Do: four capability sections, each with areas of work and its CTA
- ⬜ About: positioning copy and the founder profile
- ⏸ Photo of Nic (optional, if a good one exists)

## 7. Labs: proofs of concept (preview only) ⬜

- ⬜ Assessment: 4–5 placeholder questions that recommend an offer and pre-fill the contact form
- ⬜ Partner grid: obviously fictional placeholder names, captioned as a concept

**Done when:** both are visible on preview links and absent from a production build.

## 8. Launch readiness ⬜

- ⬜ GA4 with Consent Mode v2 (region-based) and events for CTA clicks, form start and form submit
- ⏸ GA4 property created on Nic's Google account, with Javed as admin
- ⬜ Titles, meta descriptions, Open Graph image, sitemap, `robots.txt`
- ⬜ Accessibility pass (WCAG 2.1 AA): contrast, keyboard use, form labels, focus states
- ⬜ Performance check on mid-range Android over 4G
- ⬜ Real-phone test of the full QR → enquiry journey
- ⏸ Launch day: DNS switch on Nic's GoDaddy account ([deploy.md](deploy.md))

## Later / not in v1

- Our Work (needs real case studies from Nic)
- Insights (needs articles)
- Partner grid on the live site (needs real partners, with logo permission)
- Assessment on the live site (needs Nic's real questions)

## Waiting on Nic

The questions were sent 19 Oct 2026:

1. What POD stands for
2. Deliverables, duration and format for each offer
3. Whether Campaigns and Communications merge
4. Real case studies
5. Partners we can name
6. Sign-off on the refined logo
7. Email on the domain (MX records)
8. CRM
9. Analytics consent approach
10. GA4 property
11. Location and target market
