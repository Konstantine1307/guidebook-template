# Guidebook Template

**Single Page Application (SPA)** — Vanilla HTML + CSS + TypeScript property guidebook.
No framework — Web Components, CSS custom properties, History API routing, Vite as dev/build tool.
Deployable to Cloudflare Pages as a PWA.

> **This is the template.** It is not deployed directly.
> Each property (Cottage, Barn, etc.) gets its own copy of this repo with the relevant JSON file active.

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

## How to spin up a new property

1. Copy this repo (or use it as a GitHub template)
2. In `src/data/config.ts` change the import to point at the property JSON:
   ```ts
   import data from "./cottage.json"; // or barn.json, etc.
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

All property content lives in the JSON file (`src/data/cottage.json` or `src/data/barn.json`). Editing the JSON is the only thing needed for:

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
│   ├── config.ts              ← ONE LINE to switch properties
│   ├── cottage.json           ← all cottage content
│   ├── barn.json              ← all barn content
│   └── types.ts               ← TypeScript interfaces
├── components/
│   ├── guide-navbar.ts        ← <guide-navbar> Web Component (SPA-aware)
│   ├── guide-drawer.ts        ← <guide-drawer> Web Component (data-route links)
│   ├── guide-modal.ts         ← <guide-modal> Web Component
│   ├── guide-pwa.ts           ← PWA install/update toast
│   └── sections/
│       ├── helpers.ts         ← shared render utilities
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
│   └── icons.ts               ← inline SVG icon map
├── scripts/
│   ├── main.ts                ← SPA entry point (init router, components, PWA)
│   ├── router.ts              ← History API router (client-side navigation)
│   └── layout.ts              ← legacy bootstrap (deprecated)
├── styles/
│   └── global.css             ← design system (CSS custom properties)
├── index.html                 ← single SPA shell (navbar, drawer, mount point)
└── _backup_html/              ← legacy MPA files (not used)
    └── *.html                 ← old page shells

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

**Why not View Transitions API?** It captures element snapshots which causes the navbar to flash. We do instant content swaps instead.

---

## Workflow: template → deployed repos

```
guidebook-template  (this repo — never deployed)
       │
       ├── cottage-guidebook   (config.ts → cottage.json — deployed)
       └── barn-guidebook      (config.ts → barn.json    — deployed)
```

**Content changes:** Edit the JSON directly on GitHub in the deployed repo — Cloudflare Pages rebuilds automatically.

**Template changes (SPA, components, styles, router):**

```bash
./sync-to-repos.sh        # Syncs everything to both repos
./sync-to-repos.sh cottage # Just cottage
./sync-to-repos.sh barn    # Just barn
```

This copies:

- All TypeScript (`src/components/`, `src/scripts/`)
- CSS styles (`src/styles/`)
- SPA shell (`src/index.html`)
- Build config (`vite.config.ts`, `public/_redirects`)
