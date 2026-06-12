# DECISIONS.md

## Context API vs a dedicated state library

The assignment allows Context API or Pinia/Vuex. I chose **React Context** with a dedicated `CartProvider` rather than Redux Toolkit or Zustand.

The other realistic option was **Zustand** with a small persist middleware. That would have been slightly less boilerplate for actions and would have made reading cart state outside React trivial. Context won because this app has exactly one piece of global state — the cart — plus ephemeral UI state for the drawer. Wiring Context keeps dependencies minimal, matches the spec’s suggestion, and avoids introducing a store pattern that would mostly wrap a single slice. If the app grew to include auth, wishlists, and checkout, I would migrate cart (and likely catalog cache) to Zustand or RTK Query rather than nesting multiple providers.

## Enriching Fake Store data locally

The API returns a single image, one price, and no variant fields. I considered fetching from a richer mock server, but that would move the submission away from the required API. Instead, `enrichProduct()` derives colours, sizes, stock levels, brands, thumbnails, and occasional sale pricing deterministically from each product ID. That let me implement sold-out, low-stock, and disabled CTA states without hand-authoring JSON for twenty products. The trade-off is that variant data is synthetic — reviewers should treat stock counts as demo logic, not inventory truth.

## URL params for variant selection

Colour and size could have lived in component state with optional sync to the URL. I defaulted to **query params as the source of truth** (`?color=navy&size=M`) because deep-linking was an explicit requirement. On load, invalid combinations fall back to the first in-stock variant and rewrite the URL once. That adds a small effect on mount but makes shared links and refresh behaviour predictable.

## What I would clean up with more time

First, **stock-aware cart updates**: adding to cart does not yet decrement variant stock or block quantities above available inventory across sessions. Second, **Quick Add** on the listing page silently picks the first available variant; a size/colour modal or redirect to detail would be clearer for apparel. Third, **testing**: I would add unit tests around `getVariant()`, the quantity cap, and sold-out CTA disabling in `VariantSelector`. Fourth, **performance**: lazy-load routes, add image `width`/`height` to reduce layout shift, and run Lighthouse fixes (font subsetting, preconnect to the API CDN). Finally, the bonus mock async add-to-cart with simulated failure would be a thin wrapper around `addToCart()` with a retry affordance in the drawer.
