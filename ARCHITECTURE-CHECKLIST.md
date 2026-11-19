# Frontend architecture checklist

Tracking the implementation of `nextjs_marketplace_frontend_architecture_ai_agent.md`
against this repository. Each item states what the brief asks for, what the audit found,
and what was actually done. Boxes are ticked only where the change is in the tree and the
listed check passes.

Last updated: architecture pass 3 (API migration complete).

---

## 0. Audit findings

| Item | Finding |
| --- | --- |
| Framework | Next.js 16.4.6, App Router, `cacheComponents` and `partialPrefetching` on |
| Language | TypeScript `strict: true` |
| Data owner | **No backend.** `src/data/*.json` read through `src/lib/catalogue.ts` |
| Auth | **None.** README states "no accounts"; `/account` and `/sell` are honest placeholders |
| Design system | Local: `src/app/tokens.css`, `components/ui`, no component library |
| State | Custom external stores (`cart-store`, `wishlist-store`) via `useSyncExternalStore` |
| URL state | `searchParams`, parsed ad hoc in `shop/page.tsx` (before this pass) |
| Forms | Hand-rolled validation in `src/lib/checkout.ts`, no schema library (before this pass) |
| Tests | None beyond Puppeteer `check:ui` and `smoke` (before this pass) |
| Package manager | npm |

### The one real architecture defect

The whole catalogue shipped to the browser. `src/lib/catalogue.ts` imported
`products.json`, `vendors.json` and `categories.json` at module scope, and four client
components imported helpers from it, so the entire 11.7 KB product array landed in a
client chunk. Verified by finding `organic-red-quinoa` inside `.next/static/chunks/*.js`.

### Conflicts with the brief, and how they were resolved

The brief assumes a backend API, authentication and role-based portals. This repository is
an explicitly backend-free demo. The brief's own rule (section 0) says to preserve working
behavior and explain conflicts rather than perform a migration, so:

- **No TanStack Query, Zustand, nuqs, Better Auth or Clerk installed.** There is no remote
  server state, no backend session and no portal to manage. Section 2.3 forbids adding
  speculative libraries.
- **No `features/` restructure.** Section 8 says to adapt to the repository. The existing
  `components/` + `lib/` layout is kept.
- **No auth, seller or admin implementation.** Inventing an identity system with no backend
  would fabricate contracts, which section 0.4 forbids.
- **Portals and auth are recorded as deferred**, not silently dropped.

---

## 1. Foundations

- [x] **Mark the data access layer server-only.** `catalogue.ts`, `reviews.ts` and
      `product-details.ts` begin with `import "server-only"`.
      Evidence: a client import now fails the build.
- [x] **Stop client components importing the data layer.** Pure helpers moved to
      `src/lib/variant.ts` (pack maths), `src/lib/vendors.ts` (small public reference),
      `src/lib/rating.ts` (distribution). `product-card`, `product-list-row`,
      `product-buy-box`, `basket-contents`, `product-tabs` and `reviews-section` repointed.
      Evidence: `findstr organic-red-quinoa .next/static/chunks/*.js` returns nothing;
      `Add to Cart` and `kraya-cart` still return hits, so the search is valid.
- [x] **Validate URL state centrally.** One zod schema in `src/lib/shop-query.ts` replaces
      the page's `first`/`toArray`/`toNumber`/`toDiscount`/`toStock` helpers.
      Evidence: `tests/shop-query.test.ts`.

- [x] **A real HTTP API over the mock data (brief §7 Option B).** Route handlers at
      `/api/products`, `/api/products/[id]`, `/api/categories`, `/api/vendors` wrap the
      server-only data layer. They validate input and return the brief's required states:
      `400` on bad input, `404` on a missing product, one `{error:{code,message}}` envelope.
      Evidence: live curl checks returned 400/404 with the right bodies; pagination,
      filtering, sorting and detail all returned correct shapes.
- [x] **Centralised endpoints.** Every path is built in `src/lib/api/endpoints.ts`, used by
      the client and the server adapter. `tests/api-endpoints.test.ts` covers building and
      parsing.
- [x] **One typed client over axios with one error convention.** `createApi` normalises
      timeouts, network failures, 400, 404 and 5xx into `ApiError`.
      Evidence: `browser.ts` and `server.ts` share it.
- [x] **Server components never self-fetch over HTTP.** The server instance resolves the
      same paths in-process, so `next build` prerenders without a listening origin and a
      wrong base URL cannot call an unrelated server on the same port.
- [x] **The API is the only path to data.** Home, shop, product, basket, checkout,
      wishlist, sitemap, `generateStaticParams` and the site header all read through
      `serverApi`. Verified: grepping `src/app` for `@/lib/catalogue|reviews|product-details`
      returns nothing; only the route handlers and the mock backend reach the DAL.
