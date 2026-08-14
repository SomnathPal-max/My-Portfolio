# Somnath Pal — animated portfolio

This is a self-contained portfolio site. Open `index.html` in any modern browser; there is no installation or build step.

## Content included

The site is now populated from your supplied profile PDF and public GitHub profile: your B.Tech CSE status at JIS College of Engineering, core skills, internship focus, email, and three public projects (LawShield, SomSphere, and NeuroSort AI).

Open `index.html` and update these areas:

1. The hero’s eyebrow and short intro.
2. The About section and quick-fact chips.
3. Each card within `<section class="work">` — project name, type, year, description, and link.
4. Your contact email and social links.

The visual covers are entirely CSS, so the site works without images. To use project images later, replace the contents of each `.cover` element with an `<img>` tag and add `object-fit: cover` styling.

## Included motion

- Intro loader and typographic entrance
- Ambient particle field, cursor interaction, and scroll indicator
- Scroll-triggered reveals, animation on project hover, and text marquee
- Responsive mobile navigation
- `prefers-reduced-motion` support for visitors who disable animation

## Security

The site includes a strict browser Content Security Policy and deployment-ready security headers for Vercel and Netlify/Cloudflare Pages. Read `SECURITY.md` before adding integrations, analytics, or a contact form.
