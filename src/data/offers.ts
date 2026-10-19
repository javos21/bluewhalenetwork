// The seven structured offers from Nic's brief.
// `summary` is the short line used on Home and the QR page; `promise`,
// `intro` and `bestFor` come from the Products & Services section.
// Deliverables, duration and format are added in step 3 once Nic answers
// the content questions (drafts are marked as such until then).

export type Offer = {
  slug: string;
  name: string;
  promise: string;
  summary: string;
  intro: string;
  bestFor: string;
  cta: string;
  /** Areas of interest on the contact form this offer maps to */
  interest: InterestArea;
  /** Supporting capability — shown visually secondary to the core offers */
  secondary?: boolean;
};

export const interestAreas = [
  'Opportunity identification',
  'Growth strategy',
  'Innovation and commercialisation',
  'Partnerships and business development',
  'Campaigns and communications',
  'Other',
] as const;
export type InterestArea = (typeof interestAreas)[number];

export const offers: Offer[] = [
  {
    slug: 'continuity-check',
    name: 'Continuity Check',
    promise: 'Identify the gaps. Prioritise what matters.',
    summary: 'Identify gaps, risks and opportunities for improvement in your current business approach.',
    intro:
      'For businesses that want a clearer picture of what is working, where attention is needed and what should be improved. The Continuity Check identifies gaps, risks and opportunities for improvement and gives you a structured basis for deciding what to address next.',
    bestFor: 'Businesses seeking a focused review of their current approach.',
    cta: 'Explore the Continuity Check',
    interest: 'Opportunity identification',
  },
  {
    slug: 'growth-strategy',
    name: 'Growth Strategy',
    promise: 'Find your next growth opportunity.',
    summary: 'Identify your next growth opportunities and develop a practical strategy to pursue them.',
    intro:
      'For businesses ready to grow but looking for greater clarity on where to focus and how to pursue the next stage. We help identify and assess potential growth opportunities, prioritise commercial options and develop a strategy to guide the next move.',
    bestFor: 'Businesses seeking a clearer commercial growth direction.',
    cta: 'Discuss Growth Strategy',
    interest: 'Growth strategy',
  },
  {
    slug: 'campaigns',
    name: 'Campaigns',
    promise: 'Give an important initiative a clearer commercial direction.',
    summary: 'Strategic support to shape a campaign or defined commercial initiative.',
    intro:
      'For businesses that need strategic support in developing a campaign or a defined initiative. We help shape the approach, clarify the objectives and develop a structured plan appropriate to the agreed scope.',
    bestFor: 'Businesses pursuing a specific campaign or commercial initiative.',
    cta: 'Discuss a Campaign',
    interest: 'Campaigns and communications',
  },
  {
    slug: 'pod-sprint',
    name: 'The POD Sprint',
    promise: 'Assess the opportunity before committing to the build.',
    summary: 'Assess an idea’s commercial potential, clarify the proposition and identify the next steps.',
    intro:
      'For businesses and founders with an idea they want to explore more rigorously before investing further. The POD Sprint examines the opportunity, clarifies the proposition, considers its commercial potential and identifies the next steps.',
    bestFor: 'Early-stage ideas, new product concepts and emerging commercial opportunities.',
    cta: 'Explore The POD Sprint',
    interest: 'Innovation and commercialisation',
  },
  {
    slug: 'pod-build',
    name: 'The POD Build',
    promise: 'Develop the proposition. Establish the path to market.',
    summary: 'Develop the proposition, test the business model and set a structured route to market.',
    intro:
      'For opportunities that merit further development and need a stronger commercial foundation. The POD Build develops the proposition, examines the business model, considers potential partners and establishes a structured route toward market.',
    bestFor: 'Businesses developing a promising product, service or commercial concept.',
    cta: 'Discuss The POD Build',
    interest: 'Innovation and commercialisation',
  },
  {
    slug: 'pod-partnership',
    name: 'The POD Partnership',
    promise: 'Develop commercial opportunities through collaboration.',
    summary: 'A more involved, partnership-based engagement to develop and advance an opportunity.',
    intro:
      'For businesses seeking a more involved relationship to develop and advance a commercial opportunity. The engagement is shaped around the opportunity, the parties involved, the commercial model and the work required to progress it.',
    bestFor: 'Commercial opportunities that may benefit from an ongoing or partnership-based engagement.',
    cta: 'Explore a Commercial Partnership',
    interest: 'Partnerships and business development',
  },
  {
    slug: 'communications-support',
    name: 'Ongoing Communications Support',
    promise: 'Bring greater structure to your communications.',
    summary: 'Consistent support with agreed communications and content priorities.',
    intro:
      'For businesses seeking consistent support with agreed communications and content priorities. This service supports brand communication and campaign activity, aligned with your objectives and agreed scope.',
    bestFor: 'Businesses requiring ongoing communications support.',
    cta: 'Discuss Your Requirements',
    interest: 'Campaigns and communications',
    secondary: true,
  },
];

export const offerBySlug = (slug: string) => offers.find((o) => o.slug === slug);
export const offerHref = (slug: string) => `/services/${slug}`;

/** The three entry points featured on Home (per the brief). */
export const featuredOfferSlugs = ['growth-strategy', 'pod-sprint', 'continuity-check'] as const;
