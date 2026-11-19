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
| `/shop/[id]` | Gallery with arrows and dots, pack and quantity buy box, seller panel, five highlights, tabbed description/nutrition/ingredients/how-to-use/reviews/seller info, customer reviews and related products |
| `/vendors` | The verified sellers behind the catalogue |
| `/sell` | How a producer would apply to sell |
| `/policies` | Shipping, returns, privacy and terms |
| `/basket` | Cart lines with pack, vendor, discount tag, quantity stepper, Save for Later and Remove; Select All and Remove Selected; item total, discount, delivery, collapsible coupon field and trust strip; suggestions and an assurance band |
| `/wishlist` | Saved products, with the same Add to Cart and heart |
| `/checkout` | Address and delivery validation, summary, honest no-order state |
| `/credits` | Library photograph authors and licences |
| `/account` | Account overview: order and address counts, total spent, recent orders |
| `/account/orders` | Every order, with product names, pack sizes, status and total |
| `/account/addresses` | Saved addresses, with the default marked |
| `/account/profile` | Name, email, phone, city and member-since date |
| `/account/sign-in` | Sign-in form, pre-filled with the demo account |
| `/account/sign-up` | Create a demo account, with matching-password validation |
| `/shop/does-not-exist` | 404 |

## API

The catalogue is also served over HTTP, so the storefront is not coupled to the JSON
files. Route handlers wrap the same server-only data layer; there is no second copy of the
query logic.

| Endpoint | Returns |
| --- | --- |
| `GET /api/products` | `{ items, total, page, pageSize, pageCount, facets }`. Accepts `category`, `q`, `tag[]`, `diet[]`, `vendor[]`, `certification[]`, `min`, `max`, `discount`, `stock`, `sort`, `page`, `pageSize`. `facets` are whole-catalogue counts for the sidebar |
| `GET /api/products/[id]` | One product, or `404` |
| `GET /api/products/[id]/detail` | `{ product, detail, reviews, category, vendor, related }` — the whole product page in one call |
| `GET /api/categories` | `{ items }` |
| `GET /api/vendors` | `{ items }` |
| `POST /api/auth/sign-in` | Sets the session cookie. Rejects a wrong password with `401` |
| `POST /api/auth/sign-up` | Creates an in-memory demo account and signs it in |
| `POST /api/auth/sign-out` | Clears the session cookie |
| `GET /api/auth/session` | `{ profile }` when signed in, `null` when not |
| `GET /api/account` | `{ profile, addresses, orders, isDemoSignup }`, or `401` |

Invalid input is rejected with a `400`, not silently corrected, so a typo is visible:
unknown `sort`, non-integer or negative numerics, `min` above `max`, and `stock` outside
`in`/`out` all fail. Every error uses one shape:

```json
{ "error": { "code": "bad_request", "message": "sort must be one of: popular, price, price-desc, name." } }
```

`src/lib/api/endpoints.ts` is the single source of paths. `createApi` in
`src/lib/api/client.ts` is the typed client over axios; it normalises every failure to an
`ApiError`. There are two instances: `browser.ts` makes real same-origin requests, and
`server.ts` answers in-process so Server Components and `next build` never fetch their own
HTTP server. Point `server.ts` at a real base URL and delete the adapter when a backend
exists.

**Every page and component reads through this client.** No route imports
`src/lib/catalogue.ts` directly; the only consumers of the data layer are the route
handlers and the mock backend behind them. That means the JSON files are a single
implementation detail: replacing them with a real backend changes `mock-backend.ts` and
`server.ts`, and nothing else.

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

Money is always integer paise and formatted once at render as INR. Ratings, review counts,
MRP, reviews and delivery dates are sample marketplace data. `src/data/product-details.json`
holds the long description, highlights, features, nutrition, ingredients and usage for a
product; products without a record get generated fallback copy. `src/data/reviews.json`
holds sample reviews. Server pages call `getProducts`, `getProduct`, `getCategory`,
`getVendors` and friends; client leaves receive products as props, and the cart/wishlist
stores hold only shape-validated lines and ids. `src/lib/photos.ts` holds the small photo
metadata used by `next/image`.

The catalogue module is server-only. `src/lib/catalogue.ts`, `src/lib/reviews.ts` and
`src/lib/product-details.ts` begin with `import "server-only"`, so importing them from a
client component fails the build instead of leaking the product JSON into a browser bundle.
Client components import the pure helpers from `src/lib/variant.ts`, `src/lib/vendors.ts`
and `src/lib/rating.ts`, and take product records as props.

