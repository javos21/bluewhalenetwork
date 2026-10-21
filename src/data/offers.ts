// The four offers, from Nic's answers of 21 Oct 2026. They replace the seven
// offers in the original brief. Deliverables, timelines and delivery formats
// are Nic's; promise, summary, intro and bestFor are customer-facing copy
// written from them and logged in docs/copy-edits.md for his approval.
// Pricing stays off the site for now.

export type Offer = {
  slug: string;
  name: string;
  /** Short name for tight spaces (cards, the contact form) */
  shortName: string;
  promise: string;
  summary: string;
  intro: string;
  bestFor: string;
  deliverables: string[];
  timeline: string;
  delivery: string;
  cta: string;
  /** Area of interest on the contact form this offer maps to */
  interest: InterestArea;
};

export const interestAreas = [
  'Opportunity feasibility',
  'Growth strategy',
  'Product opportunity development',
  'Campaigns and communications',
  'Partnerships and business development',
  'Other',
] as const;
export type InterestArea = (typeof interestAreas)[number];

export const offers: Offer[] = [
  {
    slug: 'opportunity-feasibility',
    name: 'Opportunity & Commercial Feasibility',
    shortName: 'Feasibility',
    promise: 'Know whether it’s worth pursuing before you commit.',
    summary:
      'A focused assessment of an opportunity’s commercial potential, ending in a clear recommendation and a plan.',
    intro:
      'For businesses weighing up a new opportunity, market or idea. We assess the opportunity and its commercial feasibility, then give you a clear recommendation and a prioritised plan for the way forward.',
    bestFor: 'Businesses deciding whether, and how, to pursue a specific opportunity.',
    deliverables: [
      'An assessment of the opportunity and its market and commercial feasibility',
      'A clear recommendation and a proposed way forward',
      'A prioritised action plan',
    ],
    timeline: 'About 2 weeks for the initial feasibility sprint',
    delivery: 'Remote or hybrid, depending on the project',
    cta: 'Discuss an Opportunity',
    interest: 'Opportunity feasibility',
  },
  {
    slug: 'growth-strategy',
    name: 'Growth & Commercial Strategy',
    shortName: 'Growth Strategy',
    promise: 'Find where your next stage of growth will come from.',
    summary:
      'Pinpoint your strongest growth opportunities and the partnerships, revenue and routes to market to pursue them.',
    intro:
      'For businesses ready to grow, or working through commercial challenges. We assess where growth can come from, identify the partnerships, revenue opportunities and routes to market worth pursuing, and set out a prioritised roadmap.',
    bestFor: 'Businesses seeking a clearer direction for growth.',
    deliverables: [
      'An assessment of growth opportunities and current commercial challenges',
      'Potential partnerships, revenue opportunities and routes to market',
      'A prioritised growth roadmap',
    ],
    timeline: '3–6 weeks, depending on scope',
    delivery: 'Remote or hybrid',
    cta: 'Discuss Your Growth Strategy',
    interest: 'Growth strategy',
  },
  {
    slug: 'pod',
    name: 'Product Opportunity Development',
    shortName: 'POD',
    promise: 'Turn a promising idea into a market-ready proposition.',
    summary:
      'Develop a product or service opportunity into a commercial proposition with a clear route to market.',
    intro:
      'POD is our structured approach to identifying promising product and service opportunities, validating their commercial potential and developing them into market-ready propositions. It starts with a two-week feasibility sprint, then moves into full development where the opportunity merits it.',
    bestFor: 'New products, services and line extensions with real commercial potential.',
    deliverables: [
      'Identification and assessment of product or service opportunities',
      'The commercial proposition: value proposition, target market and business case',
      'A commercialisation roadmap covering partnerships, routes to market and next steps',
    ],
    timeline: 'A 2-week feasibility sprint, then typically 4–8+ weeks of development',
    delivery: 'Remote or hybrid',
    cta: 'Explore POD',
    interest: 'Product opportunity development',
  },
  {
    slug: 'campaigns-communications',
    name: 'Campaigns & Communications',
    shortName: 'Campaigns',
    promise: 'Carry the strategy into the market.',
    summary:
      'Campaign strategy and execution for defined projects, plus ongoing communications support when you need it.',
    intro:
      'For businesses launching a campaign or needing consistent communications support. We plan and deliver campaigns for defined projects, and provide ongoing communications planning and content support for clients who need it month to month.',
    bestFor: 'Launches, brand moments and businesses that need regular communications support.',
    deliverables: [
      'Campaign planning, with creative and messaging direction',
      'Campaign coordination and execution',
      'Ongoing content and communications support',
    ],
    timeline: 'Campaigns are project-based; ongoing support is monthly',
    delivery: 'Remote or hybrid, with in-person support where required',
    cta: 'Discuss a Campaign',
    interest: 'Campaigns and communications',
  },
];

export const offerBySlug = (slug: string) => offers.find((o) => o.slug === slug);
export const offerHref = (slug: string) => `/services/${slug}`;
export const offerContactHref = (offer: Offer) =>
  `/contact?interest=${encodeURIComponent(offer.interest)}&offer=${offer.slug}`;
