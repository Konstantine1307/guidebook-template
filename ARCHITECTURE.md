# Guidebook Template — Architecture & Developer Guide

## Overview

This project is a **vanilla HTML + CSS + TypeScript** property guidebook, built without any front-end framework. It uses native browser APIs (Web Components, `<dialog>`, View Transitions) and Vite purely as a dev server and bundler.

The same codebase serves multiple properties. Switching properties is a single import line change in one file. Each property is deployed as its own independent copy of this repo.

---

## Project structure

```
guidebook-template/
├── src/
│   ├── data/
│   │   ├── config.ts              ← THE switch: change this import to change property
│   │   ├── cottage.json           ← all cottage content and data
│   │   ├── barn.json              ← all barn content and data
│   │   └── types.ts               ← TypeScript interfaces for the JSON schema
│   │
│   ├── components/
│   │   ├── guide-navbar.ts        ← <guide-navbar> Web Component
│   │   ├── guide-drawer.ts        ← <guide-drawer> slide-in nav Web Component
│   │   ├── guide-modal.ts         ← <guide-modal> native <dialog> Web Component
│   │   ├── guide-pwa.ts           ← PWA service worker registration + toast UI
│   │   └── sections/
│   │       ├── helpers.ts         ← shared utilities (sectionRow, sectionCard, etc.)
│   │       ├── arrival.ts         ← renderCheckIn
│   │       ├── directions.ts      ← renderDirections
│   │       ├── food-shopping.ts   ← renderFoodShopping
│   │       ├── house-manual.ts    ← renderHouseManual
│   │       ├── emergency.ts       ← renderEmergency
│   │       ├── departure.ts       ← renderDeparture
│   │       ├── restaurants.ts     ← renderRestaurants
│   │       ├── beaches.ts         ← renderBeaches
│   │       ├── attractions.ts     ← renderAttractions
│   │       └── index.ts           ← re-exports all render functions
│   │
│   ├── icons/
│   │   └── icons.ts               ← all SVG icons as inline strings (no icon font)
│   │
│   ├── scripts/
│   │   ├── layout.ts              ← shared bootstrap imported by every page
│   │   ├── index.ts               ← home page
│   │   ├── arrival.ts
│   │   ├── house-manual.ts
│   │   ├── emergency.ts
│   │   ├── departure.ts
│   │   ├── places-to-eat.ts
│   │   ├── attractions.ts
│   │   └── beaches.ts
│   │
│   ├── styles/
│   │   └── global.css             ← full design system via CSS custom properties
│   │
│   ├── index.html                 ← home page shell
│   ├── arrival.html
│   ├── house-manual.html
│   ├── emergency.html
│   ├── departure.html
│   ├── places-to-eat.html
│   ├── attractions.html
│   ├── beaches.html
│   └── vite-pwa.d.ts              ← type declaration for virtual:pwa-register
│
├── public/
│   ├── images/
│   │   ├── the-cottage-exterior.webp
│   │   ├── the-barn-exterior.webp
│   │   ├── beaches/               ← beach photos
│   │   └── attractions/           ← attraction photos
│   ├── icons/
│   │   └── logo-150.webp
│   ├── favicon.svg
│   ├── _headers                   ← Cloudflare Pages security headers
│   └── _routes.json               ← Cloudflare Pages routing rules
│
├── vite.config.ts                 ← Vite + PWA configuration (reads JSON at build time)
├── tsconfig.json
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
import "../scripts/layout";
import {
  renderCheckIn,
  renderDirections,
  renderFoodShopping,
} from "../components/sections";

const mount = document.getElementById("page-content")!;
mount.innerHTML = renderCheckIn() + renderDirections() + renderFoodShopping();
```

Section renderers are plain functions that return HTML strings built from the active property's JSON data.

---

## Switching properties

**`src/data/config.ts`** is the single source of truth for which property is active:

```ts
import data from "./cottage.json"; // ← cottage
// import data from './barn.json';   // ← barn
```

Change the active import, rebuild, deploy. Every page, every section, every piece of content — including PWA manifest name, theme colour, page titles and meta descriptions — updates automatically.

---

## Deploying a property

Each property gets its own copy of this repo on GitHub, connected to Cloudflare Pages:

