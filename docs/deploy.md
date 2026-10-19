# Deploying to Cloudflare Pages

## One-time setup

1. In the Cloudflare dashboard, create a **Pages** project and connect it to
   the `javos21/bluewhalenetwork` GitHub repo.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Production branch: `main`
3. Environment variables:

   | Variable | Production | Preview |
   |---|---|---|
   | `NODE_VERSION` | `22` | `22` |
   | `PUBLIC_SITE_ENV` | `production` | *(unset)* |
   | `PUBLIC_SHOW_LABS` | *(unset)* | `true` |

After setup, every push to any branch gets its own `https://<branch>.<project>.pages.dev`
link to share with Nic. Preview links are `noindex` and include `/labs`.

## Launch day (needs Nic's GoDaddy account)

1. **Before touching DNS**, record Nic's existing GoDaddy DNS records,
   especially **MX**, **TXT** (SPF/DKIM/DMARC) and any CNAMEs for email.
2. Add `bluewhalenetwork.com` to Cloudflare. Check that every record from
   step 1 was imported, and add any that are missing.
3. Nic (or Javed as his GoDaddy delegate) changes the domain's nameservers at
   GoDaddy to the two Cloudflare nameservers.
4. In the Pages project, add the custom domains `bluewhalenetwork.com` and
   `www.bluewhalenetwork.com`, and redirect `www` to the root.
5. Send a test email to Nic's address on the domain to confirm mail still works.
6. Turn off the old GoDaddy Website Builder site once the new one is live.
