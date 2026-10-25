// Contact form rules, shared by the browser form and the Pages Function so the
// two can never disagree. Keep this file free of browser- or Worker-only APIs,
// and use relative imports only: the Function bundler doesn't know `@/`.

import { interestAreas, offers } from '../data/offers';

export const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  organisation: 160,
  message: 4000,
} as const;

/** Shortest message we accept. Stops "hi" enquiries without being fussy. */
export const MESSAGE_MIN = 20;

export type EnquiryInput = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  interest: string;
  message: string;
  /** Offer slug the visitor came from, if any (from `?offer=`) */
  offer: string;
  /** Page and campaign context, for Nic's lead sheet */
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  /** Honeypot. Real people never see it, so it must stay empty. */
  website: string;
};

export type FieldName = 'name' | 'email' | 'phone' | 'organisation' | 'interest' | 'message';
export type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{7,}$/;

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/** Coerce untrusted input into a clean EnquiryInput (trimmed, length-capped). */
export function normalise(raw: Record<string, unknown>): EnquiryInput {
  return {
    name: str(raw.name, LIMITS.name),
    email: str(raw.email, LIMITS.email).toLowerCase(),
    phone: str(raw.phone, LIMITS.phone),
    organisation: str(raw.organisation, LIMITS.organisation),
    interest: str(raw.interest, 80),
    message: str(raw.message, LIMITS.message),
    offer: str(raw.offer, 80),
    utmSource: str(raw.utmSource, 100),
    utmMedium: str(raw.utmMedium, 100),
    utmCampaign: str(raw.utmCampaign, 100),
    utmContent: str(raw.utmContent, 100),
    website: str(raw.website, 200),
  };
}

/** Returns an empty object when every field is valid. Messages are shown to visitors. */
export function validate(e: EnquiryInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!e.name) errors.name = 'Please enter your name.';
  if (!e.email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(e.email)) errors.email = 'Please enter a valid email address, like name@company.com.';
  if (e.phone && !PHONE_RE.test(e.phone)) errors.phone = 'Please enter a valid phone number, or leave this blank.';
  if (!isInterest(e.interest)) errors.interest = 'Please choose the area you’re interested in.';
  if (!e.message) errors.message = 'Please tell us a little about the opportunity.';
  else if (e.message.length < MESSAGE_MIN)
    errors.message = `Please add a little more detail (at least ${MESSAGE_MIN} characters).`;
  return errors;
}

export function isInterest(v: string): boolean {
  return (interestAreas as readonly string[]).includes(v);
}

export function isOfferSlug(v: string): boolean {
  return offers.some((o) => o.slug === v);
}