```
guidebook-template  (this repo — source of truth, never deployed)
       │
       ├── cottage-guidebook   (config.ts → cottage.json)
       └── barn-guidebook      (config.ts → barn.json)
```

**Cloudflare Pages build settings:**

| Setting                | Value           |
| ---------------------- | --------------- |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Node version           | 18+             |

**Updating content:** edit the JSON file directly on GitHub — Cloudflare Pages rebuilds and redeploys automatically.

**Applying template changes:** make the change in this repo, then manually apply it to the deployed repos.

---

## Web Components

Three custom elements are registered globally via `src/scripts/layout.ts`:

| Element          | File              | Purpose                                        |
| ---------------- | ----------------- | ---------------------------------------------- |
| `<guide-navbar>` | `guide-navbar.ts` | Fixed top bar with logo, title and menu button |
| `<guide-drawer>` | `guide-drawer.ts` | Slide-in sidebar navigation                    |
| `<guide-modal>`  | `guide-modal.ts`  | Wraps native `<dialog>` for info modals        |

All three are standard Custom Elements — no polyfill needed. They read from the active property config to show the correct logo, name and subtitle.

---

## Section renderers

`src/components/sections/` contains one file per section. Each exports a single `render*()` function that returns an HTML string.

| File               | Export               | Used on page  |
| ------------------ | -------------------- | ------------- |
| `arrival.ts`       | `renderCheckIn`      | arrival       |
| `directions.ts`    | `renderDirections`   | arrival       |
| `food-shopping.ts` | `renderFoodShopping` | arrival       |
| `house-manual.ts`  | `renderHouseManual`  | house-manual  |
| `emergency.ts`     | `renderEmergency`    | emergency     |
| `departure.ts`     | `renderDeparture`    | departure     |
| `restaurants.ts`   | `renderRestaurants`  | places-to-eat |
| `beaches.ts`       | `renderBeaches`      | beaches       |
| `attractions.ts`   | `renderAttractions`  | attractions   |

Shared utilities (sectionRow, sectionCard, iconBadge, detailParagraphs, etc.) live in `helpers.ts`.

---

## Design system

All visual tokens live in CSS custom properties in `src/styles/global.css`:

```css
:root {
  --color-primary: #c5a880; /* warm tan — brand colour */
  --color-foreground: hsl(...); /* body text */
  --color-surface: rgba(...); /* card backgrounds */
  --color-arrival: #374151cc; /* section accent colours */
  --color-emergency: #b91c1ccc;
  --color-manual: #0e7490cc;
  /* ... etc */
}
```

Dark mode is supported via a `.dark` class on `<html>`. No Tailwind — all layout uses standard CSS (flexbox, grid, custom properties).

Page transitions use the CSS View Transitions API (`@view-transition { navigation: auto; }`), which crossfades between navigations and degrades gracefully on unsupported browsers.

---

## PWA

Configured via `vite-plugin-pwa` in `vite.config.ts`. The config reads the active property JSON at build time so the manifest `name`, `short_name`, `description` and `theme_color` are always correct for the deployed property.

On build it generates:

- `dist/sw.js` — Workbox service worker
- `dist/manifest.webmanifest` — PWA manifest (values from property JSON)

The service worker precaches all HTML, CSS, JS and image assets. Images are served from a `CacheFirst` cache (30 day expiry), so the app works fully offline after first visit.

---

## Data schema reference

The JSON files follow this structure (defined in `src/data/types.ts`):

```
property        — name, title, subtitle, shortName, description, siteUrl,
                  heroImage, logo, themeColor, type
contact         — address, addressFull, email, homePhone, homePhoneHref,
                  contacts[], what3words, what3wordsUrl, mapEmbed,
                  directions[], parking { summary, detail[] }
hero            — heading, body, navbarTitle
arrival         — checkIn, access, welcomePack, wifi (each: summary + detail[])
houseManual     — intro, facilities[] { id, icon, title, summary, detail[], links? }
departure       — label, title, intro, items[] { id, icon, title, summary, detail[] }
emergency       — fire { summary, steps[], note }
                  medical { summary, detail[] }
                  police { summary, detail[] }
sections        — beaches, attractions, restaurants, shopping (each: label, title, intro)
restaurants[]   — name, location, description, url, hearts
beaches[]       — name, location, description, url, image
attractions[]   — name, location, title, description, url, image
shopping[]      — name, location, url, mapEmbed
```
