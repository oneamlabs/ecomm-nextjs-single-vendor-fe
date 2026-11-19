# Next.js Multi-Vendor Marketplace — Frontend Architecture Brief for AI Coding Agents

**Document type:** Implementation specification / architecture decision record  
**Target:** Next.js App Router frontend for a medium-complexity multi-vendor e-commerce marketplace  
**Review date:** 19 November 2026  
**Primary audience:** AI coding agents and engineers implementing or modifying the frontend

---

## 0. Instructions to the AI agent

Treat this document as the frontend architecture baseline, not permission to invent backend behavior.

Before changing code:

1. Inspect the repository, `package.json`, lockfile, Next.js version, existing route structure, API clients, authentication flow, design system, and test setup.
2. Reuse working project conventions and existing dependencies where they already solve the requirement. Do not install a second library for an existing capability.
3. Identify whether the frontend talks to a separate backend (for example, Node.js, FastAPI, or another service) or whether Next.js owns the data layer. Do not assume either architecture without checking the repository or asking for the missing contract.
4. Inspect existing API contracts, OpenAPI schema, generated types, or backend code before creating request/response types. Do not fabricate endpoint paths, fields, roles, permissions, or business rules.
5. Make changes incrementally. Do not perform a broad rewrite when a focused implementation is enough.
6. Keep server-only code out of client bundles. Keep secrets and privileged credentials on the server.
7. Add or update tests for behavior changed. Run the relevant lint, type-check, test, and build commands and report failures accurately.

When this document and the repository conflict, preserve established working behavior unless it is demonstrably unsafe or the task explicitly requests an architectural migration. Explain the conflict before making a breaking change.

## 1. Product context and scope

Build a multi-vendor marketplace with these application areas:

- **Public storefront:** landing page, product catalogue, search, category/vendor browsing, product details.
- **Customer account:** profile, addresses, cart, checkout, order history, order details.
- **Vendor portal:** dashboard, product CRUD, inventory, vendor orders, order status updates, vendor profile.
- **Admin portal:** marketplace overview, vendor management, product moderation, order oversight, customer/vendor administration.
- **Integrations:** authentication, backend APIs, payment provider, shipping/fulfilment, notifications, and potentially analytics.

Expected complexity is medium: authentication, role-based dashboards, CRUD, API integrations, product discovery, cart and checkout. The architecture should be straightforward to operate and extend. Do not introduce enterprise-scale abstractions without a concrete requirement.

### Assumptions that must be verified

- The frontend uses Next.js App Router and TypeScript.
- A backend API may be separate from Next.js. The agent must inspect the repository to confirm.
- Roles include customer, vendor, and admin, but the backend is authoritative for the actual role model and permissions.
- PostgreSQL may be used by the backend, but the frontend must not assume direct database access.
- Payments, pricing, tax, shipping, discounts, inventory, order state, and vendor settlement are backend-authoritative business rules.

## 2. Architecture decisions and library choices

### 2.1 Recommended baseline

| Concern | Choice | Decision |
|---|---|---|
| Framework and routing | Next.js App Router | Use Server Components by default; add Client Components only for browser interaction. |
| Language | TypeScript | Enable strict typing; avoid `any` and duplicated API contracts. |
| Shared client/UI state | Zustand | Use for small, genuinely client-owned state such as guest cart and shared UI controls. |
| API/server state in interactive screens | TanStack Query | Use for client-side CRUD, mutations, refetching, pagination, optimistic updates, and synchronization. |
| Initial public/server data | Next.js Server Components + server-side `fetch`/DAL | Default for SEO-sensitive product and category pages. Do not force every server fetch through TanStack Query. |
| URL/query state | nuqs | Use for catalogue search, filters, sort, and pagination that should be shareable/bookmarkable. Native `searchParams` is sufficient for simple cases. |
| Forms | React Hook Form | Use for complex interactive forms and field-level validation UX. Native forms / Server Actions are fine for simple forms. |
| Validation | Zod | Define reusable schemas where appropriate; validate again at the trusted server/backend boundary. |
| Authentication | Existing backend/session provider first; otherwise choose one of Better Auth or Clerk | Never add a second authentication system alongside an existing backend-owned identity/session flow. |
| Tables | TanStack Table (optional) | Add only if seller/admin tables need sorting, filtering, pagination, selection, or column control. |
| UI components | Existing design system; otherwise shadcn/ui + Tailwind CSS | UI library is separate from state management. Reuse existing components. |

