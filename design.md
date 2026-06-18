# BlueWhale Network — Design System

**Inspired by:** WealthWise Financial Consulting (Dribbble reference)
**Stack:** Astro 5 + Payload CMS 3 + Tailwind CSS 3
**Style:** Clean, light, modern fintech — periwinkle-blue accent on soft grey/white

---

## 1. Color Palette

| Token            | Hex       | Usage                                         |
|------------------|-----------|-----------------------------------------------|
| `blue`           | `#5E78EE` | Primary accent, CTAs, featured card, links    |
| `blue-dark`      | `#4A63D6` | Button hover                                  |
| `blue-light`     | `#EEF1FE` | Soft tints, pills                             |
| `ink`            | `#0A1236` | Headlines, body text (near-black navy)        |
| `ink/55–70`      | —         | Secondary / muted text (opacity steps)        |
| `cloud`          | `#F6F6F6` | Page background                               |
| `cloud-card` / white | `#FFFFFF` | Cards, surfaces                          |

Single accent system — periwinkle blue does all the lifting against a light grey/white canvas. No gold, no dark theme.

---

## 2. Typography — **DM Sans** (single family)

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&display=swap');
```

| Role       | Size  | Line-height | Weight       |
|------------|-------|-------------|--------------|
| Header 1   | 80px  | 90px        | 900 (Black)  |
| Header 2   | 60px  | 72px        | 900 (Black)  |
| Header 3   | 50px  | 56px        | 900 (Black)  |
| Header 4   | 32px  | 40px        | 900 (Black)  |
| Header 5   | 24px  | 28px        | 900 (Black)  |
| Body 1     | 16px  | 24px        | 400 (Regular)|
| Body 2     | 14px  | 18px        | 400 (Regular)|
| Caption    | 14px  | 18px        | 700 (Bold)   |

Headings are **black-weight (900)** and tightly tracked — the defining typographic move of this design. Headlines scale down responsively (e.g. H1 → ~44px on mobile).

---

## 3. Shape & Elevation

- **Pill buttons** — fully rounded (`border-radius: 999px`); primary blue buttons carry a circular arrow chip on the right.
- **Cards** — `border-radius: 24px`, soft shadow `0 8px 30px rgba(10,18,54,0.06)`.
- **Images** — large rounded frames (`28–32px`), often overlapping for depth.
- **Soft lavender radial glow** behind the hero.

---

## 4. Page Sections (top → bottom)

1. **Navbar** — leaf logo + wordmark left, centered links (Home, Team, Blog, About Us), outlined **Let's Talk** pill right. Translucent blur appears on scroll.
2. **Hero** — black-weight headline left + italic note + **Book Appointment** pill; overlapping photo composition right with a vertical "Scroll" indicator.
3. **Who We Are** — image left; eyebrow, bold statement, **Learn More** link, and a statistics card (`$50M+`, `20%`, `3X`) right.
4. **Take Control** — section heading + carousel arrows; horizontally-scrollable focus cards. First card is **filled blue (featured)**, the rest white. Each has a tag pill, title, description, image, and an arrow chip.
5. **FAQ** — sticky heading left ("Got Questions? We've Got **Answers.**"); `<details>` accordion right, first item open, blue circular toggle.
6. **Real Stories** — heading left; featured testimonial photo with a floating name pill + stacked smaller photos right, carousel arrows.
7. **CTA Banner** — full-width blue rounded card with a decorative sprout/leaf pattern and a white **Book Appointment** pill.
8. **Newsletter** — heading left, pill-shaped email input + **Subscribe** button right.
9. **Footer** — logo + tagline, two link columns, copyright + legal links.

---

## 5. Interactions

| Element              | Behaviour                                          |
|----------------------|----------------------------------------------------|
| Navbar               | Translucent `backdrop-blur` + shadow after 24px    |
| Section entry        | Fade-up via IntersectionObserver (`.reveal`)       |
| Take Control cards   | Horizontal scroll, prev/next circle buttons        |
| FAQ items            | Native `<details>` expand, toggle icon rotates 180° |
| Buttons / links      | Color shift; arrow links nudge right on hover       |

---

## 6. Responsive

| Breakpoint | Behaviour                                              |
|------------|--------------------------------------------------------|
| < 640px    | Single column, hamburger drawer, hero stacks, H1 ~44px |
| 640–1024px | Two-column sections begin, scaled headings             |
| > 1024px   | Full layout, max content width 1200px                  |

---

## 7. CMS Content Model (Payload CMS)

**Collections:** `FocusAreas` (Take Control cards), `Faqs`, `Testimonials`, `BlogPosts`, `Media`.
**Globals:** `SiteSettings`, `Navigation`, `HomePage` (hero, who-we-are stats, CTA, newsletter), `Footer`.

See [payload/payload.config.ts](payload/payload.config.ts). Static seed data lives in [src/data/site.ts](src/data/site.ts) and is swappable for live CMS data via [src/lib/payload.ts](src/lib/payload.ts).

---

## 8. Component Map

| Section        | File                                            |
|----------------|-------------------------------------------------|
| Navbar         | `src/components/layout/Navbar.astro`            |
| Hero           | `src/components/sections/Hero.astro`            |
| Who We Are     | `src/components/sections/WhoWeAre.astro`        |
| Take Control   | `src/components/sections/TakeControl.astro`     |
| FAQ            | `src/components/sections/Faq.astro`             |
| Real Stories   | `src/components/sections/Stories.astro`         |
| CTA Banner     | `src/components/sections/CtaBanner.astro`       |
| Newsletter     | `src/components/sections/Newsletter.astro`      |
| Footer         | `src/components/layout/Footer.astro`            |
| Logo / Images  | `src/components/ui/Logo.astro`, `ImagePlaceholder.astro` |

Placeholder imagery uses `ImagePlaceholder.astro` (gradient + figure motif). Replace with real `<img>` / Payload `media` uploads when assets are ready.
