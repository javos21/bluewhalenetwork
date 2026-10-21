// Selected work, from Nic's answers of 21 Oct 2026.
//
// Anonymous by agreement: no client names, brands or identifying details,
// and no financial or commercial figures beyond the approved outcomes below.
// Client logos live only in the Clients section, never next to these.
//
// Each case follows The Opportunity → Our Approach → The Outcome.
// `figure` is the one number or marker set large beside the case.

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  figure: { value: string; label: string };
  opportunity: string;
  approach: string;
  outcome: string;
  /** Offer this work is closest to */
  offer: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'flavour-innovation',
    title: 'Flavour Innovation & Product Line Extension',
    client: 'A leading Caribbean beverage brand',
    figure: { value: '6', label: 'product line extensions' },
    opportunity:
      'Extend an established beverage portfolio to create new consumer and commercial opportunities.',
    approach:
      'Applied flavour innovation to develop six product line extensions for an established shandy brand.',
    outcome:
      'Six product line extensions developed through flavour innovation, showing how product development can create new opportunities within an existing brand portfolio.',
    offer: 'pod',
  },
  {
    slug: 'supply-chain-savings',
    title: 'Supply Chain Optimisation & Commercial Savings',
    client: 'A leading regional beverage and spirits manufacturer',
    figure: { value: '20%', label: 'projected saving' },
    opportunity:
      'Reduce input costs while maintaining the requirements of the manufacturing operation.',
    approach:
      'Identified an alternative supply-chain opportunity and developed a commercial proposition connecting the manufacturer with an alternative international supplier.',
    outcome:
      'A projected 20% saving on the relevant supply cost, subject to the agreed implementation and purchasing arrangements.',
    offer: 'growth-strategy',
  },
  {
    slug: 'integrated-campaign',
    title: 'Integrated Brand Campaign',
    client: 'A leading regional premium rum brand',
    figure: { value: 'CPL', label: '2026 campaign' },
    // Nic gave the project ("a full campaign developed for CPL 2026") but no
    // challenge line; this one is drafted and logged in docs/copy-edits.md.
    opportunity:
      'Bring a premium brand to the CPL 2026 audience with one coordinated campaign.',
    approach:
      'Supported the campaign from the broader commercial and creative concept through campaign planning and execution.',
    outcome:
      'A coordinated brand campaign aligned with the occasion, audience and brand positioning.',
    offer: 'campaigns-communications',
  },
];