### 2.2 Why this combination

**Zustand** is appropriate for small shared client state without requiring a large central reducer architecture. For this marketplace, the strongest use cases are the guest cart and UI-level state shared across distant client components. It is not a replacement for the backend or for API caching.

**TanStack Query** is useful where the browser actively manages remote data: vendor product CRUD, inventory changes, order lists, admin screens, mutations, retries, background refresh, and cache invalidation. It should not be used mechanically for every read. Public product pages can fetch on the server and render HTML without first booting a client query cache.

**Next.js Server Components and server-side data access** should own initial SEO-sensitive public data and secure server-side operations. This avoids unnecessarily moving all product data fetching into the browser.

**nuqs** is useful because catalogue filters and sorting are part of the page address. A copied URL should reproduce the same catalogue view, and browser back/forward should behave naturally.

**React Hook Form + Zod** provides a good combination for vendor registration, product editors, address forms, and checkout forms. Client validation improves feedback but never replaces validation by the backend.

### 2.3 Libraries not selected by default

- **Redux Toolkit:** Do not add it for this project unless there is a demonstrated need for complex, highly coordinated client workflows, strict event/action conventions across a large team, or an existing Redux codebase.
- **Jotai:** Do not add it alongside Zustand. Consider it only if the interface is dominated by many independently composed atoms and the project deliberately chooses an atomic state model.
- **MobX:** Not needed for the stated requirements.
- **A second server-state library:** Do not combine TanStack Query, SWR, and custom cache layers without a clear reason.
- **A second form library:** Do not combine React Hook Form and Formik.

The goal is not to install every recommended package. Install only the packages required by implemented features.

## 3. State ownership rules — source of truth

This section is mandatory. The agent must not move state between layers simply for convenience.

| Data/state | Source of truth | Frontend handling |
|---|---|---|
| Product name, description, images, SKU, category | Backend | Server Component fetch for public initial render; TanStack Query for interactive management screens. |
| Product price, discount, tax, shipping charge | Backend | Display backend-calculated values. Never trust browser-computed totals at checkout. |
| Inventory/stock | Backend | Query for display; backend validates every add-to-cart and checkout operation. |
| Category/vendor catalogue filters | URL | nuqs or `searchParams`; parse and validate parameters. |
| Search term, sort order, pagination | URL | Keep shareable state in the URL, not Zustand. |
| Selected image/tab/variant on a product page | Local React state unless shared across distant components | `useState` by default. Validate selected variant against product data. |
| Guest cart | Browser persistence, treated as an untrusted draft | Zustand store; persist only item identifiers, selected variant identifiers, and quantities. |
| Authenticated cart | Backend | TanStack Query cache for interactive views; backend owns cart contents and totals. |
| Orders, refunds, shipment status | Backend | TanStack Query in dashboards; server fetch where appropriate for initial page rendering. |
| Authentication session | Auth provider/backend, represented by secure cookie/session | Validate on server. Do not store session secrets in Zustand or localStorage. |
| User role/permissions | Backend | Client may use safe role data to tailor UI, but all sensitive actions must authorize on server/backend. |
| Modal/sidebar/toast/drawer state | Client UI | Local `useState` when local; Zustand only when multiple distant client components need shared state. |
| Form values/errors/dirty state | Form instance | React Hook Form; Zod schema for validation. Do not mirror every field into Zustand. |
| Payment state and confirmation | Payment provider + backend | Trust only verified backend/provider result, never a client redirect or query parameter alone. |

### Non-negotiable ownership rules

1. **The browser is not the source of truth for business data.** Client state is a view, draft, or cache.
2. Do not duplicate the same authoritative value in Zustand and TanStack Query.
3. Do not put product catalogue data, order history, stock, or user permissions into a long-lived global Zustand store.
4. Do not put shareable filters and pagination only in Zustand; represent them in URL parameters.
5. Do not persist authentication tokens, payment credentials, server secrets, or privileged API keys in browser storage.
6. After a mutation, update or invalidate the relevant TanStack Query keys. Do not manually maintain multiple stale copies of the same resource.

## 4. Data fetching strategy

### 4.1 Public storefront

Use Server Components for:

