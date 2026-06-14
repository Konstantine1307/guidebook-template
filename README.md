# Guidebook Template

Vanilla HTML + CSS + TypeScript property guidebook.  
No framework — Web Components, CSS custom properties, Vite as dev/build tool.  
Deployable to Cloudflare Pages.

## Tech stack

| Layer | Choice |
|-------|--------|
| Language | TypeScript (compiled by Vite) |
| Components | Native Web Components (`customElements.define`) |
| Styles | Plain CSS with custom properties |
| Build / Dev | Vite |
| PWA | vite-plugin-pwa + Workbox |
| Deployment | Cloudflare Pages |

## Switching between properties

Open `src/data/config.ts` and change the import:

```ts
// Cottage
import data from './cottage.json';

// Barn
// import data from './barn.json';
```

Then rebuild. That single change swaps every piece of property-specific content across all 8 pages.

## Creating a new property deployment

```bash
# From the cloudflare/ folder:
cp -R guidebook-template barn-guidebook-no-astro
```

Then in `barn-guidebook-no-astro/src/data/config.ts` switch the import to `barn.json`.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
├── data/
│   ├── config.ts          ← ONE LINE to switch properties
│   ├── cottage.json       ← cottage content
│   ├── barn.json          ← barn content
│   └── types.ts           ← TypeScript interfaces
├── components/
│   ├── guide-navbar.ts    ← <guide-navbar> Web Component
│   ├── guide-drawer.ts    ← <guide-drawer> Web Component
│   ├── guide-modal.ts     ← <guide-modal> Web Component
│   ├── guide-pwa.ts       ← PWA service worker registration
│   └── sections.ts        ← HTML renderers for all page sections
├── icons/
│   └── icons.ts           ← Inline SVG icon map
├── scripts/
│   ├── layout.ts          ← Shared bootstrap (imported by every page)
│   ├── index.ts           ← Home page script
│   ├── arrival.ts
│   ├── house-manual.ts
│   ├── emergency.ts
│   ├── departure.ts
│   ├── places-to-eat.ts
│   ├── attractions.ts
│   └── beaches.ts
├── styles/
│   └── global.css         ← Design system (CSS custom properties)
├── index.html             ← Home page
├── arrival.html
├── house-manual.html
├── emergency.html
├── departure.html
├── places-to-eat.html
├── attractions.html
└── beaches.html

public/
├── images/                ← Hero images, beach & attraction photos
├── icons/                 ← Logo, PWA icons
├── favicon.svg
├── _headers               ← Cloudflare Pages security headers
└── _routes.json           ← Cloudflare Pages routing rules
```

## Adding a new property

1. Copy `src/data/cottage.json` to e.g. `src/data/manor.json`
2. Edit all property-specific fields (name, address, contacts, hero image, etc.)
3. Add hero image to `public/images/`
4. In `config.ts` import the new file
5. Run `npm run build`
