# Kraya

A demo multi-vendor organic marketplace. Eighteen products across nine categories, four
verified vendors, INR prices, ratings and sample MRP discounts. The basket persists across
reloads; checkout validates honestly and states that no order was placed.

Built with Next.js 16 App Router, React 19 and Tailwind 4. No backend, no payment, no
accounts.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so canonical, Open Graph, JSON-LD and
sitemap URLs are absolute. It defaults to `http://localhost:3000`.

## Routes

| Route | What it does |
| --- | --- |
| `/` | Marketplace homepage: search header, category bar, cream hero, circular category strip, trust band, featured vendors, trending products with tabs, farmer banner, diet grid, why-choose band, newsletter and dark green footer |
| `/shop` | Catalogue: cream hero, breadcrumb, category chips, sort and grid/list toggle, sidebar filters (category, price, discount, vendor, diet, certification, availability), four-up product grid and pagination |
| `/shop/[id]` | Gallery, pack and quantity, live price and rate, vendor, rating and provision sheet |
| `/vendors` | The verified sellers behind the catalogue |
| `/sell` | How a producer would apply to sell |
| `/policies` | Shipping, returns, privacy and terms |
| `/basket` | Pack per line, quantity, subtotal, delivery, total |
| `/wishlist` | Saved products, with the same Add to Cart and heart |
| `/checkout` | Address and delivery validation, summary, honest no-order state |
| `/credits` | Library photograph authors and licences |
| `/account` | Honest account placeholder for the demo |
| `/shop/does-not-exist` | 404 |

## Data

`src/data/*.json` is shaped like an API response and read through `src/lib/catalogue.ts`.

```json
{
  "id": "organic-red-quinoa",
  "name": "Organic Red Quinoa",
  "categoryId": "grains",
  "vendorId": "pahadi-organics",
  "origin": "Uttarakhand, India",
  "photo": "spices-dark",
  "organic": true,
  "tags": ["vegan", "gluten-free"],
  "diets": ["gluten-free", "high-protein", "low-gi", "vegan"],
  "rating": 4.8,
  "reviewCount": 642,
  "mrpCents": 39900,
  "variants": [
    { "id": "500g", "label": "500 g pack", "priceCents": 31900, "netAmount": 500, "netUnit": "g", "inStock": true }
  ]
}
```

Money is always integer paise and formatted once at render as INR. Ratings, review counts
and MRP are sample marketplace data. Server pages call `getProducts`, `getProduct`,
`getCategory`, `getVendors` and friends; client leaves receive products as props, and the
cart/wishlist stores hold only shape-validated lines and ids. `src/lib/photos.ts` holds the
small photo metadata used by `next/image`.

`npm run check:data` validates the catalogue before every build: unique ids, known
categories, vendors and photos, valid ratings and MRP, positive integer prices and weights,
a supported unit, and at least one in-stock variant.

## Structure

```
src/app/            routes, tokens, base styles
src/components/     chrome, layout shells, home sections, product, cart, checkout, shop, ui
src/lib/            catalogue, photos, money, diets, cart store, checkout validation, order totals
src/data/           products, categories, vendors, photo credits
public/photos/      local library photographs
scripts/            data check, photo fetch, smoke and layout inspection
```

## Design system

The full system is documented in `DESIGN.md`. The short version:

- Idea: a green-and-cream organic marketplace, built around real photography and a single
  deep-green action colour.
- Ground: warm cream and white. Ink: near-black green. Action: one green accent.
  Surfaces: white cards with a hairline rule.
- Faces: Fraunces for display headings only; DM Sans for content, controls and figures.
- Type: content pages use a 34-36px page title, 24-32px sections, 16px body and 14px
  metadata; the display scale belongs to the home.
- Geometry: tight radii — 16px panels and image cards, 12px cards, 8px controls. Pills are
  for tags, never chrome.
- Layout: `PageShell`, `Section`, `SectionHeader`, `PageHeader` on every content route.
  Header and footer are flat full-bleed bands.
- Motion: CSS-only entrance, transform and opacity, disabled under reduced motion. No
  autoplay.
- Variants: cards print the default pack price, MRP and rating; the product page reprices
  on selection; sold-out packs are disabled.
- Quick actions: every card has Add to Cart and a heart. Both persist in `localStorage`;
  the Saved link carries a count and `/wishlist` lists what is kept.

## SEO

Canonical URLs, Open Graph and Twitter cards, OnlineStore/Product/ItemList JSON-LD,
`/sitemap.xml` and `/robots.txt` are generated from the catalogue. Basket, checkout,
wishlist and account are `noindex`.

## Checks

```bash
npm run lint        # oxlint
npm run typecheck   # tsc --noEmit
npm run build       # data check + next build
npm run smoke       # route status and h1s, against a running server
npm run check:ui    # layout facts and screenshots (puppeteer-core)
```

The UI checks cover overflow and broken images on the main routes, plus a 320px pass.
Typography and layout review against `DESIGN.md` is part of the same check.

## Demo limits

No payment, tax, order submission, accounts or seller onboarding. Prices, vendors,
ratings and discounts are sample data. Checkout validates like a real form and then says
plainly that nothing was sent.
