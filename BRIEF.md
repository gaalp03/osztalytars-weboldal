# Brief: Macher Mihály — photographer portfolio website

**Repo:** https://github.com/gaalp03/osztalytars-weboldal (private)  
**Assignee:** Claude Code (Opus)  
**Language of this brief:** English  
**Language of the finished site:** **Hungarian only** (all UI labels, headings, meta, alt text, buttons)

---

## Who

**Macher Mihály**, 16-year-old photographer. Focus: **concert photography**, also portraits. ~6 years shooting. This is a clean personal portfolio site for school / clients — not a SaaS landing page.

Use his About text **verbatim** (do not rewrite, shorten, or “improve”):

> Macher Mihály vagyok, 16 éves fotós, és már 6 éve foglalkozom fotózással. Ez idő alatt a fotózás a szenvedélyemmé vált, különösen a különleges pillanatok és hangulatok megörökítése.
>
> Elsősorban koncertfotózással foglalkozom, de nagyon szívesen csinálok portrékat is. Szeretem elkapni azokat az egyedi pillanatokat, amelyek visszaadják egy koncert energiáját, hangulatát és az ott átélt élményeket.
>
> Célom, hogy minden eseményről olyan képek készüljenek, amelyek nemcsak megmutatják, hanem újra át is adják az adott pillanat hangulatát!

**Do not invent** clients, awards, prices, fake Instagram/email, fake event names, or fake portrait shots. Contact fields = clear `TODO` placeholders only.

---

## Design direction (critical)

Goal: **premium editorial / gallery photographer site**. Must **not** look AI-generated or template-like.

### Avoid hard
- Generic purple/blue gradient heroes, glow orbs, glassmorphism stacks
- Emoji in UI
- Stock “hero + 3 feature cards + testimonials” SaaS layout
- Inter / Roboto / system-ui only with no personality
- Over-animated particle backgrounds, autoplay video wallpaper
- Fake “trusted by” logos or star ratings

### Do instead
- Dark or near-black / charcoal base that suits concert photos (deep blacks, muted warm or cool neutrals; optional subtle warm highlight accent — not neon purple)
- Strong typography: distinctive display face for name / section titles + refined body (self-hosted or well-chosen Google font pair). Hungarian diacritics must render correctly (ő, ű, á, é, í, ó, ú, Ö, Ű…)
- Generous whitespace; images are the product — let them breathe
- Asymmetric or masonry / editorial gallery rhythm (not a boring equal 3-column card grid of identical crops)
- Thin rules, quiet captions, museum/gallery restraint
- Mobile-first, fast, high polish

---

## Motion

Tasteful scroll-driven motion is wanted:
- Reveal-on-scroll for sections and gallery items (opacity + slight translate / clip)
- Optional subtle parallax on hero or About image (very light)
- Smooth lightbox open/close and image crossfade
- Respect `prefers-reduced-motion: reduce` (disable or simplify all motion)
- Keep 60fps on mid phones; no heavy scroll-jacking libraries if a few IntersectionObserver + CSS transitions suffice

---

## Site structure (single page is fine)

Suggested Hungarian section labels:

1. **Hero** — full-bleed or large treatment with one strong concert photo; name **Macher Mihály**; short tagline e.g. `Koncert- és portréfotó` (do not invent longer slogans). Nav: Bemutatkozás · Portfólió · Kapcsolat
2. **Bemutatkozás** — use `images/intro.jpg` (and `.webp` via `<picture>`). Layout: photo + the verbatim About paragraphs. Portrait-friendly crop on mobile if needed.
3. **Portfólió** — gallery of his work (`concert-01` … `concert-09`). Currently **all images are concert**; no separate portrait set yet.  
   - Either skip category filters for now, **or** add a filter UI with only `Összes` / `Koncert` and leave a clean hook for `Portré` later — do **not** invent portrait images.  
   - Click → accessible lightbox (keyboard Esc, arrows, focus trap, aria labels in Hungarian).  
   - Lazy-load gallery images (`loading="lazy"`, proper `width`/`height` or aspect-ratio to avoid CLS). Prefer `<picture>` with WebP + JPEG fallback.
