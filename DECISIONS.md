# Decisions

Current engineering and design decisions for Kraya. Superseded decisions are removed
rather than kept as history.

## Architecture

**Next.js App Router, server-first.** Pages are server components. `"use client"` exists
only on leaves that need state or events: the header, product tabs, filters, quick add,
variant picker, cart, newsletter and wishlist. `params` and `searchParams` are awaited.

**JSON dressed as an API.** `src/data/*.json` is typed and read through
`src/lib/catalogue.ts`. Components never import JSON directly; replacing the module with
`fetch()` is the swap point. The catalogue module is **server-only**: it holds the product
records, and marking it `import "server-only"` makes any accidental client import a build
error. Client components receive product records as props and import only the pure helpers
in `src/lib/variant.ts`, `src/lib/vendors.ts`, `src/lib/rating.ts`, `src/lib/money.ts` and
`src/lib/types.ts`. This keeps the 11.7 KB catalogue out of the browser bundle; before this
split the whole `products.json` was shipped in a client chunk.

**A real HTTP surface over the mock data.** Route handlers under `/api` (`products`,
`products/[id]`, `categories`, `vendors`) expose the catalogue as JSON with pagination,
filtering and sorting. They wrap the same server-only data layer, so there is one source of
truth and no duplicated query logic. Requests are typed and made through axios via
`createApi`, with every failure normalised to one `ApiError` and one
`{error: {code, message}}` body. Paths live only in `src/lib/api/endpoints.ts`.

Two axios instances share that client. In the browser, same-origin calls go over real HTTP.
On the server, an in-process adapter resolves the same paths against the same functions,
because a Server Component fetching its own route handler needs an absolute origin that
does not exist during `next build`, and a wrong base URL silently calls whatever else is on
that port. Swapping to a real backend means deleting that adapter and setting a base URL.

**One validated parser for URL state.** `/shop` filters, sort and page stay in the URL and
are parsed by a single zod schema in `src/lib/shop-query.ts`. Every value is bounded and
defaulted: an unknown sort falls back to popular, a bad discount or stock value is dropped,
an overlong query is discarded, an inverted price range is swapped, and the page is clamped
to the real page count. The page no longer carries its own `toArray`/`toNumber` helpers.

**Multi-vendor sample data.** Four vendors and eighteen products across nine categories.
Each product carries a vendor id, rating, review count, optional MRP, diet tags and packs.
These are demo records, not live production data.

**Money is integer paise.** Prices are stored and summed as integers, formatted once at
render as INR with no decimals. No floating-point money.

**Client stores hold minimal data.** The cart and saved list persist in `localStorage`
through external stores. They keep shape-validated lines and ids, not catalogue records;
server routes pass products in. Both are untrusted input: the cart is validated with zod on
every restore, quantities are bounded at ten, duplicate lines are merged, and storage is a
versioned envelope (`{version: 2, lines}`) that still reads the old bare-array shape. Legacy
storage keys are migrated on first read.

**One schema per form.** Checkout validation lives in a zod schema in `src/lib/checkout.ts`;
`CheckoutValues` and `CheckoutDraft` are inferred from it and the form keeps its existing
copy and focus-first-invalid behavior.

**No backend.** Checkout validates like a real form and then states plainly that no order
was placed. No fake success states, no invented reviews or metrics beyond the sample
ratings and counts in the catalogue. Because there is no server, the JSON catalogue stands
in for the backend contract, and no client-computed total is treated as authoritative.

**Error and loading boundaries.** `src/app/error.tsx` states a failure plainly and offers
one retry through Next 16's `retry()`; `/shop` and `/shop/[id]` each have a `loading.tsx`
skeleton that reserves layout rather than flashing empty.

## Design

**One action colour.** A deep green is the only action colour. Cream and white carry the
ground; pale green carries trust bands, chips and the newsletter. Colours live in
`src/app/tokens.css`.

**The home follows the OrganicKart marketplace reference.** Search header, category bar,
cream hero, circular category strip, trust band, featured vendors, trending tabs, farmer
banner, diet grid, why-choose band, newsletter and a dark green footer. The brand stays
Kraya; the structure and section order follow the reference.

**Shared shells.** `PageShell`, `PageHeader`, `Section` and `SectionHeader` keep the routes
consistent. Content pages use a 32-36px page title; only the home uses the display scale.

**Typographic roles, not one-off sizes.** The binding scale and rules live in `DESIGN.md`
section 2. Body 16, meta 14, card title 16, section 24-32, page title 32-36, hero 40-60.
Fraunces is display only; DM Sans carries content and figures.

**Catalogue filters.** The shop page is a marketplace catalogue: a cream hero, category
chips, and a sidebar with category, price range, discount, vendor, diet, certification and
availability filters. Sort and the grid/list toggle sit with the page title. Filter state
is URL-backed through one query builder, twelve products show per page, and the product
card adds the default pack size and vendor for this route only.

**Search is part of the marketplace.** The header search submits `GET /shop?q=`. The
catalogue filters on name, summary and origin. This supersedes the earlier single-vendor
decision to defer search until forty SKUs.

**Product cards.** White surface, square photo well, discount badge, heart, two-line title,
rating, price with strikethrough MRP and a full-width Add to Cart. The same card is used on
the home, shop, saved list and related rails.

**Product detail.** A three-column buy area at xl: gallery with thumbnails, arrows and dots;
a buy box with per-pack MRP, quantity, stock, Add to Cart and Buy Now; and a seller panel
with delivery, returns and payment benefits plus a combo promo. A five-item highlight strip,
a tabbed information card, customer reviews and a paged related-products view follow. Long
copy, nutrition, ingredients and usage come from `product-details.json`; products without a
record use generated fallback copy. Reviews and delivery dates are sample data.

**Cart.** The basket page is a two-column cart: one white line card with selection boxes,
photo, badge, vendor, pack and unit rate, price with MRP and discount tag, a quantity
stepper, Save for Later and Remove, plus Select All and Remove Selected. The summary panel
shows item total, item discount, subtotal, delivery, the total and a collapsible coupon
field that states plainly that no demo coupon applies. Save for Later reuses the wishlist
store. Suggestions and a pale green assurance band close the page. Selection drives
Remove Selected only; totals cover the whole cart, so the checkout contract is unchanged.

**Photography.** Local library photographs in full colour, credited on `/credits`. No AI or
invented imagery. The library is illustrative: a product photo is a real food photograph,
not a packshot of the exact SKU.

**Motion.** CSS-only, transform and opacity, disabled under reduced motion. No autoplay.

**No accounts or seller onboarding.** `/account` and `/sell` are honest placeholders so the
chrome has no dead links.
