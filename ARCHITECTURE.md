# Guidebook Template — Architecture & Developer Guide

## Overview

This project is a **Single Page Application (SPA)** built with vanilla HTML + CSS + TypeScript — no front-end framework. It uses native browser APIs (Web Components, `<dialog>`, History API) and Vite purely as a dev server and bundler.

The same codebase serves multiple properties. Switching properties is a single import line change in one file. Each property is deployed as its own independent copy of this repo.

**Key architectural decision:** SPA with History API routing instead of Multi-Page Application (MPA). This eliminates the navbar flash/jump that guests noticed during navigation — the navbar stays mounted permanently while only the content area updates.

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
│   │   ├── guide-navbar.ts        ← <guide-navbar> Web Component (SPA-aware, updates title)
│   │   ├── guide-drawer.ts        ← <guide-drawer> slide-in nav Web Component (data-route links)
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
│   │   ├── main.ts                ← SPA entry point (init router, components, PWA)
│   │   ├── router.ts              ← History API router (client-side navigation)
│   │   ├── layout.ts              ← legacy bootstrap (deprecated, use main.ts)
│   │   └── *.ts                   ← legacy page entry points (deprecated)
│   │
│   ├── styles/
│   │   └── global.css             ← full design system via CSS custom properties
│   │
│   ├── index.html                 ← single SPA shell (navbar, drawer, mount point)
│   ├── _backup_html/              ← legacy HTML files (MPA backup)
│   │   └── *.html                 ← old page shells (not used in SPA mode)
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
│   ├── topography*.svg            ← background patterns for each page theme
│   ├── _headers                   ← Cloudflare Pages security headers
│   ├── _routes.json               ← Cloudflare Pages routing rules
│   └── _redirects                 ← SPA redirect rules (all paths → index.html)
│
├── vite.config.ts                 ← Vite + PWA configuration (SPA build)
├── sync-to-repos.sh               ← sync template changes to property repos
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## How the SPA works

This is a **Single Page Application** with one `index.html` shell and client-side routing:

```
src/index.html          ← single SPA shell (navbar, drawer, mount point, PWA toast)
src/scripts/main.ts     ← SPA entry point (initializes router, components, PWA)
src/scripts/router.ts   ← History API router (handles navigation without page reloads)
```

### Navigation flow

1. **Initial load**: `index.html` loads, `main.ts` initializes the router and mounts the initial route content
2. **Click navigation**: Drawer links use `data-route="/arrival"` instead of `href="arrival.html"`
3. **Router intercepts**: `router.ts` catches the click, prevents default, calls `navigateTo('/arrival')`
4. **Content swap**: Router updates `document.body.className` for background, calls section renderer, injects HTML into `#page-content`
5. **History update**: `history.pushState()` updates the URL to `/arrival` without page reload
6. **Navbar update**: `guide-navbar` component updates its title attribute (navbar stays mounted, never flashes)

### Router example

```ts
// src/scripts/router.ts - route definition
const routes = [
  {
    path: "/arrival",
    render: () => renderDirections() + renderCheckIn() + renderFoodShopping(),
    title: "Arrival",
    bodyClass: "bg-arrival",
  },
  // ... other routes
];
```

Section renderers are plain functions that return HTML strings built from the active property's JSON data — same as before, but now called dynamically by the router.

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

**Applying template changes:** run `./sync-to-repos.sh` from this repo. This copies:

- All TypeScript components and scripts
- CSS styles
- The SPA `index.html` shell
- `vite.config.ts` and `public/_redirects`

Then commits and pushes to both property repos.

**SPA routing on Cloudflare Pages:** The `public/_redirects` file ensures all routes (`/arrival`, `/emergency`, etc.) serve `index.html`. Without this, direct URL access would 404.

---

## Web Components

Three custom elements are registered globally via `src/scripts/main.ts`:

| Element          | File              | Purpose                                                       |
| ---------------- | ----------------- | ------------------------------------------------------------- |
| `<guide-navbar>` | `guide-navbar.ts` | Fixed top bar with logo, dynamic title, menu button           |
| `<guide-drawer>` | `guide-drawer.ts` | Slide-in sidebar navigation (SPA-aware with data-route links) |
| `<guide-modal>`  | `guide-modal.ts`  | Wraps native `<dialog>` for info modals                       |

All three are standard Custom Elements — no polyfill needed. They read from the active property config to show the correct logo, name and subtitle.

**SPA-specific behaviors:**

- `guide-navbar`: Updates its `title` attribute dynamically when the route changes (navbar never remounts)
- `guide-drawer`: Uses `data-route` attributes instead of `href` for links; closes automatically after navigation

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

**Note:** We intentionally do NOT use the CSS View Transitions API for SPA navigation — even though it's available, it causes a flash on the navbar because it captures element snapshots. The router performs instant content swaps instead for zero-flash navigation.

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
