# Security posture

This is a static portfolio. It does not collect visitor data, accept user input, use authentication, store secrets, or execute third-party JavaScript. Its safest deployment is a static HTTPS host.

## Protections included

- A restrictive Content Security Policy permits only local scripts and styles, plus the two required Google Fonts domains.
- HTTPS-only transport, MIME-type sniffing protection, clickjacking protection, referrer controls, browser-feature restrictions, and cross-origin isolation headers.
- All new-tab links use `noopener noreferrer` to prevent the linked site from accessing the original page.
- Client-side animations construct DOM nodes directly rather than inserting generated HTML strings.
- No API key, token, password, analytics identifier, contact-form provider, or other secret is present in the published files.

## Deployment

The portfolio includes equivalent header configuration for Vercel (`vercel.json`) and Netlify or Cloudflare Pages (`_headers`). Deploy the contents of this folder as the site root and use one of those configurations.

GitHub Pages does not apply custom HTTP security headers. If you use GitHub Pages, the in-page CSP still applies, but Vercel, Netlify, or Cloudflare Pages is the stronger option.

## Rules for future changes

1. Never commit `.env` files, API keys, tokens, private certificates, or database passwords. Anything shipped to a browser is public.
2. Keep the CSP in `index.html`, `vercel.json`, and `_headers` aligned whenever you add a new script, font, image host, or form endpoint.
3. Prefer a server-side form provider with spam protection if you add a contact form. Do not send email credentials from browser JavaScript.
4. Keep dependencies at zero where practical. If you later add packages, pin versions and audit them before deployment.
5. Deploy only on HTTPS. Do not weaken the security headers merely to accommodate HTTP hosting.

## Security contact

Report a potential security issue privately to `somnathpalstudy@gmail.com` rather than publishing sensitive details in a public issue.
