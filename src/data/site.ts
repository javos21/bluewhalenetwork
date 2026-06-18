// Static seed data — mirrors the Payload CMS content model.
// When Payload CMS is running, swap these for API calls via src/lib/payload.ts.

export const navigation = {
  logo: 'BlueWhale',
  links: [
    { label: 'Home',     href: '#home' },
    { label: 'Team',     href: '#team' },
    { label: 'Blog',     href: '#blog' },
    { label: 'About Us', href: '#about' },
  ],
  cta: { label: "Let's Talk", href: '#contact' },
};

export const hero = {
  overline: 'Wealth Management & Advisory',
  big: { line1: 'Secure', line2: 'your', line3: 'future.' },
  intro: 'Personalized investment, tax, and wealth management — helping individuals and businesses build lasting financial success.',
  cta: { label: 'Book Appointment', href: '#contact' },
  photo: '/images/hero-professional.jpg',
  photoAlt: 'A BlueWhale financial advisor',
  location: 'London, United Kingdom',
  socials: [
    { label: 'LinkedIn',  href: '#' },
    { label: 'X',         href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'Facebook',  href: '#' },
  ],
};

export const about = {
  eyebrow: 'Who We Are',
  body: 'At BlueWhale Consulting, We Provide Personalized Investment, Tax, And Wealth Management Solutions To Help You Achieve Financial Success.',
  cta: { label: 'Learn More', href: '#about' },
  statsLabel: 'Some Statistics',
  stats: [
    { value: '$50M+', label: 'Assets Managed' },
    { value: '20%',   label: 'Average Tax Savings' },
    { value: '3X',    label: 'Faster Business Growth' },
  ],
};

export const focus = {
  eyebrowA: 'Take Control Of Your',
  eyebrowB: 'Financial Future',
  cards: [
    {
      tag: 'Investment Planning',
      title: 'Grow Your Wealth With Smart Investments',
      description: 'Smart, Risk-Managed Investment Strategies For Long-Term Portfolio Growth.',
      image: '/images/focus-investment.jpg',
      alt: 'Financial analytics dashboard with performance charts',
      featured: true,
    },
    {
      tag: 'Business Financial Consulting',
      title: 'Helping Businesses Thrive With Financial Expertise',
      description: 'Improve Cash Flow, Maximize Profits, And Scale Your Business Efficiently.',
      image: '/images/focus-business.jpg',
      alt: 'Two professionals shaking hands in an office',
      featured: false,
    },
    {
      tag: 'Tax Optimization & Planning',
      title: 'Save & Keep More Of Your Hard-Earned Money',
      description: 'Secure, Optimize, And Grow Your Financial Future With Expert Guidance.',
      image: '/images/focus-tax.jpg',
      alt: 'Tax documents with a calculator on a desk',
      featured: false,
    },
    {
      tag: 'Retirement Planning',
      title: 'Plan A Comfortable And Confident Retirement',
      description: 'Structured Pension And Income Strategies Built Around Your Future.',
      image: '/images/focus-retirement.jpg',
      alt: 'Client signing a financial planning document',
      featured: false,
    },
  ],
};

export const faq = {
  eyebrowA: 'Got Questions?',
  eyebrowB: "We've Got",
  highlight: 'Answers.',
  subheading: "We Understand That Financial Decisions Can Feel Complex, And It's Natural To Have Questions.",
  items: [
    {
      q: 'What Types Of Clients Do You Work With?',
      a: 'We work with individuals, families, founders, and established businesses — from first-time investors to multi-entity family offices.',
    },
    { q: 'How Do I Know Which Financial Service I Need?', a: 'Start with a free discovery call. We assess your goals and recommend the right mix of services for your situation.' },
    { q: 'Do You Offer Personalized Investment Advice?', a: 'Yes. Every strategy is built around your risk profile, timeline, and personal objectives — never off-the-shelf.' },
    { q: 'Can You Help Reduce My Taxes Legally?', a: 'Absolutely. Our advisors specialize in proactive, fully compliant tax optimization and structuring.' },
    { q: 'Do You Offer Virtual Consultations?', a: 'Yes — meet with your advisor in person or via secure video call, whichever suits you best.' },
    { q: 'How Do I Get Started?', a: 'Book an appointment and we will schedule your complimentary 30-minute discovery session.' },
  ],
};

export const stories = {
  eyebrowA: 'Real Stories,',
  eyebrowB: 'Real',
  highlight: 'Success',
  subheading: "We've Helped Individuals And Businesses Take Control Of Their Finances, Grow Smarter, And Plan Stronger.",
  people: [
    { name: 'Jason Miller', title: 'CEO, Wealth Expert', image: '/images/story-featured.jpg', alt: 'Portrait of Jason Miller' },
    { name: 'Sophia Reed',  title: 'Founder',            image: '/images/story-1.jpg',        alt: 'Portrait of Sophia Reed' },
    { name: 'David Chen',   title: 'Director',           image: '/images/story-2.jpg',        alt: 'Portrait of David Chen' },
    { name: 'Amara Okafor', title: 'Partner',            image: '/images/story-3.jpg',        alt: 'Portrait of Amara Okafor' },
  ],
};

export const cta = {
  headline: 'Ready To Take Control Of Your Financial Future?',
  subtext: 'Let Our Experts Craft A Winning Financial Strategy For You.',
  cta: { label: 'Book Appointment', href: '#contact' },
};

export const newsletter = {
  heading: 'Join Our Newsletter To Keep Up To Date With Us!',
  placeholder: 'Enter Your Email To Get Expert Tips',
  cta: 'Subscribe',
};

export const footer = {
  tagline: 'Let Our Experts Craft A Winning Financial Strategy For You.',
  columns: [
    {
      links: [
        { label: 'About Us',            href: '#about' },
        { label: 'Services',            href: '#focus' },
        { label: 'Book A Consultation', href: '#contact' },
      ],
    },
    {
      links: [
        { label: 'FAQs',         href: '#faq' },
        { label: 'Testimonials', href: '#stories' },
        { label: 'Blog',         href: '#blog' },
      ],
    },
  ],
  legal: '© 2026 BlueWhale Consulting. All Rights Reserved.',
  legalLinks: [
    { label: 'Privacy Policy',      href: '#' },
    { label: 'Terms & Conditions',  href: '#' },
    { label: 'Disclaimer',          href: '#' },
  ],
};
