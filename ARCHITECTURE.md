# Guidebook Template — Architecture & Developer Guide

## Overview

This project is a **vanilla HTML + CSS + TypeScript** property guidebook, built without any front-end framework. It uses native browser APIs (Web Components, `<dialog>`) and Vite purely as a dev server and bundler.

The same codebase serves multiple properties. Switching properties is a single import line change in one file.

---

## Project structure

```
guidebook-template/
├── src/
│   ├── data/
│   │   ├── config.ts          ← THE switch: change this import to change property
│   │   ├── cottage.json       ← all cottage content and data
│   │   ├── barn.json          ← all barn content and data
│   │   └── types.ts           ← TypeScript interfaces for the JSON schema
│   │
│   ├── components/
│   │   ├── guide-navbar.ts    ← <guide-navbar> Web Component
│   │   ├── guide-drawer.ts    ← <guide-drawer> slide-in nav Web Component
│   │   ├── guide-modal.ts     ← <guide-modal> native <dialog> Web Component
│   │   ├── guide-pwa.ts       ← PWA service worker registration + toast UI
│   │   └── sections.ts        ← HTML string renderers for every page section
│   │
│   ├── icons/
│   │   └── icons.ts           ← all SVG icons as inline strings (no icon font)
│   │
│   ├── scripts/
│   │   ├── layout.ts          ← shared bootstrap imported by every page
│   │   ├── index.ts           ← home page
│   │   ├── arrival.ts
│   │   ├── house-manual.ts
│   │   ├── emergency.ts
│   │   ├── departure.ts
│   │   ├── places-to-eat.ts
│   │   ├── attractions.ts
│   │   └── beaches.ts
│   │
│   ├── styles/
│   │   └── global.css         ← full design system via CSS custom properties
│   │
│   ├── index.html             ← home page shell
│   ├── arrival.html
│   ├── house-manual.html
│   ├── emergency.html
│   ├── departure.html
│   ├── places-to-eat.html
│   ├── attractions.html
│   ├── beaches.html
│   └── vite-pwa.d.ts          ← type declaration for virtual:pwa-register
│
├── public/
│   ├── images/
│   │   ├── the-cottage-exterior.webp
│   │   ├── the-barn-exterior.webp
│   │   ├── beaches/           ← 10 beach images
│   │   └── attractions/       ← 18 attraction images
│   ├── icons/
│   │   └── logo-150.webp
│   ├── favicon.svg
│   ├── _headers               ← Cloudflare Pages security headers
│   └── _routes.json           ← Cloudflare Pages routing rules
│
├── vite.config.ts             ← Vite + PWA configuration
├── tsconfig.json              ← TypeScript configuration
├── package.json
└── .gitignore
```

---

## How a page works

Each page is a pair of files:

```
src/arrival.html        ← static HTML shell (navbar, drawer, mount point, PWA toast)
src/scripts/arrival.ts  ← imports layout + calls section renderers, injects HTML
```

The HTML shell is minimal — it contains the Web Component tags and a `<div id="page-content">` mount point. The TypeScript entry script does the rest at runtime:

```ts
// src/scripts/arrival.ts
import '../scripts/layout';                                    // registers Web Components
import { renderCheckIn, renderDirections, renderFoodShopping } from '../components/sections';

const mount = document.getElementById('page-content')!;
mount.innerHTML = renderCheckIn() + renderDirections() + renderFoodShopping();
```

The section renderers (`sections.ts`) are plain functions that return HTML strings built from the active property's JSON data.

---

## Switching properties

**`src/data/config.ts`** is the single source of truth for which property is active:

```ts
import data from './cottage.json';   // ← cottage
// import data from './barn.json';   // ← barn
```

Change the active import, rebuild, deploy. Every page, every section, every piece of content updates automatically.

---

## Adding a new property

1. Copy `src/data/cottage.json` → `src/data/myplace.json`
2. Edit all fields: `property`, `contact`, `hero`, `arrival`, `houseManual`, `departure`, `emergency`, `restaurants`, `beaches`, `attractions`, `shopping`
3. Add the hero image to `public/images/`
4. In `config.ts`, import `myplace.json`
5. `npm run build`

No code changes needed — only data.

---

## Creating a deployed copy for a specific property

```bash
cd /Users/johnfchurch/Projects/deployed-websites/cloudflare
cp -R guidebook-template myplace-guidebook
```

