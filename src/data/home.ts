// Home page copy — Nic's brief, sections 1–6, with light edits recorded in
// docs/copy-edits.md for his approval.

export const opportunity = {
  lines: ['Growth Begins With', 'Seeing What’s Possible.'],
  body: [
    'Not every opportunity is obvious. Some emerge from an unmet customer need, a new market, a promising idea or a relationship that has yet to be explored.',
    'The challenge is recognising which ones are worth pursuing, and how to turn them into commercial value.',
    'Blue Whale helps businesses identify those opportunities, develop the proposition and establish a practical path forward.',
  ],
};

export const capabilities = {
  lines: ['What We Do'],
  items: [
    {
      title: 'Opportunity Identification',
      body: 'Recognise openings for growth, innovation, market expansion and competitive advantage.',
    },
    {
      title: 'Commercial Strategy',
      body: 'Decide where to focus, how to compete and how to turn promising options into actionable plans.',
    },
    {
      title: 'Innovation & Commercialisation',
      body: 'Develop ideas into viable propositions and establish a path toward market.',
    },
    {
      title: 'Strategic Partnerships',
      body: 'Identify and develop the relationships, resources and capabilities that unlock new possibilities.',
    },
  ],
  cta: { label: 'Explore Our Capabilities', href: '/what-we-do' },
};

export const solutions = {
  lines: ['Different Challenges.', 'A Clearer Path Forward.'],
  intro:
    'Whether you’re exploring a new idea, looking for your next stage of growth or developing a specific opportunity, Blue Whale offers structured ways to move from uncertainty toward action.',
  allLink: { label: 'See all products & services', href: '/services' },
  // Card link labels as written in the brief's Home section
  cardCta: {
    'growth-strategy': 'Explore Growth Strategy',
    'pod-sprint': 'Explore The POD Sprint',
    'continuity-check': 'Explore the Continuity Check',
  } as Record<string, string>,
};

export const approach = {
  lines: ['From Possibility', 'to Proposition.'],
  steps: [
    { word: 'Identify', body: 'Find the opportunities that merit closer attention.' },
    { word: 'Develop', body: 'Shape the opportunity into a clear commercial proposition.' },
    { word: 'Connect', body: 'Bring in the partners, resources and capabilities needed to progress.' },
    { word: 'Advance', body: 'Set the next steps toward implementation and market.' },
  ],
  note: 'A simplified overview of our approach, not a guarantee of execution or commercial success.',
};

export const founder = {
  lines: ['Led by', 'Nicholas Peña.'],
  body: 'A commercial strategist and business development professional with experience across food and beverage, banking, events, entertainment and marketing. Nic’s work focuses on identifying opportunities, developing growth strategies, building partnerships and turning ideas into market-ready propositions.',
  cta: { label: 'About Blue Whale', href: '/about' },
};

export const closing = {
  lines: ['What Opportunity', 'Are You Working On?'],
  body: [
    'Tell us what you’re exploring, what you’re trying to achieve or where you’re looking for a new perspective.',
    'We’ll start with a conversation about the opportunity and whether Blue Whale is the right fit.',
  ],
  cta: { label: 'Start a Conversation', href: '/contact' },
};