- Landing-page content and featured categories/vendors.
- Product listing's initial result set when server rendering/SEO is important.
- Product detail pages and metadata.
- Public vendor profile pages.

Use Client Components for:

- Interactive filters and sort controls.
- Variant selection, quantity selector, gallery controls.
- Add-to-cart interaction.
- Wishlist toggles, where supported.

For query parameters, validate the incoming values on the server. Never assume a URL parameter is valid merely because nuqs typed it on the client.

### 4.2 Seller and admin portals

Use TanStack Query for screens that require:

- Client-side pagination, sorting, filtering, and search.
- Mutations followed by cache invalidation.
- Background refetching or freshness indicators.
- Optimistic updates where rollback behavior is well-defined.
- Interactive dashboards with multiple independently updating widgets.

Do not use optimistic updates for irreversible or financially sensitive operations unless the backend contract and rollback semantics are explicit. For payment, refunds, stock reservation, and order transitions, prefer server-confirmed state.

### 4.3 Query key conventions

Create centralized query-key factories per feature. Keys must be stable, serializable, and include every variable that changes the result.

Example convention (adapt to actual API contracts):

```ts
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: ProductListFilters) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (productId: string) =>
    [...productKeys.details(), productId] as const,
};
```

For private data, include relevant identity/tenant scope in the key when needed, such as user ID or vendor ID. Never rely on a cache key as authorization.

On logout, account switch, or vendor switch, clear or remove private cached data so one account cannot see another account's cached information. The backend must still enforce access on every request.

### 4.4 QueryClient lifecycle

- In the browser, use a stable QueryClient instance owned by the client provider.
- During server rendering/prefetching, create a request-scoped QueryClient. Never use a module-global server QueryClient that could leak user-specific data between requests.
- Use TanStack Query prefetch + dehydrate/hydrate only when it provides a real benefit, such as warming a client-managed dashboard query. Do not duplicate server-rendered data into React Query without a synchronization plan.
- Set `staleTime`, retry behavior, and refetch behavior by data type. Do not use one blanket cache policy for all resources.

### 4.5 Cache policy guidance

Classify every resource:

- **Public, slowly changing:** product descriptions, categories, public vendor pages. Use deliberate Next.js caching/revalidation based on business freshness requirements.
- **Public, frequently changing:** price, availability, promotion, inventory indicators. Use short freshness windows or dynamic reads as required; always revalidate at add-to-cart/checkout.
- **Private/user-specific:** cart, addresses, orders, dashboard metrics. Avoid shared public caching. Ensure cache scope and server authorization are correct.
- **Financial/transactional:** checkout, payment, refunds, order transitions. Fetch fresh authoritative state and confirm on the backend.

Do not assume a particular Next.js caching default. Check the installed Next.js major version and current docs; configure caching and invalidation explicitly.

## 5. Cart and checkout architecture

Cart behavior is a marketplace-critical flow. Implement it as two modes with one backend contract.

### 5.1 Guest cart

- Use a Zustand store for guest cart items only.
- Persist only stable identifiers (product ID, variant ID if applicable) and quantity.
- Do not persist or trust unit price, discount, tax, shipping, inventory, or payable totals as authoritative values.
- Keep persistence client-only. Avoid reading `localStorage` during server rendering.
- Prevent hydration mismatch: initialize deterministically, then rehydrate the guest cart after the client mounts or using the store's supported hydration pattern.
- Validate cart item quantities and identifiers when restoring persisted state. Treat local storage as untrusted input.
- Provide remove/update/clear actions and guard invalid quantities.

### 5.2 Authenticated cart

- Backend owns the authenticated cart.
- Use TanStack Query for the cart view and mutations.
- On login, send guest cart identifiers/quantities to a documented merge endpoint or call the backend's documented merge behavior.
- Do not invent merge semantics. The backend must define duplicate-item behavior, stock validation, unavailable items, variant conflicts, and whether guest cart items overwrite or combine with an existing cart.
- After merge, discard the guest cart only after successful server confirmation and refresh the authoritative cart query.
- On logout, clear private query cache and initialize a new guest cart state; never display another user's cached cart.

### 5.3 Checkout

