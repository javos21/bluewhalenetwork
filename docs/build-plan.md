# Build plan

The working checklist for the Blue Whale site, on `codex/landing-concept-review`.
Decisions are in [design.md](../design.md); copy awaiting Nic is in
[copy-edits.md](copy-edits.md).

Status key: ✅ done · 🔄 in progress · ⬜ not started · ⏸ blocked on Nic

**21 Oct 2026:** Nic chose the whale-journey concept. The Astro build moved onto
this branch and the journey was rebuilt on it (old React concept: branch
`archive/concept-v1-react`). Nic's answers, brochure and headshot are in.

---

## 1. Site shell ✅

- ✅ Astro static site with pinned dependencies (GSAP 3.15.0 added)
- ✅ Brand tokens, Outfit, Paper header with Discuss an Opportunity, footer with contact details
- ✅ Reduced-motion support and a no-JS fallback (still whales)
- ✅ Build flags: `/labs` in preview builds only, `noindex` on every non-production build
- ⬜ Connect the repo to Cloudflare Pages ([deploy.md](deploy.md)) — **Javed**

## 2. Home: the whale journey ✅

- ✅ Pinned dive from the surface into the Clients section, with splash and school-of-fish logos
- ✅ Whale follows resting points through every section; crosses at boundaries, never over copy
- ✅ Swims the Approach track; surfaces and spouts at the closing
- ✅ Sections: Clients, Opportunity, What We Do, Offers, Approach, Selected Work, Founder, Closing
- ✅ Nic's real headshot (cut out, greyscale)
- 🔄 Javed's and Nic's review on the preview link

## 3. Services + offer pages ✅

- ✅ The 4 offers from Nic's answers (replacing the brief's 7)
- ✅ `/services` overview and one page per offer: promise, who it's for, deliverables, timeline, delivery, related work, other offers
- ⏸ Nic to approve the new customer-facing offer copy ([copy-edits.md](copy-edits.md))

## 3b. Our Work ✅

- ✅ `/work` with three anonymised cases (Opportunity → Approach → Outcome); in the nav
- ⏸ Nic to supply the challenge line for Case 3 (drafted for now)

## 3c. Clients ✅

- ✅ 13 logos from the brochure, one-colour, in the Clients section only
- ⬜ Replace the traced logos with official vector files as they come in

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

## 6. What We Do + About ✅

- ✅ What We Do: four capability sections, each with areas of work and its CTA
- ✅ About: positioning copy and the founder profile with the real headshot
- ⏸ 2–3 working shots of Nic (optional)

## 7. Labs: proofs of concept (preview only) ⬜

- ⬜ Assessment: 4–5 placeholder questions that recommend an offer and pre-fill the contact form

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

- Insights (needs articles)
- Assessment on the live site (needs Nic's real questions)
- Named testimonials and fuller case studies, as permissions come in

## Waiting on Nic

Answered 21 Oct 2026: what POD stands for, offers (deliverables, timing,
format), Campaigns + Communications merged, case studies, client logos,
headshot, location and target market (T&T and diaspora markets).

Still open:

1. Approval of the new offer and case-study copy ([copy-edits.md](copy-edits.md))
2. Sign-off on the refined logo
3. Email on the domain (MX records)
4. CRM
5. Analytics consent approach and GA4 property
6. Remaining figures for the stats band
7. Official vector files for client logos (optional; traced versions in use)
