# Kraya

A demo storefront for a small organic provisions shop in Bristol. Twelve products across three shelves, each with weight variants, per-pack prices and a per-100 g or per-100 ml rate. The basket persists across reloads; checkout validates honestly and states that no order was placed.

Built with Next.js 16 App Router, React 19 and Tailwind 4. No backend, no payment, no accounts.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical, Open Graph, JSON-LD and sitemap URLs are absolute. It defaults to `http://localhost:3000`.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Full-bleed photographic hero with the live price ticket, circular shelf shortcut strip, trust band, photo-led shelf tiles, three-slide highlights banner, featured rail, fact tiles, fresh feature, and the pantry/drinks shelf index |
| `/shop` | Sticky sidebar with shelf and diet filters and counts, URL-backed; sort in the results toolbar |
| `/shop/[id]` | Gallery, pack and quantity, live price and rate, provision sheet |
| `/basket` | Weight variant per line, quantity, subtotal, delivery, total |
| `/wishlist` | Saved products, with the same Add to cart and heart |
| `/checkout` | Address and delivery validation, summary, honest no-order state |
| `/credits` | Library photograph authors and licences |
| `/shop/does-not-exist` | 404 |

## Data

`src/data/*.json` is shaped like an API response and read through `src/lib/catalogue.ts`.

```json
{
  "id": "olive-oil",
  "name": "Olive oil, cold pressed",
  "categoryId": "pantry",
  "origin": "Kalamata, Greece",
  "photo": "olives-harvest",
  "organic": true,
  "tags": ["vegan", "gluten-free"],
  "variants": [
    { "id": "500ml", "label": "500 ml bottle", "priceCents": 1850, "netAmount": 500, "netUnit": "ml", "inStock": true }
  ]
}
```

Money is always integer cents. Every variant carries its own price and weight. Server pages call `getProducts`, `getProduct`, `getCategory` and friends; client leaves receive products as props, and the cart/wishlist stores hold only shape-validated lines and ids. `src/lib/photos.ts` holds the small photo metadata used by `next/image`. Replacing JSON with `fetch()` changes one module.

`npm run check:data` validates the catalogue before every build: unique ids, known categories and photos, positive integer prices and weights, and at least one in-stock variant.

## Structure

```
src/app/            routes, tokens, base styles
src/components/     chrome, layout shells, product, cart, checkout, market, ui
src/lib/            catalogue, photos, money, cart store, checkout validation, order totals
src/data/           products, categories, photo credits
public/photos/      local library photographs
scripts/            data check, photo fetch, smoke and layout inspection
```

## Design system

The full system is documented in `DESIGN.md`. Where each decision came from, what was
borrowed from outside references and what was rejected, is in
[`audit/DESIGN-TRACKING.md`](./audit/DESIGN-TRACKING.md). Short version:

- Idea: a market stall's price tickets, with the pack price you can change yourself.
- Ground: cool white. Ink: near-black navy. Action: one deeper tomato accent. Shelf fields: pale citrus, cobalt and tomato tints.
- Faces: Syne for the home display only; DM Sans for content and functional type; IBM Plex Mono for money.
- Type: content pages use a 40px page title, 24px sections, 17px body and 15px metadata; the display scale belongs to the home. `DESIGN.md` section 2 is the binding SOP.
- Geometry: tight radii — 18px cards and panels, 14px photo wells, 10px fields and chrome. Pills are for content buttons only, never chrome. Flat cards, no card inside a card.
- Layout: `PageShell`, `Section`, `SectionHeader`, `PageHeader` on every content route. Header and footer are flat full-bleed bands; the delivery strip scrolls away and the bar sticks. Shop filters sit behind `Filters` on mobile.
- Motion: CSS-only entrance, a price figure that rises on change, one facts ticker with a Pause/Play control that hides under reduced motion, a manual image highlights banner (never autoplay), scroll-snap carousels, hover lift.
- Variants: cards print their pack weights; the product page reprices price and rate on selection; sold-out packs are disabled.
- Quick actions: every card has Add to cart and a heart. Both persist in `localStorage`; the Saved link carries a count and `/wishlist` lists what is kept.

## SEO

Canonical URLs, Open Graph and Twitter cards, Store/Product/ItemList JSON-LD, `/sitemap.xml` and `/robots.txt` are generated from the catalogue. Basket, checkout and wishlist are `noindex`.

## Checks

```bash
npm run lint        # oxlint
npm run typecheck   # tsc --noEmit
npm run build       # data check + next build
npm run smoke       # route status and h1s, against a running server
npm run check:ui    # layout facts and screenshots (puppeteer-core)
```

The UI checks also cover an axe pass on the main routes and a 320px overflow pass. Typography and layout review against `DESIGN.md` is part of the same check.

## Demo limits

No payment, tax, order submission, accounts or search. Prices are sample data. Checkout validates like a real form and then says plainly that nothing was sent.
