// Site-wide content. Page copy follows Nic's brief (Oct 2026).

export const site = {
  name: 'Blue Whale Consulting',
  shortName: 'Blue Whale',
  tagline: 'Opportunity Identification · Commercial Strategy · Partnerships · Innovation',
  description:
    'Blue Whale identifies opportunities, develops commercial strategies and helps businesses bring ideas to market.',
  url: 'https://bluewhalenetwork.com',
  // From Nic's answers (21 Oct 2026). Shown on the contact page and as the
  // fallback if the enquiry form can't be sent.
  email: 'bluewhaleconsultingservices@gmail.com',
};

export const primaryCta = { label: 'Discuss an Opportunity', href: '/contact' };

// "Our Work" and "Insights" stay out of the nav until real content exists.
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Products & Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = [
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Products & Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Start a Conversation', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
];
