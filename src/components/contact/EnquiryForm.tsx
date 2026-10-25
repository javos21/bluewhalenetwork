// Contact form island. Posts JSON to the Pages Function at /api/enquiry,
// which checks Turnstile and forwards the enquiry to Nic's Leads sheet.
//
// - Area of interest is pre-filled from `?interest=`, and the offer page the
//   visitor came from (`?offer=`) and any UTM tags travel with the enquiry.
// - Validation rules live in src/lib/enquiry.ts and are shared with the server.
// - Dispatches `bw:enquiry` events (start / submit / error) on window so GA4
//   can hook in during step 8 without touching this file.

import { useEffect, useId, useRef, useState, type ReactNode, type SyntheticEvent } from 'react';
import { interestAreas, offers } from '@/data/offers';
import { LIMITS, normalise, validate, isInterest, isOfferSlug, type FieldErrors, type FieldName } from '@/lib/enquiry';

type Props = {
  /** Turnstile site key. Falls back to Cloudflare's always-pass test key. */
  siteKey: string;
  /** Shown when the server can't be reached, so nobody is left stuck. */
  fallbackEmail: string;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'sent'; name: string }
  | { kind: 'failed'; message: string };

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const FIELD_ORDER: FieldName[] = ['name', 'email', 'phone', 'organisation', 'interest', 'message'];

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = TURNSTILE_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject()));
    script.addEventListener('error', () => reject());
  });
}

function emit(stage: 'start' | 'submit' | 'error', detail: Record<string, string> = {}) {
  window.dispatchEvent(new CustomEvent('bw:enquiry', { detail: { stage, ...detail } }));
}

