# Blue Whale Consulting Design System

> **Depth of expertise. Forward momentum.**

This document is the source of truth for the Blue Whale Consulting website’s visual identity and interface design. The system takes its cues from the supplied logo and combines **premium maritime character** with **modern technology and consulting**—without drifting into generic corporate blue or literal nautical decoration.

Current user preferences and design constraints are recorded in [design.md](design.md) and take precedence over this earlier guidance. The first hero mockups were rejected for lacking personality.

The core palette is drawn from the logo:

| Role | Color | Hex | Use |
|---|---|---:|---|
| Deep Ocean | Logo primary | `#03466E` | Primary brand color, headings, buttons |
| Current Blue | Logo secondary | `#4A95CF` | Links, interactive accents, illustrations |
| Aqua Mist | Logo highlight | `#77CFF1` | Hover states, subtle highlights, gradients |
| Midnight | Logo dark text | `#00151B` | Body text, dark backgrounds |
| White | Neutral | `#FFFFFF` | Main background |
| Ice | Supporting neutral | `#F4F8FA` | Alternate sections and cards |
| Slate | Supporting text | `#51636C` | Secondary body copy |

## 1. Brand direction

Blue Whale Consulting’s visual personality is:

**Confident · Intelligent · Calm · Precise · Premium · Progressive**

The whale mark has a lot of movement, so the rest of the interface should be restrained. That contrast helps the brand feel premium.

Avoid making the site overtly nautical. It does not need anchors, bubbles, literal oceans, or similar decoration. Instead, express the ideas of **depth, flow, and movement**.

The conceptual line for the design system is:

> **Depth of expertise. Forward momentum.**

This can guide the website visually even if it never becomes a public tagline.

---

## 2. Core color system

### Brand

```css
--brand-950: #001F31;
--brand-900: #023652;
--brand-800: #03466E;
--brand-700: #075C8D;
--brand-600: #1475AC;
--brand-500: #4A95CF;
--brand-400: #77CFF1;
--brand-300: #A7E0F5;
--brand-200: #D0EDF8;
--brand-100: #EAF7FC;
--brand-50:  #F5FBFD;
```

Not every step needs to appear in the final CSS, but this scale is useful for Tailwind and shadcn.

### Neutrals

```css
--neutral-950: #00151B;
--neutral-900: #10242B;
--neutral-800: #24373E;
--neutral-700: #3B4E55;
--neutral-600: #596A70;
--neutral-500: #7A898E;
--neutral-400: #A0AAAE;
--neutral-300: #C7CFD2;
--neutral-200: #DDE4E6;
--neutral-100: #EDF2F3;
--neutral-50:  #F7FAFA;
--white:       #FFFFFF;
```

The darkest tone should have a slight blue-green cast rather than being plain black. This keeps the site visually connected to the logo.

---

## 3. Signature gradient

Use gradients selectively.

```css
background: linear-gradient(
  120deg,
  #03466E 0%,
  #4A95CF 60%,
  #77CFF1 100%
);
```

Appropriate uses include:

- Small accents
- CTA borders
- Subtle text treatments
- Graphical lines
- Hero artwork
- Hover animations

Do not make every button a gradient. Primary buttons should usually be solid Deep Ocean.

---

## 4. Typography

The logo uses a geometric, widely spaced sans-serif treatment. The website typography should complement rather than imitate it.

### Recommended pairing

#### Headings: Manrope

Manrope feels modern and technical without looking like a startup cliché.

- `700` for major headlines
- `600` for section headings
- `500` or `600` for cards

#### Body and UI: Inter

Inter is clean and highly legible for:

- Paragraphs
- Buttons
- Forms
- Navigation
- Dashboards
- Case studies

An alternative for a slightly more premium feel is **Plus Jakarta Sans** for both headings and body. The preferred pairing for Blue Whale Consulting is:

> **Manrope + Inter**

---

## 5. Type scale

Desktop scale:

```text
Display XL    72px / 1.00 / -3%
Display       60px / 1.05 / -2.5%
H1            48px / 1.10 / -2%
H2            38px / 1.15 / -1.5%
H3            30px / 1.20 / -1%
H4            24px / 1.30
Large body    20px / 1.60
Body          16px / 1.65
Small         14px / 1.55
Label         12px / 1.4 / +8%
```

Use relatively tight tracking for hero headings. Do not use eyebrow headers or decorative uppercase labels above headings. Introduce sections directly through their heading and useful supporting prose.