- Frontend submits item references, quantities, selected address, and other documented selections.
- Backend recalculates prices, promotions, taxes, shipping, vendor splits, and inventory availability.
- Display the server's final quote/order summary.
- Prevent duplicate submissions in the UI, but also require backend idempotency for order/payment creation.
- Do not mark an order paid based solely on a browser redirect. Confirm payment through trusted backend/provider verification or webhook processing.
- Treat checkout errors as recoverable and show actionable field- or order-level messages without losing the user's valid inputs unnecessarily.

## 6. Authentication and authorization

### 6.1 Choose one authentication owner

The agent must inspect the backend and existing code before selecting a package:

1. **If a backend already owns authentication:** integrate its session/token mechanism. Do not install Better Auth or Clerk as a parallel identity system.
2. **If this is a new Next.js-owned authentication system:** Better Auth is a reasonable self-managed option.
3. **If managed authentication is preferred:** Clerk is a reasonable managed option.
4. Choose one provider. Do not combine Better Auth and Clerk.

Authentication package choice is conditional, not part of the mandatory dependency set.

### 6.2 Session handling

- Prefer secure, `HttpOnly`, `Secure` (in production), appropriately `SameSite` cookies for browser sessions.
- Keep access/refresh tokens out of localStorage and Zustand.
- If the backend is on another origin, inspect its cookie domain, CORS, CSRF, and credential requirements. Do not assume `credentials: "include"` alone solves cross-site authentication.
- Keep server credentials in server-only modules and environment variables.
- Return only the minimum user/session data required by the UI.

### 6.3 Role and vendor authorization

- Treat customer/vendor/admin as examples until the backend contract confirms the actual roles.
- A hidden button or protected page is not authorization.
- Every API endpoint, Route Handler, Server Action, server query, and mutation must verify the current user and permission.
- Vendor-scoped reads/writes must be constrained by the authenticated vendor identity on the backend. Never trust a `vendorId` supplied by the browser as proof of ownership.
- Admin operations require explicit admin authorization on the server/backend.
- Apply authorization at the data-access boundary, not only in the navigation or page layout.

### 6.4 Next.js Proxy/Middleware

- Check the installed Next.js version. Next.js 16 uses the `proxy.ts` convention; older versions may use `middleware.ts`.
- Use Proxy/Middleware only for fast optimistic redirects or request routing where appropriate.
- Never rely on Proxy/Middleware as the only security boundary. Validate the session and permissions again in the actual server action, Route Handler, DAL, or backend endpoint.
- Use the correct file convention for the repository's installed Next.js version; do not rename files blindly.

## 7. Backend integration boundary

The agent must determine which model the project uses.

### Option A — Separate backend API (preferred when a backend already exists)

- Keep API calls behind a typed API client / feature API module.
- Separate server-side API access from browser-side API access where credentials or base URLs differ.
- Put server-only API helpers in modules marked `server-only` where appropriate.
- Keep the backend as the authority for business logic, validation, authorization, pricing, stock, order state, and payments.
- Use Route Handlers as a Backend-for-Frontend (BFF) only where necessary, for example to keep server credentials private, adapt cookies, or normalize a third-party integration. Do not proxy every endpoint without a reason.
- If a BFF is used, avoid leaking backend secrets to the browser and validate input/output at the boundary.

### Option B — Next.js owns backend/data access

- Use a server-only Data Access Layer (DAL) for database access and authorization.
- Keep database clients, ORM calls, and privileged functions out of Client Components.
- Server Actions are suitable for mutations initiated by the UI, but must validate input and authorize the user inside the action.
- Route Handlers are suitable for public API endpoints, webhooks, or external integrations.
- Do not create a separate browser-facing HTTP API for every internal database read unless another consumer needs that API.

### Required API conventions

- Centralize base URLs and request configuration.
- Type request and response DTOs from the real API contract; prefer generated types from OpenAPI when available.
- Normalize API errors into a consistent application error shape without hiding useful server messages in development.
- Handle loading, empty, error, unauthorized, forbidden, and stale states explicitly.
- Do not log credentials, cookies, payment details, or sensitive customer data.
- Do not create fake fallback data that can be mistaken for real production data.

## 8. Recommended folder structure

This is a starting point. Adapt it to the repository rather than forcing a migration.