export default function EnquiryForm({ siteKey, fallbackEmail }: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileEl = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string>('');
  const tokenWaiters = useRef<((t: string) => void)[]>([]);
  const started = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const [interest, setInterest] = useState('');
  const [context, setContext] = useState({ offer: '', utmSource: '', utmMedium: '', utmCampaign: '', utmContent: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [turnstileFailed, setTurnstileFailed] = useState(false);

  // Pre-fill from the URL. The page is static, so this has to run in the browser.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const fromUrl = q.get('interest') ?? '';
    if (isInterest(fromUrl)) setInterest(fromUrl);
    const offer = q.get('offer') ?? '';
    setContext({
      offer: isOfferSlug(offer) ? offer : '',
      utmSource: q.get('utm_source') ?? '',
      utmMedium: q.get('utm_medium') ?? '',
      utmCampaign: q.get('utm_campaign') ?? '',
      utmContent: q.get('utm_content') ?? '',
    });
  }, []);

  // Turnstile, usually invisible; it only shows a checkbox to suspicious visitors.
  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !turnstileEl.current) return;
        widgetId.current = ts.render(turnstileEl.current, {
          sitekey: siteKey,
          appearance: 'interaction-only',
          action: 'enquiry',
          callback: (t: string) => {
            token.current = t;
            setTurnstileFailed(false);
            tokenWaiters.current.splice(0).forEach((fn) => fn(t));
          },
          'expired-callback': () => (token.current = ''),
          'error-callback': () => {
            token.current = '';
            setTurnstileFailed(true);
          },
        });
      })
      .catch(() => !cancelled && setTurnstileFailed(true));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  /** Resolves with a Turnstile token, waiting up to 8s for the widget to finish. */
  function getToken(): Promise<string> {
    if (token.current) return Promise.resolve(token.current);
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(''), 8000);
      tokenWaiters.current.push((t) => {
        clearTimeout(timer);
        resolve(t);
      });
    });
  }

  function resetTurnstile() {
    token.current = '';
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

  function onFirstInput() {
    if (started.current) return;
    started.current = true;
    emit('start', { interest });
  }

  async function onSubmit(ev: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    ev.preventDefault();
    if (status.kind === 'submitting') return;
    const form = ev.currentTarget;
    const data = normalise({ ...Object.fromEntries(new FormData(form)), ...context });
    const found = validate(data);
    setErrors(found);

    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: 'submitting' });
    const turnstileToken = await getToken();
    if (!turnstileToken) {
      setStatus({ kind: 'failed', message: 'We couldn’t confirm you’re not a bot. Please try again in a moment.' });
      emit('error', { reason: 'turnstile' });
      resetTurnstile();
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: FieldErrors; message?: string };

      if (res.ok && body.ok) {
        setStatus({ kind: 'sent', name: data.name.split(/\s+/)[0] });
        emit('submit', { interest: data.interest, offer: data.offer });
        return;
      }
      if (body.errors && Object.keys(body.errors).length) {
        setErrors(body.errors);
        setStatus({ kind: 'idle' });
      } else {
        setStatus({ kind: 'failed', message: body.message ?? 'Something went wrong on our side.' });
      }
      emit('error', { reason: String(res.status) });
    } catch {
      setStatus({ kind: 'failed', message: 'We couldn’t reach our server. Check your connection and try again.' });
      emit('error', { reason: 'network' });
    }
    resetTurnstile();
  }

  // Move focus to the confirmation or error so screen readers announce it.
  useEffect(() => {
    if (status.kind === 'sent' || status.kind === 'failed') statusRef.current?.focus();
  }, [status.kind]);

  if (status.kind === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        <h2 className="heading text-2xl">Thank you, {status.name}.</h2>
        <p className="mt-4 max-w-lg text-slate">
          Your enquiry has reached us. We’ll review it and be in touch to arrange a conversation about the opportunity.
        </p>
        <a href="/services" className="link-arrow mt-8 text-deep">
          Explore our products and services<span className="btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  const offerName = offers.find((o) => o.slug === context.offer)?.name;
  const submitting = status.kind === 'submitting';
  const id = (f: string) => `${uid}-${f}`;

  return (
    // method/action only matter without JS: they keep a native submit from
    // putting the visitor's details in the URL.
    <form ref={formRef} method="post" action="/api/enquiry" noValidate onSubmit={onSubmit} onInput={onFirstInput} aria-busy={submitting} className="grid gap-6">
      <h2 className="heading text-2xl">Send an enquiry</h2>
      {offerName && (
        <p className="-mt-3 text-sm text-slate">
          Enquiring about <strong className="text-midnight">{offerName}</strong>
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={id('name')} label="Name" error={errors.name}>
          <input name="name" autoComplete="name" maxLength={LIMITS.name} required {...a11y(id('name'), errors.name)} />
        </Field>
        <Field id={id('email')} label="Email" error={errors.email}>
          <input name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} required {...a11y(id('email'), errors.email)} />
        </Field>
        <Field id={id('phone')} label="Phone" optional error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" maxLength={LIMITS.phone} {...a11y(id('phone'), errors.phone)} />
        </Field>
        <Field id={id('organisation')} label="Business or organisation" optional error={errors.organisation}>
          <input name="organisation" autoComplete="organization" maxLength={LIMITS.organisation} {...a11y(id('organisation'), errors.organisation)} />
        </Field>
      </div>

      <Field id={id('interest')} label="Area of interest" error={errors.interest}>
        <select name="interest" value={interest} onChange={(e) => setInterest(e.target.value)} required {...a11y(id('interest'), errors.interest)}>
          <option value="" disabled>
            Choose one
          </option>
          {interestAreas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </Field>

      <Field id={id('message')} label="Tell us about the opportunity" hint="Your business, the idea or challenge, and what you’d like to achieve." error={errors.message}>
        <textarea name="message" rows={6} maxLength={LIMITS.message} required {...a11y(id('message'), errors.message, true)} />
      </Field>

      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>Leave this field empty</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div ref={turnstileEl} />
      {turnstileFailed && (
        <p className="text-sm text-slate">
          Our spam check didn’t load. If sending fails, email us at{' '}
          <a className="text-deep underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
        </p>
      )}

      <p className="text-sm text-slate">
        We’ll only use these details to reply to your enquiry. See our{' '}
        <a href="/privacy" className="text-deep underline underline-offset-2">privacy notice</a>.
      </p>

      <div ref={status.kind === 'failed' ? statusRef : undefined} tabIndex={-1} role="alert" className="outline-none empty:hidden">
        {status.kind === 'failed' && (
          <p className="rounded-xl border border-[#b3261e]/30 bg-[#fdf1f0] p-4 text-sm text-[#7a1a14]">
            {status.message} If it keeps happening, email us at{' '}
            <a className="font-semibold underline" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
          </p>
        )}
      </div>

      <div>
        <button type="submit" disabled={submitting} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
          {submitting ? 'Sending…' : 'Send enquiry'}
          {!submitting && <span className="btn-arrow" aria-hidden="true">→</span>}
        </button>
      </div>
    </form>
  );
}

function a11y(id: string, error: string | undefined, hasHint = false) {
  const describedBy = [hasHint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');
  return {
    id,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy || undefined,
    className: `field-input${error ? ' is-invalid' : ''}`,
  };
}

function Field({ id, label, optional, hint, error, children }: { id: string; label: string; optional?: boolean; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="font-semibold text-midnight">
        {label}
        {optional && <span className="ml-2 text-sm font-normal text-slate">Optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 text-sm text-slate">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}