---

## 6. Spacing system

Use a systematic spacing scale:

```text
4
8
12
16
24
32
48
64
80
96
128
160
```

For major website sections:

```css
padding-block: 120px;
```

On smaller screens:

```css
padding-block: 72px;
```

Premium sites feel premium partly because they are not afraid of whitespace.

---

## 7. Grid and layout

- **Max page width:** `1280px`
- **Content width:** `1180–1200px`
- **Reading width:** `680–760px`

Desktop:

```text
12-column grid
24–32px gutter
```

Tablet:

```text
8 columns
```

Mobile:

```text
4 columns
16–20px side margin
```

Avoid centering everything. Alternating left-heavy compositions will feel stronger for this brand:

```text
Headline        Visual

Visual          Content

Content         Metric cards
```

---

## 8. Border radius

Do not make the interface overly bubbly.

```text
Small:   6px
Medium:  10px
Large:   16px
XL:      24px
Pill:    999px
```

- Most professional cards: **12–16px**
- Buttons: **8–10px**

This keeps the brand modern but serious.

---

## 9. Buttons

### Primary

```text
Background: #03466E
Text: white
Radius: 8px
Height: 48–52px
```

Hover:

```text
Background: #023652
translateY(-1px)
```

A tiny directional-arrow animation works well: `→` can become `⟶` or slide `3–4px`.

### Secondary

Use a white or transparent background:

```text
border: 1px solid #C7CFD2
color: #03466E
```

The hover state can pick up a very pale blue.

### Text CTA

```text
Explore our capabilities →
```

Use no button chrome. This treatment is useful inside service cards.

---

## 10. Cards

Prefer thin borders to heavy box shadows.

```css
border: 1px solid #DDE4E6;
background: #FFFFFF;
border-radius: 16px;
```

Hover:

```css
transform: translateY(-4px);
border-color: #A7E0F5;
box-shadow: 0 18px 50px rgba(0, 33, 49, 0.08);
```

The shadow should be barely noticeable.

---

## 11. Distinctive Blue Whale visual motif

The **three flowing lines inside the logo** should become part of the broader design language. They can appear as:

- Section separators
- Animated SVG paths
- Loading indicators
- Background lines
- Card hover effects
- Timeline paths
- Data-visualization strokes

Conceptually:

```text
────────╲____
    ───────╲____
         ─────────╲____
```

Use the actual organic curves from the whale mark rather than generic sine waves. This creates a proprietary design motif instead of using the logo only in the navbar.

---

## 12. Whale motion language

Motion is part of the design system, not an afterthought. It should feel:

**Smooth, weighted, and fluid—not bouncy.**

Recommended easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

### Standard durations

```text
Micro interaction    150–200ms
Button/card           250–350ms
Section entrance      600–800ms
Large logo movement   900–1400ms
```

Think of it as something moving through water.

---

## 13. Logo animation

For the homepage load:

### Stage 1

The three waves draw from left to right.

### Stage 2

The whale body fades or slides into place.

### Stage 3

`BLUE WHALE` appears with slight tracking expansion.

### Stage 4

`CONSULTING` fades upward.

The full animation should take **1.2–1.8 seconds**. Do not replay it aggressively during navigation.

---

## 14. Scrolling whale concept

For the website, separate the whale from the wordmark. As the user moves beyond the hero, its trajectory can continue through the experience:

```text
Hero
     whale swims ↓

Strategy
         whale ↓

Technology
      whale ↓

Projects
            whale ↓
```

The whale does not need to literally swim down every section. Its trajectory can instead be represented with the wave paths. Subtle movement will feel more premium than a cartoon treatment.

---

## 15. Imagery direction

Avoid generic images of people pointing at laptops in glass offices; they quickly make consulting websites feel generic.

### Option A — Editorial technology photography

Use large architecture, infrastructure, screens, and abstract detail shots.

### Option B — Abstract digital imagery

Use dark-blue environments featuring:

- Networks
- Light
- Topology
- Flows
- Structured geometry

### Option C — Client- and result-led imagery

Use screenshots, diagrams, systems, and project outcomes.

For Blue Whale Consulting, **Option C with a little Option B** is the strongest direction.

---

## 16. Iconography

Use simple line icons with:

```text
1.5px stroke
rounded joins
minimal detail
```

Lucide Icons are a strong fit. For the primary services, eventually create a small custom icon set derived from flowing lines:

```text
Strategy
Transformation
Technology
Data
Operations
Advisory
```

