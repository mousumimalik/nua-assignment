# NUA — Mini E-Commerce App

A production-style mini storefront built with **React 18+**, **Vite**, **TypeScript**, and **SCSS Modules**. Product data is fetched from the Fake Store API, while cart state and UI preferences are persisted using localStorage.

---

## Live Demo

**Live Site:**  
https://mousumimalik.github.io/nua-assignment/

**GitHub Repository:**  
https://github.com/mousumimalik/nua-assignment

---

## Setup

### Requirements

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/mousumimalik/nua-assignment.git
cd nua-assignment
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
npm run deploy    # Deploy to GitHub Pages
```

---

## Features

### Product Listing Page (`/`)

- Responsive product grid
- Product image, name, and price
- Quick Add to Cart button
- Navigation to product details

### Product Detail Page (`/product/:id`)

- Product image gallery with thumbnail selection
- Brand information
- Sale pricing support
- Colour selection
- Size selection
- Available, Low Stock, and Sold Out states
- Quantity picker
- Disabled Add to Cart button for sold-out variants
- Deep-linkable variant selection using URL query parameters

Example:

```text
/product/1?color=navy&size=M
```

### Navbar

- Cart icon
- Live cart count badge
- Cart drawer trigger

### Cart Drawer

- Slide-in drawer from the right
- Product thumbnail
- Product name
- Variant information
- Quantity controls
- Remove item functionality
- Subtotal calculation
- Grand total calculation

### Persistence

- Cart state stored in localStorage
- Cart survives page refreshes
- Variant selection survives refreshes through URL state

### Responsive Design

#### Desktop (>767px)

- Multi-column product grid
- Two-column product detail layout

#### Mobile (≤767px)

- Single-column layouts
- Horizontally scrollable thumbnail gallery

---

## Tech Stack

- React 18
- TypeScript
- React Router
- Context API
- SCSS Modules
- Vite
- Fake Store API
- GitHub Pages

---

## Project Structure

```text
src/
├── components/      # Reusable UI components
├── data/            # Product enrichment and constants
├── hooks/           # Shared hooks
├── pages/           # Route-level pages
├── router/          # Routing configuration
├── stores/          # Cart context and state management
├── styles/          # Global SCSS, variables, mixins
├── types/           # TypeScript types
└── utils/           # Utility helpers
```

---

## Design Decisions

### State Management

The application uses React Context API for global cart state.

For this project, Context API provides a simple and lightweight solution without introducing additional dependencies. Cart state, persistence logic, and UI interactions are centralized within a dedicated provider.

Additional details are documented in:

```text
DECISIONS.md
```

### Product Variants

The Fake Store API does not provide:

- Colours
- Sizes
- Inventory
- Brands
- Sale pricing

To support the assignment requirements, product data is enriched locally using deterministic rules based on product IDs.

This allows:

- Consistent variant generation
- Stock status handling
- Sale price display
- Stable behaviour across refreshes

### URL-Based Variant Selection

Selected variants are stored in URL query parameters:

```text
?color=navy&size=M
```

Benefits:

- Deep-linkable product pages
- Shareable URLs
- Refresh-safe variant selection

---

## Known Trade-Offs

- Product variants are generated locally because the API does not provide variant data.
- Additional gallery images use seeded placeholder images.
- Quick Add selects the first available variant automatically.
- Shipping and taxes are not included in calculations.
- Inventory is not decremented when items are added to the cart.

---

## Deployment

This project is deployed using GitHub Pages.

Production URL:

https://mousumimalik.github.io/nua-assignment/

To redeploy:

```bash
npm run deploy
```

---

## Lighthouse

A Lighthouse audit was performed against the production build.

Results:

| Category       | Score |
| -------------- | ----- |
| Performance    | 70    |
| Accessibility  | 96    |
| Best Practices | 100   |
| SEO            | 100   |

Audit Report:

```text
docs/lighthouse.pdf
```

The audit was run against the production build using:

```bash
npm run build
npm run preview
```

Environment:

- Chrome Lighthouse 13.x
- Mobile emulation
- Slow 4G throttling

---

## Author

**Mousumi Malik**

Frontend Developer

GitHub:
https://github.com/mousumimalik

Project Repository:
https://github.com/mousumimalik/nua-assignment

Live Demo:
https://mousumimalik.github.io/nua-assignment/

---

## Submission

This project was completed as part of a Frontend Developer technical assignment.

Deliverables included:

- Product listing page
- Product detail page with variant selection
- Cart drawer with persistence
- Responsive layouts
- URL-based variant state
- LocalStorage persistence
- GitHub Pages deployment
- Architectural decisions documented in `DECISIONS.md`
- Lighthouse audit report
