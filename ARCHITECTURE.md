# Guidebook Template — Architecture & Developer Guide

## Overview

This project is a **Single Page Application (SPA)** built with vanilla HTML + CSS + TypeScript — no front-end framework. It uses native browser APIs (Web Components, `<dialog>`, History API) and Vite purely as a dev server and bundler.

The same codebase serves multiple properties. Switching properties is two import line changes in one file. Each property is deployed as its own independent copy of this repo.

**Key architectural decision:** SPA with History API routing instead of Multi-Page Application (MPA). This eliminates the navbar flash/jump that guests noticed during navigation — the navbar stays mounted permanently while only the content area updates.

---

## Project structure

```
guidebook-template/
├── src/
│   ├── data/
│   │   ├── config.ts              ← THE switch: two imports (EN + DE JSON) to change property
│   │   ├── language.ts            ← runtime language module (initLanguage, getUI, getGuidebook, toggleLanguage)
│   │   ├── cottage.json           ← cottage content (English)
│   │   ├── cottage-de.json        ← cottage content (German)
│   │   ├── barn.json              ← barn content (English)
│   │   ├── barn-de.json           ← barn content (German)
│   │   ├── ui.json                ← shared UI strings (English)
│   │   ├── ui-de.json             ← shared UI strings (German)
│   │   └── types.ts               ← TypeScript interfaces for the JSON schema + UiStrings
│   │
│   ├── components/
│   │   ├── guide-navbar.ts        ← <guide-navbar> — fixed bar, dynamic title, EN/DE dropdown
│   │   ├── guide-drawer.ts        ← <guide-drawer> — slide-in nav, re-renders on language change
│   │   ├── guide-modal.ts         ← <guide-modal>  — native <dialog> wrapper, translated close button
│   │   ├── guide-pwa.ts           ← PWA service worker registration + toast UI
│   │   └── sections/
│   │       ├── helpers.ts         ← shared utilities + re-exports getUI, getGuidebook
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
│   │   └── icons.ts               ← all SVG icons as inline strings (includes languages, chevron-down)
│   │
│   ├── scripts/
│   │   ├── main.ts                ← SPA entry point (initLanguage, router, components, PWA)
│   │   ├── router.ts              ← History API router + language-changed re-render
│   │   └── layout.ts              ← legacy bootstrap (deprecated, use main.ts)
│   │
│   ├── styles/
│   │   └── global.css             ← full design system: CSS custom properties, navbar grid, lang dropdown
│   │
│   ├── index.html                 ← single SPA shell (navbar, drawer, mount point, PWA toast)
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
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## How the SPA works

```
src/index.html          ← single SPA shell (navbar, drawer, mount point, PWA toast)
src/scripts/main.ts     ← entry: initLanguage() → initRouter()
src/scripts/router.ts   ← History API router + language-changed event handler
```

### Navigation flow

1. **Initial load**: `index.html` loads, `main.ts` calls `initLanguage()` then `initRouter()`
2. **`initLanguage()`**: reads `?lang=`, then `localStorage`, then `navigator.language` — sets active language
3. **Click navigation**: Drawer links use `data-route="/arrival"` instead of `href`
4. **Router intercepts**: catches click, calls `navigateTo('/arrival')`
5. **Content swap**: router calls `getGuidebook()` + `getUI()` at render time — returns DE or EN data based on current language
6. **History update**: `history.pushState()` updates URL without page reload
7. **Navbar update**: `guide-navbar` updates its `title` attribute (never remounts)

### Language change flow

1. User clicks the **🇬🇧 EN / 🇩🇪 DE** dropdown in the navbar
2. `toggleLanguage()` flips `_current`, persists to `localStorage`, updates `<html lang>`
3. Dispatches `language-changed` CustomEvent on `window`
4. **Router** listener: re-renders the current route (all content switches language)
5. **Drawer** listener: re-renders nav labels
6. **Navbar** listener: re-renders the title and dropdown button label

---

## Language module (`src/data/language.ts`)

```ts
initLanguage(); // call once at startup — reads ?lang=, localStorage, navigator.language
getUI(); // returns UiStrings for current language (ui.json or ui-de.json)
getGuidebook(); // returns GuidebookData for current language (barn.json or barn-de.json)
getLanguage(); // returns "en" | "de"
toggleLanguage(); // flips language, persists, dispatches language-changed event
```

`getUI()` and `getGuidebook()` are called **at render time** (not at module load), so they always return the current language without needing a page reload.

---

## Switching properties

**`src/data/config.ts`** is the single source of truth for which property is active:

```ts
import dataEn from "./cottage.json";
import dataDe from "./cottage-de.json";
// import dataEn from "./barn.json";
// import dataDe from "./barn-de.json";
```

Change the two active imports, rebuild, deploy. Every page, section, piece of content — including PWA manifest name, theme colour, page titles and meta descriptions — updates automatically.

---

## Deploying a property

Each property gets its own copy of this repo on GitHub, connected to Cloudflare Pages:

```
guidebook-template      (source of truth — never deployed directly)
       │
       ├── cottage-guidebook-v2   (config.ts → cottage.json + cottage-de.json)
       └── barn-guidebook-v2      (config.ts → barn.json    + barn-de.json)
```

**Cloudflare Pages build settings:**

| Setting                | Value           |
| ---------------------- | --------------- |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Node version           | 18+             |

**Updating content:** edit the JSON file directly on GitHub — Cloudflare Pages rebuilds and redeploys automatically.

**Applying template changes:** copy the changed files to both property repos, rebuild and deploy:

```bash
npx wrangler pages deploy dist --project-name barn-guidebook-v2
npx wrangler pages deploy dist --project-name cottage-guidebook-v2
```

**SPA routing on Cloudflare Pages:** `public/_redirects` ensures all routes (`/arrival`, `/emergency`, etc.) serve `index.html`. Without this, direct URL access would 404.

---

## Web Components

| Element          | File              | Purpose                                                                     |
| ---------------- | ----------------- | --------------------------------------------------------------------------- |
| `<guide-navbar>` | `guide-navbar.ts` | Fixed top bar — logo, dynamic title, EN/DE language dropdown                |
| `<guide-drawer>` | `guide-drawer.ts` | Slide-in sidebar navigation — re-renders nav labels on language change      |
| `<guide-modal>`  | `guide-modal.ts`  | Wraps native `<dialog>` — translated close button via `getUI().modal.close` |

All three are standard Custom Elements — no polyfill needed. Each listens for `language-changed` and re-renders the relevant parts.

---

## Section renderers

`src/components/sections/` contains one file per section. Each exports a single `render*()` function that returns an HTML string built from `getGuidebook()` and `getUI()` — called at render time so they always reflect the current language.

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

Shared utilities (`sectionRow`, `sectionCard`, `iconBadge`, `detailParagraphs`, etc.) live in `helpers.ts`, which also re-exports `getUI` and `getGuidebook` for convenience.

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

**Note:** We intentionally do NOT use the CSS View Transitions API for SPA navigation — even though it's available, it causes a flash on the navbar because it captures element snapshots. The router performs instant content swaps instead.

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

The German JSON files (`*-de.json`) follow the exact same schema — all keys identical, values translated.

The UI strings schema is defined as `UiStrings` in `types.ts` and covers navbar, drawer, hero, section labels, modal, and PWA toast strings.
