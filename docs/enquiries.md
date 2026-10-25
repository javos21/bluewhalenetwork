# Enquiry pipeline

```
Contact form (React island, src/components/contact/EnquiryForm.tsx)
  │  JSON + Turnstile token
  ▼
POST /api/enquiry (Pages Function, functions/api/enquiry.ts)
  │  rate limit → honeypot → validation → Turnstile check
  ▼
Google Apps Script web app on Nic's account (apps-script/Code.gs)
  ├─ appends a row to the "Leads" tab of the "Blue Whale Leads" sheet
  └─ emails Nic, with Reply-To set to the enquirer
```

Validation rules live once, in `src/lib/enquiry.ts`, and the form and the
Function both use them.

## What a visitor sees

- `/contact?interest=Growth%20strategy&offer=growth-strategy` (the link on
  every offer page) pre-selects the area of interest and shows
  "Enquiring about Growth Strategy".
- UTM tags on the URL (e.g. from a QR sticker) travel with the enquiry into
  the sheet.
- Errors appear under each field, and focus jumps to the first one.
- On success the form is replaced by the confirmation message.
- If the server can't be reached, the error message gives Nic's email address.

## Setup on Nic's Google account (one time, ~15 minutes)

Do this signed in as Nic, or as Javed on a sheet Nic owns and has shared
with edit access. The script runs as whoever deploys it, and the emails come
from that account.

1. Create a Google Sheet called **Blue Whale Leads**.
2. **Extensions → Apps Script.** Replace the contents of `Code.gs` with
   [`apps-script/Code.gs`](../apps-script/Code.gs) and save.
3. **Project settings → Script properties**, add:
   - `TOKEN`: a long random string. Generate one with
     `openssl rand -hex 32`. Keep it; it goes into Cloudflare in the next section.
   - `NOTIFY_EMAIL`: `bluewhaleconsultingservices@gmail.com` (or a
     comma-separated list).
4. In the editor, pick the `setup` function and **Run**. Approve the
   permissions prompt (Sheets and send email). This creates the header row.
5. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** (the Function calls it without a Google
     sign-in; the `TOKEN` is what keeps everyone else out)
6. Copy the **Web app URL** (ends in `/exec`). Open it in a browser; you
   should see `{"ok":true,"service":"blue-whale-enquiries"}`.

After editing the script later, use **Deploy → Manage deployments → Edit →
New version**. That keeps the same URL. A *new deployment* gives a new URL,
which would need updating in Cloudflare.

## Setup on Cloudflare

1. **Turnstile → Add widget**. Name it "Blue Whale contact", and add the
   hostnames `bluewhalenetwork.com` and `<project>.pages.dev` (this
   covers branch previews). Mode: **Managed**. Copy the site key and the
   secret key.
2. **Pages project → Settings → Variables and secrets**, for both
   **Production** and **Preview**:

   | Name | Type | Value |
   |---|---|---|
   | `PUBLIC_TURNSTILE_SITE_KEY` | Plain text | Turnstile site key |
   | `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key |
   | `APPS_SCRIPT_URL` | Secret | the `/exec` URL from above |
   | `APPS_SCRIPT_TOKEN` | Secret | the same `TOKEN` as the script |

3. Redeploy so the build picks up `PUBLIC_TURNSTILE_SITE_KEY`.

### Behaviour when something isn't set

| Missing | Preview / local | Production |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare's always-pass test key | Test key too, so set it before launch |
| `TURNSTILE_SECRET_KEY` | Always-pass test secret | Form returns an error (fails closed) |
| `APPS_SCRIPT_URL` / `TOKEN` | **Dry run**: checks run, the enquiry is logged in the Function logs, the visitor sees success | Form returns an error with Nic's email |

So branch previews work for clicking through before the Google side exists,
but no enquiry is stored or emailed until `APPS_SCRIPT_URL` is set.

## Testing locally

```bash
npm run build
npx wrangler pages dev dist        # site + Function on http://localhost:8788
```

Without a `.dev.vars` file this runs in dry-run mode. To send real test rows,
create `.dev.vars` (it's gitignored):

```
APPS_SCRIPT_URL=https://script.google.com/macros/s/…/exec
APPS_SCRIPT_TOKEN=…
```

## Done when

A test enquiry sent from a phone on the preview link appears as a new row in
the Leads sheet and as an email in Nic's inbox, and replying to that email
goes to the address entered on the form.

## Limits and choices

- **Rate limit:** 5 enquiries per IP per 10 minutes, counted per Cloudflare
  location in the edge cache. It's a backstop behind Turnstile, not a hard
  global limit.
- **Honeypot:** a hidden `website` field. If it's filled in, the Function
  says "ok" and drops the enquiry, so bots get no signal.
- **Email quota:** Apps Script on a consumer Gmail account can send about 100
  emails a day, far above what this form needs.
- **No CRM yet.** If Nic picks one, swap the Apps Script call in the
  Function for the CRM's API and leave the form untouched.
- **Analytics:** the form dispatches `bw:enquiry` events on `window`
  (`stage: start | submit | error`) for the GA4 work in step 8.