```text
src/
├── app/
│   ├── (storefront)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── vendors/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (customer)/
│   │   └── account/
│   │       ├── profile/page.tsx
│   │       ├── addresses/page.tsx
│   │       └── orders/page.tsx
│   ├── (seller)/
│   │   └── seller/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── products/page.tsx
│   │       ├── products/new/page.tsx
│   │       ├── products/[id]/edit/page.tsx
│   │       ├── inventory/page.tsx
│   │       └── orders/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── vendors/page.tsx
│   │       ├── products/page.tsx
│   │       └── orders/page.tsx
│   ├── api/                      # Only required Route Handlers/BFF/webhooks/auth
│   ├── layout.tsx
│   ├── providers.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/                       # Design-system primitives
│   ├── layout/                   # Header, footer, nav, shells
│   └── shared/                   # Cross-feature components
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types.ts
│   ├── catalog/
│   │   ├── components/
│   │   ├── server/               # Server-only public data access
│   │   ├── client/               # TanStack Query options/hooks when needed
│   │   ├── query-keys.ts
│   │   └── types.ts
│   ├── cart/
│   │   ├── components/
│   │   ├── guest-cart.store.ts
│   │   ├── client/               # Authenticated cart queries/mutations
│   │   ├── schemas/
│   │   └── types.ts
│   ├── checkout/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── mutations.ts
│   ├── products/
│   ├── vendors/
│   ├── inventory/
│   ├── orders/
│   └── dashboard/
│
├── lib/
│   ├── api/                      # Shared API types and request utilities
│   ├── auth/                     # Client/server auth adapters (provider-specific)
│   ├── query-client.ts
│   ├── env.ts                    # Validated environment configuration
│   ├── utils.ts
│   └── validations/
│
├── server/                       # Only when Next.js owns server/data access
│   ├── dal/
│   ├── services/
│   └── repositories/
│
└── proxy.ts                      # Next.js 16+ only; use middleware.ts on older versions
```

**Folder rules:**

- Route files compose feature components; do not put all business logic inside `page.tsx`.
- Feature-specific code belongs in `features/<feature>/`.
- Keep `server/` modules server-only. Add `import "server-only"` where it prevents accidental client imports.
- Avoid a generic `hooks/`, `stores/`, or `utils/` dumping ground. Place code near the feature that owns it unless genuinely shared.
- Route groups such as `(storefront)` do not appear in the URL. Verify route paths do not conflict.
- Do not create empty folders for speculative future features.

## 9. Provider and state implementation rules

### 9.1 Providers

- Keep the root layout as a Server Component.
- Mount a small Client Component provider boundary for TanStack Query and any required client contexts.
- Do not convert the entire app or root layout into a Client Component merely to access a provider.
- Avoid nesting providers that are not used by the application.

### 9.2 Zustand in Next.js

- Follow the official Zustand Next.js guide for SSR-safe usage.
- Do not expose a mutable module-global store that can be shared across server requests.
- Prefer a store factory and a provider/context when server-provided initialization or request-specific state is needed.
- Server Components must not read or write Zustand stores.
- Keep persisted guest-cart rehydration client-only and prevent server/client markup mismatch.
- Use selectors so components subscribe only to the state they need.

### 9.3 TanStack Query

- Keep query keys centralized per feature.
- Use typed query functions and a single API error convention.
- Invalidate the narrowest correct query keys after mutations.
- Use optimistic updates only when rollback is safe and the mutation semantics are clear.
- Configure `staleTime`, retry, refetch-on-focus, and garbage collection deliberately.
- Clear or remove private cache data on logout and identity changes.
- Do not place secrets or server-only API clients in query functions shipped to the browser.

### 9.4 nuqs

Use URL state for catalogue filters, sort, search, and page number. Define parsers/defaults centrally. Reset pagination when filters that invalidate the current page change. Keep URL values validated and bounded; do not permit arbitrary unbounded page sizes or invalid sort fields.

### 9.5 React Hook Form + Zod

- Use one authoritative schema per form/domain where practical.
- Infer TypeScript types from Zod schemas instead of duplicating handwritten types.
- Validate in the browser for user experience and validate again on the server/backend for security.
- Use controlled components only when required by the UI component library.
- Do not copy every form field into a global store.

## 10. Example implementation patterns

These examples are patterns only. Adapt endpoint names and data types to the actual backend contract.

### 10.1 Query keys

```ts
// features/orders/query-keys.ts
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderListFilters) =>
    [...orderKeys.lists(), filters] as const,
  detail: (orderId: string) =>
    [...orderKeys.all, "detail", orderId] as const,
};
```

