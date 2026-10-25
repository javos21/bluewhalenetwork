// POST /api/enquiry — Cloudflare Pages Function behind the contact form.
//
// 1. Accepts JSON only (the form island sends it; a no-JS post gets a plain reply).
// 2. Rate-limits by IP: 5 enquiries per 10 minutes per Cloudflare location.
// 3. Drops honeypot submissions silently (bots are told it worked).
// 4. Validates with the same rules as the browser (src/lib/enquiry.ts).
// 5. Verifies the Turnstile token with Cloudflare.
// 6. Forwards the enquiry to the Google Apps Script web app on Nic's account,
//    which appends a row to the Leads sheet and emails him.
//
// Environment (Pages project → Settings → Variables and secrets), see docs/enquiries.md:
//   TURNSTILE_SECRET_KEY  secret   required in production
//   APPS_SCRIPT_URL       secret   the deployed web app URL (…/exec)
//   APPS_SCRIPT_TOKEN     secret   shared secret, must match the script's TOKEN property
//   PUBLIC_SITE_ENV       plain    "production" on the production branch only
//
// Previews without APPS_SCRIPT_URL run in dry-run mode: everything is checked,
// the enquiry is logged instead of sent, and the visitor sees the success state.

import { normalise, validate, type EnquiryInput } from '../../src/lib/enquiry';

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  APPS_SCRIPT_URL?: string;
  APPS_SCRIPT_TOKEN?: string;
  PUBLIC_SITE_ENV?: string;
}

type Context = { request: Request; env: Env; waitUntil: (p: Promise<unknown>) => void };

// Cloudflare's documented always-pass test secret, for local dev and previews only.
const TURNSTILE_TEST_SECRET = '1x0000000000000000000000000000000AA';
const RATE_LIMIT = { max: 5, windowSeconds: 600 };
const FALLBACK_EMAIL = 'bluewhaleconsultingservices@gmail.com';

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const onRequestPost = async ({ request, env, waitUntil }: Context): Promise<Response> => {
  const isProduction = env.PUBLIC_SITE_ENV === 'production';

  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) {
    return new Response(
      `The enquiry form needs JavaScript to send. Please email ${FALLBACK_EMAIL} instead.`,
      { status: 415, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (await overRateLimit(ip, waitUntil)) {
    return json(429, { ok: false, message: 'You’ve sent several enquiries in a short time. Please wait a few minutes and try again.' });
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, message: 'We couldn’t read that submission.' });
  }

  const enquiry = normalise(raw);
  if (enquiry.website) {
    console.log('enquiry: honeypot filled, dropped', { ip });
    return json(200, { ok: true });
  }

  const errors = validate(enquiry);
  if (Object.keys(errors).length) return json(422, { ok: false, errors });

  const secret = env.TURNSTILE_SECRET_KEY || (isProduction ? '' : TURNSTILE_TEST_SECRET);
  if (!secret) {
    console.error('enquiry: TURNSTILE_SECRET_KEY is not set in production');
    return json(500, { ok: false, message: 'The form isn’t fully set up yet.' });
  }
  const token = typeof raw.turnstileToken === 'string' ? raw.turnstileToken : '';
  if (!(await verifyTurnstile(token, secret, ip))) {
    return json(403, { ok: false, message: 'We couldn’t confirm you’re not a bot. Please try again.' });
  }

  const record = toRecord(enquiry, request);

  if (!env.APPS_SCRIPT_URL || !env.APPS_SCRIPT_TOKEN) {
    if (isProduction) {
      console.error('enquiry: APPS_SCRIPT_URL / APPS_SCRIPT_TOKEN missing in production');
      return json(500, { ok: false, message: 'The form isn’t fully set up yet.' });
    }
    console.log('enquiry: dry run (no Apps Script configured)', record);
    return json(200, { ok: true, dryRun: true });
  }

  try {
    const res = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: env.APPS_SCRIPT_TOKEN, enquiry: record }),
      redirect: 'follow', // Apps Script answers via a redirect to googleusercontent.com
      signal: AbortSignal.timeout(15000),
    });
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !body.ok) throw new Error(`Apps Script replied ${res.status}: ${body.error ?? 'no ok flag'}`);
  } catch (err) {
    console.error('enquiry: forwarding failed', String(err), record);
    return json(502, { ok: false, message: 'Your enquiry didn’t go through on our side.' });
  }

  return json(200, { ok: true });
};

/** What lands in the Leads sheet. Keys match the sheet's header row. */
function toRecord(e: EnquiryInput, request: Request) {
  const cf = (request as Request & { cf?: { country?: string } }).cf;
  return {
    receivedAt: new Date().toISOString(),
    name: e.name,
    email: e.email,
    phone: e.phone,
    organisation: e.organisation,
    interest: e.interest,
    offer: e.offer,
    message: e.message,
    utmSource: e.utmSource,
    utmMedium: e.utmMedium,
    utmCampaign: e.utmCampaign,
    utmContent: e.utmContent,
    country: cf?.country ?? request.headers.get('CF-IPCountry') ?? '',
  };
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip !== 'unknown') form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const out = (await res.json()) as { success?: boolean; action?: string; 'error-codes'?: string[] };
    if (!out.success) console.log('enquiry: turnstile rejected', out['error-codes']);
    // Test keys return an empty action; real keys must match the widget's.
    return !!out.success && (!out.action || out.action === 'enquiry');
  } catch (err) {
    console.error('enquiry: turnstile verify failed', String(err));
    return false;
  }
}

/**
 * Best-effort limit using the edge cache: it counts per Cloudflare location,
 * not globally, which is plenty alongside Turnstile for a small business site.
 */
async function overRateLimit(ip: string, waitUntil: Context['waitUntil']): Promise<boolean> {
  const cache = (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default;
  if (!cache) return false; // local dev without the Workers runtime
  const key = new Request(`https://rate-limit.internal/enquiry/${encodeURIComponent(ip)}`);
  const hit = await cache.match(key);
  const count = hit ? Number(await hit.text()) || 0 : 0;
  if (count >= RATE_LIMIT.max) return true;
  waitUntil(
    cache.put(
      key,
      new Response(String(count + 1), { headers: { 'Cache-Control': `max-age=${RATE_LIMIT.windowSeconds}` } }),
    ),
  );
  return false;
}
