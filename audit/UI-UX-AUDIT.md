# Kraya homepage — UI/UX audit

Strict-mode audit of `/` (homepage). Every item below was measured against the running
app (Chrome 1440×900, 1262×568, 390×844, 320×844), not inferred from source.

Method: axe-core 4.12.1 (wcag2a/2aa/21aa/22aa), DOM geometry probes, pixel-level contrast
measurement on text-over-photo, live computed styles under `prefers-reduced-motion`,
and a 200% zoom reflow check. Scored against WCAG 2.2 AA plus this repo's own
`DESIGN.md` §2 contract.

**Headline:** axe reports **0 violations**. The real findings are self-contract
violations, navigation state, control affordances, and dead code — not accessibility
failures.

> **Status: all 15 items closed.** H1–H4, M1–M7, L1–L3, L5 fixed; M8 deferred with a
> written trigger; L4 investigated and closed as not-a-defect; icons migrated to Phosphor.

---

## Verified clean (do not re-investigate)

| Check | Result |
| --- | --- |
| axe WCAG 2.2 AA violations | **0** (28 passes) |
| axe `color-contrast` incompletes (32 nodes) | **All pass on measurement.** Banner h2 12.0:1, banner body 11.7:1, eyebrow 14.6:1, `.tag` 10.1:1 |
| Focus ring contrast on dark surfaces | **Pass.** 3px ring, measured 17.7:1 (white on ink) |
| `prefers-reduced-motion` | **Honoured.** marquee/enter animations → `none`, scroll → `auto` |
| Horizontal overflow 320 / 390 / 1440 | **None** — also none with `overflow-x: clip` removed |
| 200% zoom reflow | **No overflow** (720×450 client) |
| Heading order | **No skipped levels** |
| Image alt text | 25/25 present and descriptive |
| Core Web Vitals | LCP 484ms, CLS 0, TTFB 205ms |
| Price formatting | No `NaN` / `Infinity` / `undefined` in any `.num` |
| Content voice | 0 em dashes, 0 en dashes, 0 exclamation marks |

---

## High

### H1 — Controls are below the 44px standard this repo sets for itself — **FIXED**
`DESIGN.md` §2.2.11 requires "44px controls". Measured heights **before**:

| Control | Height | File |
| --- | --- | --- |
| Compact QuickAdd / Wishlist (`md:min-h-9`) | **36px** | `product/quick-add.tsx:55`, `wishlist/wishlist-button.tsx:38` |
| Ticker Pause (`md:min-h-9`) | **36px** | `market/facts-ticker.tsx:28` |
| Header nav links | **37px** | `chrome/site-header.tsx:50` |
| Price-board pack chips (`.chip`) | **42px** | `globals.css:212` |
| Price-board product link | **26px** | `market/price-board.tsx:29` |
| Logo link | 31px desktop / **24px mobile** | `chrome/site-header.tsx:36` |
| Fresh "Drinks" / "Fresh" links | 43×44 / **38×44** | `page.tsx:341` |

The `md:min-h-9` overrides were the clearest defect: compact controls were 44px on
mobile and deliberately shrank to 36px on desktop, the opposite of the rule.

- [x] Removed every `md:min-h-9` / `md:min-h-9 md:w-9` override; kept `min-h-11`.
- [x] Raised `.chip` `min-height` to 44px.
- [x] Gave the price-board product link `min-h-11 inline-flex items-center`.
- [x] Padded the logo link to a 44px-tall hit area.
- [x] Fixed the two shelf links in the index to ≥44px in both axes.

**Verified:** undersized controls went **30 → 2** at 1440 and 390. The two that remain
are footer text links inside a 44px-tall stack; they pass WCAG 2.2 (24×24), so widening
them further would be over-engineering.

### H2 — Carousel controls never disable and the rail has no scroll affordance — **FIXED**
Verified on the "Featured provisions" rail: at `scrollLeft 631 == maxScroll 631`,
`Next` was still enabled and still clickable. `Previous` was enabled at `scrollLeft 0`.
The rail also hid its scrollbar and was not focusable (`tabIndex -1`), so there was no
visual or keyboard cue that more content exists — while the `:focus-visible` rule in
`globals.css` was dead code that could never fire.

- [x] Track `scrollLeft`/`clientWidth`; `disabled` on `Previous` at start and `Next` at
      end (`components/ui/carousel.tsx`).
- [x] Deleted the unreachable `.rail:focus-visible` rule.

**Verified:** desktop — `Previous` disabled at 0, `Next` disabled at 631/631. Mobile
(390) — `Next` disables at 543/543 on the shelf rail and 1242/1242 on the range rail.
A non-scrollable rail disables both.