`/shop` query state is parsed once by a zod schema in `src/lib/shop-query.ts`. Unknown
sorts, discounts, stock values, diet ids and overlong queries are dropped; the price range is
clamped and ordered; the page is bounded by the real page count.

`npm run check:data` validates the catalogue before every build: unique ids, known
categories, vendors and photos, valid ratings and MRP, positive integer prices and weights,
a supported unit, and at least one in-stock variant.

## Structure

```
src/app/            routes, tokens, base styles, error and loading boundaries
src/components/     chrome, layout shells, home sections, product, cart, checkout, shop, ui
src/lib/            catalogue (server-only), variant, vendors, rating, money, diets,
                    cart store, checkout schema, shop-query schema, order totals
src/data/           products, categories, vendors, photo credits
public/photos/      local library photographs
scripts/            data check, photo fetch, smoke and layout inspection
tests/              node:test unit tests for stores, schemas and helpers
```

## Tests

```
npm test
```

`node --test` with native TypeScript stripping runs the suite; no extra runtime is added.
Coverage is the logic that protects the shop: cart-store validation, bounds, dedupe and
legacy migration, the `/shop` URL parser, the checkout zod schema, and the pack/price and
rating helpers.

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
npm test            # node:test unit suite
npm run build       # data check + next build
npm run smoke       # route status and h1s, against a running server
npm run check:ui    # layout facts and screenshots (puppeteer-core)
npm run check:a11y  # axe-core, WCAG 2.1 A/AA, 9 routes x 2 viewports
```

The UI checks cover overflow and broken images on the main routes, plus a 320px pass.
Typography and layout review against `DESIGN.md` is part of the same check.

## Accessibility

`npm run check:a11y` runs axe-core over nine routes at 1440 and 390 against WCAG 2.1 A and
AA, and exits non-zero on any critical or serious violation. Current state: **zero
violations** on all 18 route/viewport pairs. Text contrast is measured separately by
resolving `oklch` through a canvas pixel readback, since axe cannot parse `oklch`; the
lowest sampled ratio is 4.91:1 against a 4.5:1 requirement.

Two limitations are recorded rather than hidden:

- axe reports a few `incomplete` items because the colour tokens are `oklch`. Those were
  checked by hand: every `aria-labelledby` target exists, and sampled contrast passes.
- Primary actions are 44px; secondary and chrome controls are 36-40px. That meets the
  WCAG 2.2 AA target size (24px) but not the 44px AAA target. `DESIGN.md` previously
  claimed 44px throughout and now states the measured sizes.

## Accounts

There is a customer account flow, and it is a **mock**. The sign-in form is pre-filled with
`meera@example.com` / `kraya-demo`, so signing in is one click. `src/data/customers.json`
seeds three customers with addresses and order history.

Four account pages share one shell, provided by a **route-group layout**
(`src/app/account/(dashboard)/layout.tsx`): a sidebar with the account's name and email,
links to Overview, Orders, Addresses and Profile, and sign-out. The group keeps the URL
clean, so `/account` is still `/account`; sign-in and sign-up sit outside it and keep their
own layout. Pages own only their section, and `readAccountOrNull` is wrapped in
`React.cache` so the layout and the page share one session read per request.

They are real routes, not anchors, so each section is linkable and the sidebar marks the
current page with `aria-current`. On a phone the rail becomes a horizontally scrollable
strip. Order lines resolve product and pack names from the catalogue rather than showing raw
ids. The layout renders the sign-in prompt when there is no session.

What is real: an httpOnly, SameSite=Lax cookie; server-side session reads; a sign-out that
clears it; field-level validation; and no session token in `localStorage`. What is not: any
password hashing, a session store, email verification, or persistence beyond the running
server process. A customer registered at sign-up exists until the server restarts.

This is deliberately called a mock everywhere it surfaces, rather than dressed up as
authentication. Replacing it means rewriting `src/lib/auth/`; nothing above that module
assumes the demo behaviour.

## Demo limits

No payment, tax, order submission or seller onboarding, and no real authentication: the
account flow is a labelled mock that forgets new customers when the server restarts. Prices,
vendors, ratings and discounts are sample data. Checkout validates like a real form and then
says plainly that nothing was sent.