### 10.2 Client component using a query

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "@/features/orders/query-keys";
import { getOrders } from "@/features/orders/client/queries";

export function OrderList({ filters }: { filters: OrderListFilters }) {
  const query = useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => getOrders(filters),
  });

  if (query.isPending) return <OrderListSkeleton />;
  if (query.isError) return <ErrorState onRetry={() => query.refetch()} />;
  if (query.data.items.length === 0) return <EmptyOrders />;

  return <OrdersTable orders={query.data.items} />;
}
```

### 10.3 Guest cart store — minimal example

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type GuestCartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
};

type GuestCartState = {
  items: GuestCartItem[];
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

// This is a client-side persistence pattern. In a Next.js app, ensure
// storage rehydration is delayed/handled safely to avoid hydration mismatch.
export const createGuestCartStore = () =>
  create<GuestCartState>()(
    persist(
      (set) => ({
        items: [],
        setQuantity: (key, quantity) =>
          set((state) => ({
            items: state.items
              .map((item) => {
                const itemKey = `${item.productId}:${item.variantId ?? "default"}`;
                return itemKey === key ? { ...item, quantity } : item;
              })
              .filter((item) => item.quantity > 0),
          })),
        removeItem: (key) =>
          set((state) => ({
            items: state.items.filter(
              (item) => `${item.productId}:${item.variantId ?? "default"}` !== key,
            ),
          })),
        clear: () => set({ items: [] }),
      }),
      {
        name: "guest-cart-v1",
        // Add a versioned migration strategy if the persisted shape changes.
        version: 1,
      },
    ),
  );
```

This snippet is intentionally incomplete for production: the agent must implement a Next.js-safe provider/hydration strategy, validate restored values, define quantity bounds, and test guest-cart merge. Do not copy it as a drop-in global singleton if server rendering can access the store.

## 11. Security and marketplace-specific requirements

These are mandatory, not optional polish.

### Authorization and multi-tenancy

- Vendor users may only read and mutate resources owned by their authenticated vendor account.
- The backend must derive or verify vendor ownership from the authenticated session, not trust a client-supplied vendor identifier.
- Admin-only operations must be enforced by the backend/server boundary.
- Do not expose draft, hidden, rejected, or private vendor products through public catalogue queries.
- Do not let a customer request another customer's cart, addresses, or order details by changing an ID.

### Commerce integrity

- Recalculate price, discount, tax, shipping, totals, and stock on the backend.
- Validate product/variant availability when adding to cart and again during checkout.
- Use backend idempotency for order/payment creation and other retry-sensitive operations.
- Confirm payment using trusted provider/backend verification; never trust client-side success alone.
- Treat order status transitions as backend-controlled state machines.
- Do not calculate vendor settlements or platform commissions as authoritative frontend values.

### Data exposure

- Return minimum safe DTOs to Client Components.
- Never pass database models, secrets, internal notes, private vendor fields, or payment credentials to the browser.
- Mark server-only modules and check bundle boundaries.
- Avoid logging personal data, tokens, cookies, addresses, or payment-related information.

## 12. UX, performance, and reliability requirements

- Use `loading.tsx`, Suspense boundaries, and skeletons for meaningful loading states.
- Provide explicit empty, error, unauthorized, forbidden, and not-found states.
- Avoid layout shifts in product cards and image galleries by reserving image dimensions.
- Use Next.js image optimization appropriately and do not fetch huge catalogue payloads when only a page of results is needed.
- Use pagination or cursor pagination for large seller/admin tables; avoid loading all records into the browser.
- Debounce text search where it reduces noisy API requests, but keep the URL state predictable.
- Avoid unnecessary Client Components. Keep static layout and SEO content server-rendered.
- Keep interactive components small and subscribe to only the state they need.
- Make forms keyboard accessible and expose validation errors to assistive technology.
- Confirm destructive operations and provide clear success/failure feedback.
- Do not silently swallow errors or render fake success states.

## 13. Testing expectations

At minimum, test the following boundaries:

### Unit/component tests

- Zod validation for product, address, and checkout forms.
- Guest cart quantity rules, add/remove behavior, persistence migration, and invalid stored data handling.
- Query key construction and filter parsing where non-trivial.
- UI loading/error/empty states for important screens.

### Integration tests

