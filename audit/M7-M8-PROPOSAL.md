# M7 and M8 — proposals

Both remaining audit items are information-architecture decisions, not bugs. This
document records the measurements, the options, and the outcome for each.

**Decisions taken: M7 = Option B (implemented). M8 = Option A, defer (implemented).**

Catalogue: **12 products**, all organic, 2 variants each.
`pantry` 5 · `drinks` 4 · `fresh` 3. Tags: `gluten-free` 11, `vegan` 10, `caffeine` 1.

---

## M7 — the same products are shown up to three times

### Measured

Homepage sections and the products each exposes:

| # | Section | Products | Links | Height |
| --- | --- | --- | --- | --- |
| 0 | Hero, price ticket | `olive-oil` | 1 | 565 |
| 2 | Three shelves | — (category cards) | 0 | 672 |
| 3 | Highlights banner | — (editorial) | 0 | 524 |
| 4 | **The range in packs** | olive-oil, wildflower-honey, medium-roast-coffee, lemon-cordial, sourdough-loaf, beaufort-cheese | 12 | 767 |
| 6 | From the fresh shelf | sourdough-loaf, beaufort-cheese, russet-apples | 3 | 768 |
| 7 | Pantry and drinks index | olive-oil, wildflower-honey, chilli-flakes, dark-chocolate, sloe-preserve, medium-roast-coffee, lemon-cordial, grape-verjus, lavender-tea | 9 | 926 |

Appearance counts: `olive-oil` **3×**; honey, coffee, cordial, sourdough, beaufort **2×**;
the remaining six **1×**.

### The decisive finding

**The "range in packs" rail is 100% redundant.** All six of its products already appear
in either the fresh shelf or the index:

```
railRedundantIds:   all 6
railUniqueIds:      none
unionWithoutRail:   12   (of 12 in the catalogue)
```

So every product stays reachable if the rail is removed, and three of its six cards
(sourdough, beaufort) duplicate the fresh shelf sitting two sections below.

### Options

**Option A — remove the rail (smallest change).**
Delete the "The range in packs" section.
- Page shortens by **767px** (~14%).
- `olive-oil` 3× → 2×; five others 2× → 1×.
- All 12 products still reachable.
- Cost: the homepage loses its only large-format product cards; the remaining product
  surfaces are the hero ticket and compact index rows.

**Option B — one home per product (recommended).**
Keep the rail as the large-card showcase, and make the index carry only what the rail
and the fresh shelf do not:
- Rail carries 4 pantry/drinks cards: honey, coffee, cordial, chocolate.
- Index carries the remaining 5 pantry/drinks rows: olive-oil, chilli-flakes,
  sloe-preserve, verjus, lavender-tea.
- Fresh keeps its own 3.
- Result: each product appears **exactly once**, except `olive-oil` which stays in the
  hero as the price-ticket subject.
- Page shortens by roughly 250-350px.
- Cost: needs a deliberate "featured" selection rather than "first six of the list",
  which is a content choice you should make.

**Option C — asymmetric sections (most editorial).**
Rail shows the three `fresh` items as large cards and the separate fresh section is
dropped; index keeps all nine pantry/drinks rows.
- Preserves large cards and reduces total sections.
- Cost: the fresh counter loses its distinct visual block, which DESIGN.md §5 names
  explicitly ("the fresh counter above is the only place the three fresh items appear in
  the index"). This contradicts a documented decision, so I do not recommend it.

### Recommendation

**Option B.** It keeps every product on the page exactly once, preserves the large-card
merchandising moment, and honours the documented rule that the fresh counter is the only
index home for fresh items. It needs you to name the four featured pantry/drinks items;
everything else is mechanical.

If you would rather not make a content call, **Option A** is safe and mechanical — it
removes nothing from reachability, only the duplicate large cards.

---

## M8 — no search affordance

### Measured

`searchControls: 0` on the homepage and every route. Navigation offers five links:
Shop, Drinks, Fresh, Vegan, Saved.

`/shop` measured at 1440×900: **12 product links**, **2338px tall = 2.6 screens**, with
no search field of any kind.

### Re-assessment

The original note leaned on Baymard's general finding that search beats browse for
product finding. That holds for large catalogues; it is weaker at this size. Measured
against the actual catalogue:

- **12 products**, all on `/shop` in one grid, 2.6 screens tall.
- Every product is reachable in **≤2 clicks** (nav → Shop → product), and most in 1 via
  the shelf filters.
- The homepage already indexes all 12 by name.

So search is not a usability gap *yet*. Adding one now means a query parameter, a filter
path in `catalogue.ts`, an empty state, and a header control competing for space with
basket and menu.

### Options

**Option A — defer, with a written trigger (recommended).**
Do not add search. Record the threshold in `DECISIONS.md`: add search when the catalogue
passes roughly **40 SKUs**, or when `/shop` exceeds about **four screens** at 1440
(currently 2.6). Cost: nothing now; the decision is explicit rather than accidental.

**Option B — add a `/shop?q=` filter now.**
- `getProducts({ query })` matching name, origin and summary.
- A search field in the shop toolbar (not the header) so it does not compete with basket
  and menu on mobile.
- Wire the existing `EmptyState` for no results and add a matching live-region message.
- Cost: roughly one component plus a catalogue filter; real but contained.

**Option C — header combobox.**
Type-ahead over product names opening the PDP directly.
- Best perceived speed, most work, and the highest risk of duplicating the shop grid's
  behaviour with a second, divergent code path.

### Recommendation

**Option A** for now, with the threshold written down. This is a deliberate reversal of my
earlier framing: the audit scored search from general e-commerce guidance, and the
measured catalogue does not support it yet. If you want it anyway, **Option B** is the
right shape — search belongs in the shop toolbar, not the header, at this size.

---

## What I need from you

1. **M7:** Option A (remove the rail) or Option B (pick four featured pantry/drinks
   items)? If B, name the four.
2. **M8:** defer with a written threshold, or implement the `/shop?q=` toolbar filter?