### H3 — Nav marks "Shop" as current while a category filter is active — **FIXED**
Measured at `/shop?category=drinks` and `/shop?tag=vegan`: `aria-current="page"` and the
active background sat on **Shop**, not on Drinks/Vegan. The comparison was exact-string
(`pathname === link.href`), so a link with a query string could never become active.

- [x] Added `components/chrome/nav-links.tsx`, matching `pathname` plus the query
      parameters each link declares, inside a `Suspense` boundary as Next 16 requires
      under `cacheComponents`.
- [x] The fallback renders the same list, so the nav is in the server HTML and nothing
      shifts when the query resolves.

**Verified:** `/shop` → Shop; `?category=drinks` → Drinks; `?category=fresh` → Fresh;
`?tag=vegan` → Vegan; `/wishlist` → Saved; `/` and `/shop/olive-oil` → no false active.
The homepage is still prerendered as static in the production build.

### H4 — 13px running text contradicts the type contract — **FIXED**
`DESIGN.md` §2.2.4: "No running text below 15; 13 is only for numeric counts and badges."
The footer disclaimer was running prose at **13px**.

- [x] Set it to `text-sm` (15px), keeping `--color-muted` for quietness.

---

## Medium

### M1 — Ticker text scrolls underneath the floating Pause button — **FIXED**
Over a 36-sample cycle, **8 samples** had marquee words passing under the button
(observed `Twelve provisions` and `Bristol` directly behind it). The button floated at
`right-4` with no reserved space in the track.

- [x] Moved the button out of the scrolling area into its own flex child, so the track
      clips before the control rather than under it.

**Verified:** visible overlap (accounting for the clip window) went **8/36 → 0/36** on
desktop, and **0/12** at both 390px and 320px.

### M2 — Ticker region is named "Kraya" — **FIXED**
The `<section aria-label="Kraya">` created a landmark labelled with the site name,
which tells a screen-reader user nothing.

- [x] Renamed to `aria-label="Shop facts"`.

### M3 — Add to cart announced the same thing up to three times — **FIXED**
One click produced: the button's own `aria-label` flipping to
`Added Olive oil… to cart`, a dedicated `aria-live` region with the full sentence, and
the cart count's sr-only `, 1 item`. There were **17** `aria-live` regions in the
document — 15 of them were one per product card.

- [x] Added `lib/announce.ts` plus a single `<output aria-atomic="true">` mounted once in
      `layout.tsx`, exposing `announce(message)`.
- [x] `QuickAdd` and `VariantPicker` announce through it instead of rendering their own
      live regions; the button keeps a stable accessible name.
- [x] Removed the price-board and variant-picker price live regions — a radio already
      announces its own label on selection, and a bare changing number is exactly what
      the guidance says not to announce.
- [x] Left the banner slide status and the shop result count: each is a distinct,
      contextual status, not a competing per-item region.

**Verified:** homepage live regions **17 → 1** (plus the single `output`). One click
yields exactly one announcement: "Olive oil, cold pressed, 500 ml bottle, added to
basket. £18.50." The button's `aria-label` stays `Add … to basket` while its visible
text flashes "Added". Shop and product pages sit at one region each; basket and saved
at zero.

### M4 — Mobile menu did not close on Escape and did not take focus — **FIXED**
Verified at 390px: opening set `aria-expanded="true"` and unhid the panel, but Escape
left it open and focus stayed on the toggle.

- [x] Added a document `keydown` listener that closes on Escape and returns focus to the
      toggle.
- [x] Moved focus to the first menu item on open.

**Verified:** open → focus lands on the "Shop" link inside the menu; Escape → menu
hidden, `aria-expanded="false"`, focus back on the toggle; reopening works.

### M5 — Single-select groups used toggle semantics — **FIXED**
The price-board pack sizes and the banner slide dots are both "exactly one is true",
but were exposed as independent `aria-pressed` toggles, which is the wrong contract for
a choice.

- [x] Price board: replaced the chips with real `<input type="radio">` + labels using the
      existing `.seg` pattern; deleted the chip usage there.
- [x] Banner dots: real radios with a visible checked dot and an `sr-only` label.
- [x] Dropped `aria-roledescription` from elements that had no role to carry it.

**Verified:** 2 pack radios (1 checked), 3 slide radios (1 checked), 0 chips left, 0
`aria-pressed` dots. Clicking a dot changes the slide; clicking a pack radio changes the
price (£18.50 → £33.00).

### M6 — 1.29 MB of images, upscaled into smaller slots — **FIXED**
Measured before: 24 image responses, **1043 KB** in the loaded window, of which
**887 KB was the banner** — all three slides eager at 1920w into a 1344px slot.

- [x] The banner now renders only slides that have been visited, so the first paint
      requests one image; the others load on navigation and still crossfade because the
      wrappers stay mounted.
- [x] Corrected `sizes` from a flat `1344px, 100vw` to `(min-width: 96rem) 1344px,
      (min-width: 64rem) 90vw, 100vw`.