- Guest cart merges after login according to backend-defined rules.
- Authenticated cart mutation refreshes the cart view.
- Product CRUD invalidates the relevant list/detail queries.
- Logout clears private query data.
- Vendor users cannot access another vendor's resources.

### End-to-end tests

- Customer: browse → product detail → guest cart → login/merge → checkout initiation.
- Vendor: login → create/edit product → update inventory → view orders.
- Admin: login → vendor/product moderation path.
- Authorization: customer cannot open seller/admin screens or call protected operations.
- Payment confirmation must be tested against a provider sandbox or a mocked trusted backend flow, never by trusting a front-end redirect alone.

The agent must not claim a test passed unless it was actually run and passed.

## 14. Suggested implementation phases

1. **Repository audit:** confirm framework version, API ownership, auth provider, design system, environment variables, route structure, and test framework.
2. **Foundations:** TypeScript conventions, environment validation, providers, API client/server adapter, error model, feature-folder conventions.
3. **Authentication and authorization:** session integration, route UX, role-aware layouts, server/backend authorization checks.
4. **Public catalogue:** server-rendered category/product pages, product detail, URL filters/search/sort/pagination.
5. **Cart:** guest Zustand store, authenticated backend cart, login merge, cache invalidation.
6. **Checkout:** form validation, backend quote/order creation, idempotency, payment-provider handoff and verification display.
7. **Vendor portal:** product CRUD, inventory and vendor orders using TanStack Query where interactive client behavior is needed.
8. **Admin portal:** moderation and marketplace operations with strict authorization.
9. **Hardening:** tests, accessibility, cache review, error handling, performance profiling, security review.

Do not build all features at once. Complete and test each vertical slice before expanding.

## 15. Definition of done

A feature is not complete until:

- The implementation follows the state ownership table.
- Backend contracts and authorization rules are verified rather than invented.
- Server-only code and secrets cannot enter the client bundle.
- Loading, empty, error, and permission-denied states are handled.
- TanStack Query cache is correctly invalidated after mutations where applicable.
- Private cache data is cleared on logout/account switch.
- Forms validate on both client and trusted server/backend boundary.
- Critical commerce values are recalculated/verified by the backend.
- Relevant unit/integration/e2e checks are run and results reported.
- Lint, type-check, and production build are run where available.

## 16. Dependency installation guidance

Install only after checking the existing package manifest and lockfile.

Core candidates for the recommended baseline:

```bash
npm install zustand @tanstack/react-query nuqs react-hook-form @hookform/resolvers zod
```

Optional, only if the UI requires feature-rich data tables:

```bash
npm install @tanstack/react-table
```

Authentication is conditional. Choose one only after auditing the current backend/session design:

```bash
# Self-managed authentication option
npm install better-auth

# OR managed authentication option — do not install both
npm install @clerk/nextjs
```

Do not install either auth package if an existing backend/provider already owns authentication and the frontend should integrate with it.

## 17. Official references

Use the documentation that matches the versions in the repository. These links are primary references, not a substitute for inspecting the project's installed versions.

- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js — Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Next.js — Data Security](https://nextjs.org/docs/app/guides/data-security)
- [Next.js — Authentication](https://nextjs.org/docs/app/guides/authentication)
- [Next.js — Proxy file convention](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Zustand — Setup with Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs)
- [TanStack Query — Advanced Server Rendering / Next.js App Router](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [nuqs — Type-safe search params](https://nuqs.dev/)
- [React Hook Form — Getting Started](https://react-hook-form.com/get-started)
- [Zod — Documentation](https://zod.dev/)
- [Better Auth — Next.js integration](https://better-auth.com/docs/integrations/next)
- [TanStack Table — Overview](https://tanstack.com/table/latest/docs/overview)

---

## Final architecture decision

For this marketplace, start with **Next.js App Router + Server Components + Zustand + TanStack Query + nuqs + React Hook Form + Zod**.

Keep the backend authoritative for identity, permissions, product data, price, inventory, cart totals, orders, and payments. Use Zustand only for small client-owned state—especially the untrusted guest cart—and use TanStack Query for interactive remote data in dashboards and authenticated client flows. Use URL parameters for shareable catalogue state.

**Do not add Redux, Jotai, MobX, SWR, Better Auth, or Clerk by default.** Add a library only when the repository or a concrete feature demonstrates the need.