---

## 17. Dark sections

This brand should include dark sections.

```css
background: #00151B;
```

Use:

```text
Heading: white
Body: #C7CFD2
Accent: #77CFF1
```

Aim for an overall light/dark balance of approximately:

```text
75% light
25% dark
```

Suggested page rhythm:

```text
NAV                 White

HERO                Very pale blue

SERVICES            White

WHY BLUE WHALE      Midnight

CASE STUDIES        White

INSIGHTS            Ice

CTA                 Deep Ocean / Midnight

FOOTER               Midnight
```

---

## 18. Hero direction

Avoid generic copy such as:

> We provide innovative solutions for your business.

Use a direction closer to:

```text
                 [animated whale / flowing line]

Technology with
depth behind it.

We help organizations simplify complex systems,
modernize operations and build technology that lasts.

[Explore our work]    [What we do]
```

Give the hero a generous amount of negative space. The whale can occupy the right side and move subtly in response to pointer movement.

---

## 19. Service cards

Instead of six identical icon boxes, use a numbered editorial structure:

```text
01
Digital Strategy
──────────────────
Turning complex business needs into clear,
actionable technology roadmaps.

Explore →
```

The numbering adds a consultancy and editorial quality.

---

## 20. Case studies

Make case studies a central visual feature rather than an afterthought:

```text
Selected Work

[ LARGE PROJECT VISUAL ]

Digital Transformation
Client Name

Modernizing operations across...
                                    View case study →
```

On hover, move the imagery slightly. Case studies are likely more persuasive for this company than a large list of service descriptions.

---

## 21. Tailwind and shadcn semantic variables

Establish semantic variables before building components:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 194 100% 5%;

  --primary: 203 95% 22%;
  --primary-foreground: 0 0% 100%;

  --secondary: 204 58% 55%;
  --secondary-foreground: 0 0% 100%;

  --muted: 195 24% 96%;
  --muted-foreground: 195 10% 40%;

  --accent: 197 82% 71%;
  --accent-foreground: 194 100% 5%;

  --border: 195 16% 88%;
  --input: 195 16% 88%;
  --ring: 203 95% 22%;

  --radius: 0.75rem;
}
```

Build every component against semantic tokens rather than hardcoding logo colors throughout the interface.

---

## 22. Initial component library

Create these components before building pages:

```text
Typography
Button
Link
Badge
Container
Section
Card
ServiceCard
CaseStudyCard
Stat
Quote
LogoCloud
Accordion
Input
Textarea
Select
Navbar
MobileNav
Footer
SectionHeading
Eyebrow
CTA
```

Once these exist, the website becomes primarily an exercise in composition.

---

## 23. Design principles

### 01 — Depth over decoration

Use hierarchy, spacing, and motion instead of excessive visual effects.

### 02 — Flow

Layouts and animation should feel continuous rather than rigid.

### 03 — Confidence through restraint

Do not fill empty space merely because it exists.

### 04 — Technology should feel human

Avoid overly science-fiction interfaces.

### 05 — One memorable brand motif

Use the whale and wave language consistently instead of introducing many unrelated graphics.

---

## 24. Overall direction

Aim for a blend of:

**Premium consultancy**  
+ **Modern SaaS company**  
+ **Editorial architecture site**

rather than a traditional IT-company website.

The biggest opportunity is the whale itself. The logo already contains movement, so the website can feel like the brand is **flowing through the experience** rather than simply placing a logo in the top-left corner.

## Final locked decisions

- **Primary:** `#03466E`
- **Secondary:** `#4A95CF`
- **Highlight:** `#77CFF1`
- **Dark:** `#00151B`
- **Light:** `#F4F8FA`
- **Heading font:** Manrope
- **Body font:** Inter
- **Radius:** `12–16px`
- **Style:** Editorial and minimal
- **Motion:** Smooth and fluid
- **Core motif:** Logo wave paths
- **Light/dark balance:** Approximately `75/25`
- **Photography:** Minimal
- **Gradients:** Restrained

With these decisions established, there is enough consistency to begin designing without every page becoming a new design experiment.

## Recommended next step

Before starting the website code, break the supplied logo into a complete web asset kit:

- Full lockup
- Whale-only mark
- Wordmark
- Monochrome versions
- Favicon and app icon
- Separate SVG layers for the whale body and each wave

Separating the body and wave paths will make it possible to build the motion system properly instead of trying to animate a flattened PNG.