- [x] Gave the first slide `priority` and the rest `loading="lazy"`.

**Verified:** payload **1043 KB → 312 KB** (−70%); banner **887 KB → 156 KB**. Banner
images load progressively 1 → 2 → 3 as slides are visited, and opacity wrappers still
switch correctly.

### M7 — The same twelve products are shown up to three times — **FIXED (Option B)**
Measured before at 1440: 12 products, **25 product anchor tags**. `olive-oil` had **4
anchors across 3 sections**; honey, coffee, cordial, sourdough and beaufort had **3
anchors across 2 sections each**. Four `h3`s repeated (`Pantry`, `Drinks`, `Sourdough
loaf`, `Beaufort cheese`). Page height 5445px.

(Anchors outnumber sections because each card links its image and its title separately;
both figures are real, they just count different things.)

**Investigated — see [`M7-M8-PROPOSAL.md`](./M7-M8-PROPOSAL.md).** The "range in packs"
rail was **100% redundant**: all 6 of its products also appeared elsewhere.

- [x] The rail now carries four pantry/drinks provisions at full size (honey, coffee,
      cordial, chocolate); the shelf index carries only the five it does not.
- [x] Rail card width changed from `lg:w-[23.5%]` (sized for six) to
      `lg:w-[calc((100%-3*var(--space-md))/4)]`, so four cards fit edge to edge.
- [x] Rewrote the index lede, which hardcoded "Nine provisions here".

**Verified:** each product now has exactly one card home. Anchor tags **25 → 17**; the
worst repeat is 2 (olive oil: hero ticket + index card, as designed). No product lost —
all 12 still reachable. Rail fills its track with **0px trailing space** at 1440 and
1024; on mobile it still scrolls (706px) and the controls disable at each end. Page
height 5445 → 5189px. No empty shelf columns.

### M8 — No search affordance — **DEFERRED (Option A)**
`searchControls: 0`. The header offers five browse links and no way to find a specific
provision.

**Re-assessed — see [`M7-M8-PROPOSAL.md`](./M7-M8-PROPOSAL.md).** At 12 SKUs across 2.6
screens, every product is reachable in ≤2 clicks and the homepage indexes all of them by
name. Search is not a usability gap at this size, and adding it now would cost a query
parameter, a catalogue filter, an empty state, and header space competing with Basket and
Menu.

- [x] Recorded the trigger in `DECISIONS.md`: add search at roughly **40 SKUs** or when
      `/shop` passes about **four screens** at 1440 (currently 2.6).
- [x] Recorded that when it is added, it belongs in the shop toolbar as `/shop?q=`, not
      in the header.

---

## Low

### L1 — Dead CSS and unused tokens — **FIXED**
Rules that had no consumer anywhere in `src/`:

- [x] Deleted `.display-s`, `.mesh`, `.float-slow` + its keyframes, `.enter-4`,
      `.btn--on-accent`.
- [x] Deleted `.chip` and its four rules — this became dead **because** M5 moved the
      price board to `.seg` radios, so it is new dead code created by that fix.
- [x] Deleted tokens `--color-paper-3`, `--color-grid`, `--color-grid-2`,
      `--color-success`, `--shadow-soft`, `--shadow-inset`, `--radius-xs`.
- [x] Removed the corresponding `.chip` selectors from the reduced-motion block.
- [x] Removed `--color-paper-3` from the DESIGN.md token table so docs match code.

**Kept on purpose:** `--text-display-s` and `--text-display-xl` are listed as "reserved"
in DESIGN.md §2.1, so deleting them would contradict a documented decision.

**Verified:** all six classes resolve to 0 elements in the DOM; removed colour and shadow
tokens compute to an empty string; `--shadow-lift` and `--text-display-*` still resolve;
footer surface and price-board shadow render unchanged; the wishlist heart still switches
to the accent colour on press; card radius (32px) and pill radius (999px) are intact.
Note: `--radius-xs` now falls through to Tailwind's own theme value (`.125rem`) rather
than being undefined — no rule referenced ours, so nothing changes visually.

### L2 — The `dark` flag was dead in every case — **FIXED**
`CATEGORY_META` and `SHOP_FACTS` carried `dark` on all seven entries, and **every value
was `false`**, so every `dark ? "text-paper" : …` ternary was unreachable.

- [x] Removed the `dark` field from both structures and collapsed the three ternaries to
      their static `text-ink` / `text-ink-2` outcomes.

**Verified:** hero and fact-tile backgrounds still compute to the shelf tints; heading
structure unchanged.

### L3 — Footer headings sized for styling, not hierarchy — **FIXED**
`Shop` and `Visiting` were `h2` elements set at 15px — group labels wearing a section
heading's tag, which put two unexpected `h2`s in the outline.