- [x] **Missing is not the same as failed.** `isMissingResource` gates `notFound()`; every
      other API failure is rethrown to the error boundary.
      Evidence: `tests/api-errors.test.ts`; a temporary probe throwing inside
      `readProductDetail` made `next build` fail with "Error occurred prerendering page
      /shop/organic-red-quinoa" instead of emitting a 404. After removing the probe,
      `/shop/does-not-exist` returns a real 404 and the real product returns 200.
- [x] **One call per page, not one per section.** `/api/products` returns facets for the
      sidebar; `/api/products/[id]/detail` returns the record, long copy, reviews, category,
      vendor and related rail. Evidence: `/shop` made the old local facet computation
      dead code, and the detail endpoint returned `reviews=2 related=4` live.

## 2. State ownership

- [x] **Guest cart stays an untrusted draft.** Persists only `productId`, `variantId`,
      `quantity`; zod-validated on restore; quantity bounded at 10; duplicates merged;
      versioned envelope with legacy bare-array migration.
      Evidence: `tests/client-stores.test.ts` plus a live browser check that seeded the v1
      shape and saw it migrate to `{version: 2, ...}`.
- [x] **Saved list hardened the same way.** `wishlist-store.ts` now zod-validates ids
      (shape, length, charset), dedupes, caps at 100, and persists a versioned envelope that
      still reads the v1 bare array. Invalid saves are ignored rather than stored.
      Evidence: `tests/client-stores.test.ts` covers toggle, idempotent save, malformed
      ids, legacy migration, dedupe, the cap, unparseable storage and the envelope.
- [x] **Shareable catalogue state stays in the URL.** Filters, sort and page remain
      `searchParams`; nothing was moved into a client store.
- [x] **Record that commerce values are backend-authoritative.** `DECISIONS.md` states the
      JSON catalogue stands in for the backend contract and no client total is trusted.

## 3. Forms and validation

- [x] **One schema per domain, types inferred.** `src/lib/checkout.ts` is a zod schema;
      `CheckoutValues` and `CheckoutDraft` are inferred; every user-facing message and the
      focus-first-invalid behavior is preserved.
      Evidence: `tests/checkout.test.ts`; live check produced the exact original copy.

## 4. UX resilience

- [x] **App error boundary.** `src/app/error.tsx` uses Next 16's `retry()`, states the
      failure plainly, and offers no fake success.
- [x] **Loading states.** `src/app/shop/loading.tsx` and `src/app/shop/[id]/loading.tsx`
      reserve layout with skeletons and expose an `output` status.
- [x] **Not-found stays honest.** Existing `not-found.tsx` kept.

## 5. Testing

- [x] **Test runner with no new runtime.** `npm test` uses `node --test` with native
      TypeScript stripping. *Vitest was attempted and rejected*: it needs
      `@types/node@22+` and the project is pinned to `^20`, and the failed install briefly
      stripped dev dependencies before `npm install --include=dev` restored them.
- [x] **31 tests across four files** (now 44 across five): cart store, saved list,
      shop-query, checkout, and the API endpoint paths. Every case names what it protects.

- [x] **Accessibility measured, not asserted (brief §12).** `npm run check:a11y` runs
      axe-core (WCAG 2.1 A/AA) on 9 routes x 2 viewports and fails on critical or serious
      findings. Three real violations were found and fixed: the logo link's `aria-label` did
      not contain its visible text, the Add to Cart label omitted "Add to Cart", and the
      disabled pagination control was 2.32:1. Contrast is separately measured by resolving
      `oklch` through canvas pixel readback (axe cannot parse it): lowest 4.91:1 vs 4.5:1.
      Result: **0 violations, 18/18 clean.**
- [x] **Corrected over-claimed docs.** `DESIGN.md` said "44px controls"; measured primary
      actions are 44px but secondary/chrome controls are 36-40px. That passes WCAG 2.2 AA
      target size (24px) but not the 44px AAA target, and the doc now says so.

## 6. Documentation

- [x] `DECISIONS.md` records the server-only data layer, the validated URL parser, the
      versioned cart envelope, the zod checkout schema and the error/loading boundaries.
- [x] `README.md` documents the server-only boundary, the `/shop` parser, the `tests/`
      folder and `npm test`.
- [x] This checklist.

## 7. Customer accounts (mock)

- [x] **Sign-in, sign-up and dashboard.** `/account/sign-in`, `/account/sign-up` and
      `/account`. Forms validate with zod, surface field errors from the server, and the
      sign-in form is pre-filled from `src/lib/auth/demo.ts` so the demo is one click.
