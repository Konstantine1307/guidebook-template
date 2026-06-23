# Guidebook Template

**Single Page Application (SPA)** — Vanilla HTML + CSS + TypeScript property guidebook.
No framework — Web Components, CSS custom properties, History API routing, Vite as dev/build tool.
Deployable to Cloudflare Pages as a PWA.

> **This is the template.** It is not deployed directly.
> Each property (Cottage, Barn, etc.) gets its own copy of this repo with the relevant JSON files active in `config.ts`.

**Why SPA?** Eliminates the navbar flash that guests noticed during page navigation. The navbar stays mounted permanently; only content updates.

---

## Tech stack

| Layer       | Choice                                          |
| ----------- | ----------------------------------------------- |
| Language    | TypeScript (compiled by Vite)                   |
| Components  | Native Web Components (`customElements.define`) |
| Styles      | Plain CSS with custom properties                |
| Build / Dev | Vite                                            |
| PWA         | vite-plugin-pwa + Workbox                       |
| Deployment  | Cloudflare Pages                                |

---

## Language switcher

The app supports **English and German** with a runtime toggle in the navbar (🇬🇧 EN / 🇩🇪 DE dropdown).

- Switching is **instant** — no page reload
- Choice is **persisted** in `localStorage`
- `?lang=de` in the URL forces German (useful for sharing a direct German link with guests)
- German browser language (`navigator.language`) is auto-detected on first visit
- All UI strings come from `src/data/ui.json` (EN) and `src/data/ui-de.json` (DE)
- All property content comes from the EN and DE JSON files (e.g. `cottage.json` / `cottage-de.json`)

---

## How to spin up a new property

1. Copy this repo (or use it as a GitHub template)
2. In `src/data/config.ts` update the two imports:
   ```ts
   import dataEn from "./cottage.json";
   import dataDe from "./cottage-de.json";
   ```
3. Add the property hero image to `public/images/`
4. Run `npm run build` — all content, PWA manifest, page titles and meta tags update automatically
5. Push to GitHub and connect to Cloudflare Pages

**Cloudflare Pages build settings:**

| Setting                | Value           |
| ---------------------- | --------------- |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Node version           | 18+             |

---

## Updating content

All property content lives in the JSON files (`cottage.json` + `cottage-de.json`, or `barn.json` + `barn-de.json`).
Editing the JSON is the only thing needed for:

- Restaurants, beaches, attractions
- House manual facilities
- Arrival / departure / emergency information
- Contact details, directions, parking

For deployed repos, edit the JSON directly on GitHub — Cloudflare Pages rebuilds automatically on every commit.

---

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

---

## Project structure

```
src/
├── data/
│   ├── config.ts              ← TWO LINES to switch properties (EN + DE imports)
│   ├── language.ts            ← runtime language management (getUI, getGuidebook, toggle)
│   ├── cottage.json           ← cottage content (English)
│   ├── cottage-de.json        ← cottage content (German)
│   ├── barn.json              ← barn content (English)
│   ├── barn-de.json           ← barn content (German)
│   ├── ui.json                ← shared UI strings (English)
│   ├── ui-de.json             ← shared UI strings (German)
│   └── types.ts               ← TypeScript interfaces
├── components/
│   ├── guide-navbar.ts        ← <guide-navbar> Web Component — title + EN/DE dropdown
│   ├── guide-drawer.ts        ← <guide-drawer> Web Component — re-renders on lang change
│   ├── guide-modal.ts         ← <guide-modal> Web Component — translated close button
│   ├── guide-pwa.ts           ← PWA install/update toast
│   └── sections/
│       ├── helpers.ts         ← shared render utilities (exports getUI, getGuidebook)
│       ├── arrival.ts         ← renderCheckIn
│       ├── directions.ts      ← renderDirections
│       ├── food-shopping.ts   ← renderFoodShopping
│       ├── house-manual.ts    ← renderHouseManual
│       ├── emergency.ts       ← renderEmergency
│       ├── departure.ts       ← renderDeparture
│       ├── restaurants.ts     ← renderRestaurants
│       ├── beaches.ts         ← renderBeaches
│       ├── attractions.ts     ← renderAttractions
│       └── index.ts           ← re-exports all renderers
├── icons/
│   └── icons.ts               ← inline SVG icon map (includes languages + chevron-down)
├── scripts/
│   ├── main.ts                ← SPA entry point (initLanguage, router, components, PWA)
│   ├── router.ts              ← History API router — re-renders on language-changed event
│   └── layout.ts              ← legacy bootstrap (deprecated)
├── styles/
│   └── global.css             ← design system (CSS custom properties, navbar, lang dropdown)
├── index.html                 ← single SPA shell (navbar, drawer, mount point)
└── _backup_html/              ← legacy MPA files (not used)

public/
├── images/                    ← hero images, beach & attraction photos
├── icons/                     ← logo, PWA icons
├── favicon.svg
├── topography*.svg            ← background patterns (one per page theme)
├── _headers                   ← Cloudflare Pages security headers
├── _routes.json               ← Cloudflare Pages routing rules
└── _redirects                 ← SPA redirect rules (all paths → index.html)
```

---

## SPA Routing

The app uses the **History API** for client-side navigation:

- **URLs:** Clean paths like `/arrival`, `/emergency`, `/beaches` (no `.html`)
- **Navigation:** Clicking a drawer link updates content instantly without page reload
- **Direct access:** `public/_redirects` ensures `/arrival` serves `index.html`
- **Back/forward:** Browser buttons work via `popstate` event
- **Language change:** `language-changed` event triggers a full re-render of the current route

**Why not View Transitions API?** It captures element snapshots which causes the navbar to flash. We do instant content swaps instead.

---

## Workflow: template → deployed repos

```
guidebook-template  (this repo — never deployed)
       │
       ├── cottage-guidebook-v2   (config.ts → cottage.json + cottage-de.json)
       └── barn-guidebook-v2      (config.ts → barn.json    + barn-de.json)
```

**Content changes:** Edit the JSON directly on GitHub in the deployed repo — Cloudflare Pages rebuilds automatically.

**Template changes (SPA, components, styles, router):** manually copy the changed files to both repos, rebuild and deploy with:

```bash
npx wrangler pages deploy dist --project-name barn-guidebook-v2
npx wrangler pages deploy dist --project-name cottage-guidebook-v2
```