4. **Kapcsolat** — heading `Kapcsolat`; placeholders clearly marked, e.g.  
   - Email: `TODO: email cím`  
   - Instagram: `TODO: Instagram`  
   No fake social proof. Optional short CTA in Hungarian like `Írj nekem` only if it stays honest.

Footer: © year + Macher Mihály. No “Made with AI” badge.

---

## Tech

- Static site, deployable on **GitHub Pages** from this repo
- Prefer: Vite + vanilla HTML/CSS/JS, or plain HTML/CSS/JS. If you use a framework, build must emit static assets with a Pages-friendly `base` (repo may be project site under `/osztalytars-weboldal/` — configure base path accordingly **or** document how to enable Pages from `/docs` or `gh-pages`)
- No backend, no auth
- Semantic HTML, good Hungarian SEO: `<title>`, meta description, Open Graph using one concert image + intro
- Alt texts in Hungarian, descriptive but short (see image list below)
- Responsive breakpoints; touch-friendly lightbox
- Commit `images/` as provided; do not recompress destructively

---

## Image assets (put / already in repo at `images/`)

Source originals live outside the brief; **use only these web-optimized files**. Each has `.jpg` and `.webp`. Long edge ≤ 2400px, quality ~82, EXIF/GPS stripped, orientation baked in.

| File | Role | Description (for alt / curator notes) |
|------|------|----------------------------------------|
| `intro.jpg` / `intro.webp` | Bemutatkozás portrait of Mihály | Mihály standing, black outfit, holding a gimbal + camera rig; festive tinsel + green balloon backdrop. **About photo only — not portfolio work.** |
| `concert-01.jpg` / `.webp` | Portfolio | Outdoor/dusk concert: male vocalist in profile at mic, mohawk, sunglasses, rim light, twilight bokeh. |
| `concert-02.jpg` / `.webp` | Portfolio | Stage: double-bass player with theatrical face makeup, dark navy shirt, dramatic side light. |
| `concert-03.jpg` / `.webp` | Portfolio | Singer with acoustic guitar from behind/side toward audience; blue stage light, crowd with phone in bokeh. |
| `concert-04.jpg` / `.webp` | Portfolio | Indoor stage: keyboardist in blue check shirt + bun, drums + guitarist behind, blue/purple lights, bookshelf. |
| `concert-05.jpg` / `.webp` | Portfolio | Band + crowd celebratory group shot from stage, mics in foreground, LED ticker in background. |
| `concert-06.jpg` / `.webp` | Portfolio | Guitarist in profile under blue/purple foggy stage light, mic stand, electric guitar. |
| `concert-07.jpg` / `.webp` | Portfolio | Intense guitarist mid-performance, closed eyes, green stage fog, Union Jack strap. |
| `concert-08.jpg` / `.webp` | Portfolio | Singer in LA cap + sunglasses + leather jacket, handheld mic, lime/yellow key light on black. |
| `concert-09.jpg` / `.webp` | Portfolio | Bassist profile with neon-green electric bass, monochrome lime stage wash. |

Original filenames mapping (for reference only; do not show on site):  
`IMG_2127.JPG` → intro · `DSC08655` → 01 · `DSC09247` → 02 · `DSC09524` → 03 · `DSC09535` → 04 · `DSC09668` → 05 · `EGM08580` → 06 · `EGM08631` → 07 · `EGM08813` → 08 · `EGM09073` → 09

Hero: pick one strong concert frame (e.g. `concert-01`, `concert-07`, or `concert-08`) — not the intro selfie/portrait.

---

## Acceptance checklist

- [ ] Entire visible UI in Hungarian; About text exact match
- [ ] Looks like a photographer portfolio, not an AI SaaS template
- [ ] Scroll motion present but subtle; reduced-motion respected
- [ ] Gallery + lightbox works on mobile and desktop
- [ ] Images lazy-loaded; WebP where supported
- [ ] Builds to static; GitHub Pages deploy documented or configured
- [ ] Contact placeholders marked TODO; no invented facts
- [ ] No emoji, no purple glow, no stock 3-card layout

Ship a polished first version in this repo (README with local run + Pages notes). Ask only if something blocking is missing (e.g. real email/IG).