- [x] Changed both to `<p>` and named the containers instead: `aria-labelledby` on the
      footer `nav`, and on the `dl`.

**Verified:** footer now contributes **0 headings** to the outline; `nav` and `dl` both
resolve their labels ("Shop", "Visiting"); labels still compute 15px/600.

### L4 — Duplicate navigation landmarks — **NOT A DEFECT (no change)**
The claim was that two `navigation` landmarks ship at once. Measured at 767, 768, 1024
and 1440px:

| Width | "Main" | "Main, compact" |
| --- | --- | --- |
| 767 | `display:none` | `display:none` (behind Menu) |
| 768 | exposed | `display:none` |
| 1024 | exposed | `display:none` |
| 1440 | exposed | `display:none` |

At every width **exactly one** nav is in the accessibility tree, and where neither is
the visible `Menu` button (`aria-expanded=false`, `aria-controls="mobile-menu"`) unrolls
the compact nav. The two navs are mutually exclusive by CSS. Merging them into one
element would add disclosure machinery for no accessibility gain, so I left it alone
rather than churn working code.

### L5 — Under reduced motion the Pause control does nothing — **FIXED**
`prefers-reduced-motion` set `.marquee-track { animation: none }`, but the Pause/Play
button still rendered and still toggled `data-paused` with no visible effect.

- [x] Hidden under `@media (prefers-reduced-motion: reduce)` via `.marquee-control`.

**Verified:** with reduced motion emulated, the control computes `display: none` and the
track computes `animation-name: none`.

### Icons — inline SVG and unicode glyphs replaced with Phosphor — **DONE**
The audit's icon family was ad hoc: one hand-written heart path, plus unicode `←`, `→`,
`−` and `+` as control glyphs. Those render differently per font and cannot be themed.

- [x] Installed `@phosphor-icons/react@2.1.10` (latest).
- [x] Heart → `HeartIcon`, `weight="fill"` when saved, `regular` when not.
- [x] Banner arrows → `ArrowLeftIcon` / `ArrowRightIcon` at 20px.
- [x] Quantity steppers → `MinusIcon` / `PlusIcon` at 16px.
- [x] Every icon is `aria-hidden="true"`; each control keeps its own `aria-label`.

**Verified:** 0 unicode arrows left in visible text; the heart swaps outline→fill on
toggle; basket steppers contain SVGs with empty text (so `aria-label` is the only
accessible name, as intended).

Release notes that mattered: **2.1.8** renamed every icon to a `*Icon` suffix (old
names deprecated) and cut bundle size ~20%; **2.1.10** added an `/ssr` export and
restored explicit `"type": "module"`. Peer deps are `react >= 16.8`, so React 19 is
supported; all usage here is inside existing Client Components.

---

## Suggested order

Incremental, one fix verified before the next:

1. ~~**H1** — control heights~~ **done**
2. ~~**H2** — carousel bounds~~ **done**
3. ~~**H3** — nav active state~~ **done**
4. ~~**H4** — type contract~~ **done**
5. ~~**M1**, **M2**, **M5**, **L5** — ticker and control semantics~~ **done**
6. ~~**M3**, **M4** — screen-reader and keyboard behaviour~~ **done**
7. ~~**M6** — image payload~~ **done**
8. ~~**L1**, **L2**, **L3** — dead code cleanup~~ **done** (L4 closed as not-a-defect)
9. ~~**M7** — one merchandising home per product~~ **done (Option B)**
10. ~~**M8** — search~~ **deferred with a written trigger in DECISIONS.md**

Re-run after each step:

```
npm run check:ui     # overflow + h1 + broken images across 5 routes × 2 viewports
npm run smoke
npm run build        # confirms the homepage is still statically prerendered
```

---

## Appendix — findings discovered while fixing

These were not in the original pass; they surfaced from measurement during the work.

**A1 — `aria-prohibited-attr` on the banner slide wrapper (fixed).** A bare `<div>`
carried `aria-label` + `aria-roledescription`, which is invalid without a role. axe
flagged it as `serious` once the tag filter was removed. The attributes were redundant
because a live region already announces "Slide *n* of *m*: *title*", so both were
dropped rather than papering over it with a role.

**A2 — `<Suspense fallback={null}>` would have dropped the nav from the server HTML
(fixed before shipping).** Reading `useSearchParams` forces the boundary to render on
the client under `cacheComponents`. With a `null` fallback the nav links disappeared
from the SSR output on filtered routes and popped in after hydration. The fallback now
renders the same list unhighlighted, so the header is complete on first paint.

**A3 — tooling note.** The dev server's Tailwind `@layer components` output does not
always rebuild on save even though JSX does; a stale `.chip` rule survived several
reloads. Restarting the dev server picked it up. If a CSS change appears to be ignored,
restart before debugging the rule.
