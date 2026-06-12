# NUA — Mini E-Commerce App

A production-style mini storefront built with **React 18+**, **Vite**, **TypeScript**, and **SCSS modules**. Product data comes from the [Fake Store API](https://fakestoreapi.com); cart state persists in `localStorage`.

## Live demo

> Deploy to Vercel or Netlify and add your live URL here before submission.

## Setup

Requirements: **Node.js 18+**

```bash
git clone <your-repo-url>
cd nua
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Other scripts

```bash
npm run build    # production build
npm run preview  # preview production build locally
npm run lint     # ESLint
```

## Features

- **Product listing** (`/`) — responsive grid with image, name, price, and Quick Add
- **Product detail** (`/product/:id`) — gallery with thumbnails, brand, sale pricing, colour/size variants, quantity picker, deep-linkable variant URL (`?color=navy&size=M`)
- **Navbar** — cart icon with live item-count badge
- **Cart drawer** — slide-in panel with quantity controls, remove, and bill summary
- **Persistence** — cart survives page refresh via `localStorage`
- **Responsive** — two-column detail layout on desktop; single column + horizontal thumbnails on mobile (≤767px)

## Project structure

```
src/
├── components/     # Reusable UI (Navbar, CartDrawer, ProductCard, etc.)
├── data/           # Constants and variant enrichment logic
├── hooks/          # useProducts, useProduct, useLocalStorage
├── pages/          # Route-level views
├── router/         # React Router setup
├── stores/         # CartContext (global cart state)
├── styles/         # Global SCSS, variables, mixins
├── types/          # Shared TypeScript types
└── utils/          # Helpers (formatPrice)
```

## Design decisions

### State management — Context API

Cart state uses React Context rather than Redux or Zustand. For a focused assignment with one global concern (cart + drawer visibility), Context keeps the codebase small while still separating persistence, actions, and UI. See `DECISIONS.md` for the full rationale.

### Variant data

The Fake Store API does not expose colours, sizes, stock, brands, or sale prices. The app enriches API responses in `src/data/variants.ts` using deterministic rules keyed on product ID so variant behaviour is consistent across sessions.

### URL state

Selected colour and size live in query params (`?color=&size=`) so product detail pages are shareable and survive refresh.

## Known trade-offs

- Thumbnail images beyond the primary API image use seeded Picsum placeholders for visual variety.
- Quick Add on the listing page uses the first available variant rather than prompting for size/colour.
- Shipping and tax are not modelled; grand total equals subtotal.

## Lighthouse

Run Lighthouse in Chrome DevTools against the production build (`npm run build && npm run preview`) and save a screenshot to `/docs/lighthouse.png` before submission.

## Author

Add your name here before submitting.
