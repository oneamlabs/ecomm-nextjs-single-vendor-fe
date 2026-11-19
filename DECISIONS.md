# Decisions

Current engineering and design decisions for Kraya. Superseded decisions are removed rather than kept as history.

## Architecture

**Next.js App Router, server-first.** Pages are server components. `"use client"` exists only on leaves that need state or events: filters, gallery, variant picker, basket, wishlist. `params` and `searchParams` are awaited.

**JSON dressed as an API.** `src/data/*.json` is typed and read through `src/lib/catalogue.ts`. Components never import JSON directly; replacing the module with `fetch()` is the swap point.

**Money is integer cents.** Prices are stored and summed as integers, formatted once at render. No floating-point money.

**Client stores hold minimal data.** The basket and saved list persist in `localStorage` through external stores. They keep shape-validated lines and ids, not catalogue records; server routes pass products in. Legacy storage keys are migrated on first read.

**No backend.** Checkout validates like a real form and then states plainly that no order was placed. No fake success states, no invented reviews or metrics.

## Design

**One action colour.** A deeper tomato is the only action colour. Three pale shelf tints (citrus, cobalt, tomato) identify the shelves. Paper, ink and muted ink carry everything else. Colours live in `src/app/tokens.css`.

**Shared shells.** `PageShell`, `PageHeader`, `Section` and `SectionHeader` keep the routes consistent. Content pages use a 40px page title; only the home uses the display scale.

**Typographic roles, not one-off sizes.** The binding scale and rules live in `DESIGN.md` section 2. Body 17, meta 15, lead 20, card title 24, content section 24, page/product title 40, selected price 28. The display scale belongs to the home, banner and wordmark only. If a new role is needed, add a token and update `DESIGN.md` first.

**Shop sidebar.** Shelf is a native radio group; diet is a native checkbox group with multi-select OR; sort lives in the results toolbar. Applied filters are removable chips. Cards are compact at four across on xl, three on lg, two on sm.

**Product detail.** A 4:5 gallery with vertical thumbnails and per-image credit, a buy box with pack buttons, price/rate, stock, quantity and delivery, and a full-width provision sheet below. No oversized display headings on the page.

**Photography.** Local library photographs in full colour, credited on `/credits`. No AI or invented imagery.

**Motion.** CSS-only, transform and opacity, disabled under reduced motion. The highlights banner is manual and never autoplays.

**Search is deferred by measurement, not by omission.** The catalogue is 12 items,
`/shop` is 2.6 screens at 1440, every product is reachable in two clicks, and the home
page names all of them. Add search when the catalogue passes roughly **40 SKUs**, or when
`/shop` exceeds about **four screens** at 1440. When that happens, the entry point belongs
in the shop toolbar (an `/shop?q=` filter), not the header, so it does not compete with
Basket and Menu on small screens.

**One merchandising home per product.** The home page may not show the same product as a
card twice. The featured rail carries four pantry and drinks items at full size; the shelf
index carries only the rest. Olive oil is the one exception: the hero price ticket is a
readout of a live pack price, not a product card, so it also appears in the index.
