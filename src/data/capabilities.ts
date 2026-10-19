// The four capabilities, from Nic's brief: the short lines from the Home
// section, plus the promise and areas of work from the What We Do page.
import type { IconName } from '@/components/ui/Icon.astro';

export type Capability = {
  slug: string;
  title: string;
  icon: IconName;
  short: string;
  promise: string;
  body: string;
  areas: string[];
  cta: string;
};

export const capabilityList: Capability[] = [
  {
    slug: 'opportunity-identification',
    title: 'Opportunity Identification',
    icon: 'search',
    short: 'Recognise openings for growth, innovation, market expansion and competitive advantage.',
    promise: 'See the opportunity beyond the obvious.',
    body: 'Identify potential growth areas, unmet market needs, new commercial applications and ways to create value from existing capabilities or resources.',
    areas: [
      'Opportunity discovery and assessment',
      'Market and customer opportunity exploration',
      'New revenue opportunities',
      'Market expansion',
      'Commercial opportunity prioritisation',
    ],
    cta: 'Discuss an Opportunity',
  },
  {
    slug: 'commercial-strategy',
    title: 'Commercial Strategy',
    icon: 'compass',
    short: 'Decide where to focus, how to compete and how to turn promising options into actionable plans.',
    promise: 'Determine the right move before committing resources.',
    body: 'Develop a clearer understanding of where to focus, how to capture an opportunity and what needs to happen next.',
    areas: [
      'Growth strategy',
      'Commercial proposition development',
      'Business model development',
      'Strategic planning for specific commercial initiatives',
      'Opportunity prioritisation and action planning',
    ],
    cta: 'Discuss Your Growth Strategy',
  },
  {
    slug: 'innovation-commercialisation',
    title: 'Innovation & Commercialisation',
    icon: 'spark',
    short: 'Develop ideas into viable propositions and establish a path toward market.',
    promise: 'Turn promising ideas into commercial propositions.',
    body: 'Explore the potential of an idea, clarify the value it offers, examine how it could generate revenue and lay the foundations for taking it to market.',
    areas: [
      'New product and service opportunities',
      'Innovation assessment',
      'Value proposition development',
      'Commercial model development',
      'Route-to-market planning',
      'Partner identification',
    ],
    cta: 'Explore an Idea',
  },
  {
    slug: 'partnerships',
    title: 'Strategic Partnerships',
    icon: 'network',
    short: 'Identify and develop the relationships, resources and capabilities that unlock new possibilities.',
    promise: 'Connect the opportunity with the right capabilities.',
    body: 'Identify potential partners and develop commercial relationships that help businesses reach new markets, capabilities, customers or resources.',
    areas: [
      'Strategic partner identification',
      'Commercial introductions and relationship development',
      'Business development',
      'Partnership proposition development',
      'New market and channel opportunities',
    ],
    cta: 'Explore a Partnership',
  },
];