- [x] **Mock data.** `src/data/customers.json` seeds three customers with addresses and
      order history; a test fails if the pre-filled credentials drift from it.
- [x] **Session is server-only.** httpOnly, SameSite=Lax cookie; no token in `localStorage`;
      a sealed payload that fails closed if edited.
- [x] **Labelled as a mock, not authentication.** No password hashing, no session store, no
      email verification, and new accounts do not survive a restart. Recorded in the UI copy,
      `README.md` and `DECISIONS.md`.
- [x] **Two real bugs found while verifying.** `/account` could not prerender because it
      reads the cookie, so it is `instant = false` and the header reads the session behind a
      `<Suspense>` boundary; and a module-level `Map` of signed-up users was duplicated per
      bundle, so a new account was invisible to the page. It now uses a `globalThis` registry.
- [x] **Verified end to end in a browser.** Signed-out prompt; wrong password rejected with
      no cookie; one-click sign-in sets an httpOnly cookie and renders orders and addresses;
      the header shows the signed-in name; sign-out clears the cookie; sign-up lands on an
      empty dashboard with the demo notice; duplicate email and mismatched passwords both
      rejected.
- [x] **Dedicated account pages, not anchors.** `/account`, `/account/orders`,
      `/account/addresses` and `/account/profile`, under one route-group layout
      (`src/app/account/(dashboard)/layout.tsx`) that owns the sidebar, the session read and
      the signed-out fallback. The sidebar is real navigation driven by `usePathname`, so
      `aria-current="page"` is correct on every route, back/forward works, and each section is
      linkable. It collapses to a scrollable strip on a phone. Order lines resolve product and
      pack names from the catalogue.
      Evidence: browser run showed the right `h1`, the right `aria-current`, working sidebar
      clicks, and all four pages falling back to the sign-in prompt when signed out.
- [x] **One layout, not a shell per page.** `AccountShell` was deleted; the layout replaced
      it. Sign-in and sign-up stay outside the group, so they have no sidebar.
      `readAccountOrNull` is wrapped in `React.cache`, so the layout and the page share one
      session read per request instead of two.
- [x] **Leftover fixed.** The mobile menu said "Your account" while signed out; it now reads
      "Account" like the desktop rail.
- [x] **Accessibility re-run** across 24 route/viewport pairs including the three new
      account routes: 0 violations.

---

## Deferred (recorded, not dropped)

In scope for a real deployment, impossible to build honestly against the current repo.

- [ ] **Real authentication (Better Auth or Clerk).** The mock in §7 must be replaced before
      any real customer data exists. The current flow has no password hashing and no store.
- [ ] **TanStack Query for seller/admin screens.** Blocked: no portal and no remote API.
- [ ] **nuqs for catalogue state.** `searchParams` plus one validated parser already gives
      shareable state; revisit if client transition ergonomics become a problem.
- [ ] **Seller portal: product CRUD, inventory, vendor orders.** Needs a backend.
- [ ] **Admin portal: vendor/product moderation, order oversight.** Needs a backend.
- [ ] **Guest cart merge on login.** Needs a documented backend merge endpoint.
- [ ] **Backend-authoritative checkout, payment handoff, idempotency.** Needs a backend.
- [ ] **TanStack Table.** Optional; only if seller/admin tables need sorting and selection.
- [ ] **React Hook Form.** Optional; add when a form needs field-level dirty/touched state
      beyond zod plus `useState`.

---

## Verification for this pass

All run against this tree, in this order:

| Check | Result |
| --- | --- |
| `npm run check:data` | Data check passed: 18 products, 9 categories, 4 vendors, 17 photos |
| `npm run typecheck` | clean |
| `npm run lint` | 0 warnings, 0 errors |
| `npm test` | 49 pass, 0 fail |
| `npm run build` | compiled, 37 pages generated, 18 product routes prerendered |
| `npm run smoke` (production server) | all routes 200, 404 on the unknown product |
| `npm run check:ui` (production server) | 12 route/viewport pairs clean; heights and h1 sizes identical to before the migration |
| API spot checks (curl) | pagination, filtering, sorting, detail bundle, 400 and 404 envelopes correct |
| Page spot checks | real product 200, unknown product 404, `/shop` 200, detail 404 on unknown |
| `npm run check:a11y` (production server) | 0 violations on 18/18 route/viewport pairs; lowest contrast 4.91:1 |

Bundle check: `organic-red-quinoa`, `Uttarakhand, India` and `Grains & Cereals` do not
appear in `.next/static/chunks`; `Pahadi Organics` does, which is intended (small public
vendor reference data used by every card).