Then in `myplace-guidebook/src/data/config.ts` switch the import. Each deployed copy is independent — changes to one don't affect others unless you deliberately sync them.

---

## Web Components

Three custom elements are registered globally via `src/scripts/layout.ts`:

| Element | File | Purpose |
|---------|------|---------|
| `<guide-navbar>` | `guide-navbar.ts` | Fixed top bar with logo and menu button |
| `<guide-drawer>` | `guide-drawer.ts` | Slide-in sidebar navigation |
| `<guide-modal>` | `guide-modal.ts` | Wraps native `<dialog>` for info modals |

All three are standard Custom Elements (`customElements.define`). They work in every modern browser with no polyfill. They read from the active property config to show the correct logo, name and subtitle.

**Opening/closing the drawer:**
```js
// open
document.querySelector('guide-drawer').open()
// close
document.querySelector('guide-drawer').close()
```

**Opening a modal:**
```html
<guide-modal id="my-modal" title="WiFi" icon-html="...">
  <p>The WiFi code is in the property.</p>
</guide-modal>
<button onclick="document.getElementById('my-modal').showModal()">More info</button>
```

---

## Design system

All visual tokens live in CSS custom properties in `src/styles/global.css`:

```css
:root {
  --color-primary: #c5a880;       /* warm tan — brand colour */
  --color-foreground: hsl(...);   /* body text */
  --color-surface: rgba(...);     /* card backgrounds */
  --color-arrival: #374151cc;     /* section accent colours */
  --color-emergency: #b91c1ccc;
  --color-manual: #0e7490cc;
  /* ... etc */
}
```

Dark mode is supported via a `.dark` class on `<html>` — the custom properties are overridden in a `.dark {}` block.

There is no Tailwind. All layout is done with standard CSS (flexbox, grid, custom properties). Class names are readable English — `.section-card`, `.navbar`, `.drawer-panel`, `.link-card` etc.

---

## PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. On build it generates:

- `dist/sw.js` — Workbox service worker
- `dist/workbox-*.js` — Workbox runtime
- `dist/manifest.webmanifest` — PWA manifest

The service worker precaches all HTML, CSS, JS and image assets. Images are served from a `CacheFirst` cache (30 day expiry, max 100 entries), so the app works fully offline after first visit.

The PWA toast (update available / offline ready) is rendered in each HTML page and wired up in `guide-pwa.ts`.

---

## Cloudflare Pages deployment

| File | Purpose |
|------|---------|
| `public/_headers` | Security headers (CSP, HSTS, XSS protection, cache rules) |
| `public/_routes.json` | Tells Cloudflare which paths are routed vs served as static files |

**Build settings in Cloudflare Pages dashboard:**

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 18+ |

---

## Data schema reference

The JSON files follow this structure (defined in `src/data/types.ts`):

```
property        — name, subtitle, logo, heroImage, themeColor, siteUrl
contact         — address, email, phones, what3words, mapEmbed, directions
hero            — heading, body text
arrival         — checkIn, access, welcomePack, wifi (each: summary + detail[])
houseManual     — intro, facilities[] (id, icon, title, summary, detail[], links?)
departure       — intro, items[] (id, icon, title, summary, detail[])
emergency       — fire, medical, police (each: summary + steps/detail[])
restaurants[]   — name, location, description, url, hearts (0–3)
beaches[]       — name, location, url, description, image
attractions[]   — name, location, url, description, image
shopping[]      — name, location, url, mapEmbed
```

---

## Development commands

```bash
npm run dev      # start dev server at http://localhost:5173 with HMR
npm run build    # TypeScript check + production build → dist/
npm run preview  # serve the dist/ build locally
```

---

## Dependencies

Intentionally minimal:

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^6 | Dev server + bundler |
| `typescript` | ^5 | Type checking |
| `vite-plugin-pwa` | ^0.21 | PWA manifest + Workbox service worker |
| `workbox-window` | ^7 | Client-side SW registration helper |

No framework. No component library. No CSS preprocessor. No icon font.
The only runtime dependency is `workbox-window` — everything else is compiled away by Vite at build time.


"I have a vanilla HTML/CSS/TypeScript guidebook template at /Users/johnfchurch/Projects/deployed-websites/cloudflare/guidebook-template. I want to add browser-based content editing. The architecture is documented in ARCHITECTURE.md. Let's continue from where we left off."