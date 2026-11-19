# Design tracking

Living record of the storefront's visual system: where each decision came from, what
is built, and what was deliberately rejected. Update this when a pattern is added or
removed; it is the single place that answers "why does it look like this".

Last updated: homepage restyle pass (3rd reference, full-bleed hero).

---

## 1. References

Three outside designs informed this. None were copied wholesale — Kraya keeps its own
tokens, fonts, data model and content rules.

| # | Reference | What it gave | Where it landed |
| --- | --- | --- | --- |
| 1 | Mitti (`localhost:3001`, sibling project) | Image-led density: photo tiles, card surfaces, tight radii, trust band, section actions | Applied broadly |
| 2 | Internal audit + product work | Accessibility and contract fixes (44px controls, contrast, one live region) | Applied |
| 3 | OrganicKart (multi-vendor Indian marketplace) | Full-bleed photographic hero, circular quick-jump chip strip | Applied |

### Why reference 3 was adopted selectively

OrganicKart is a **multi-vendor marketplace selling 10 categories of packaged food with
ratings and MRP discounts**. Kraya is a **single-vendor weighed-goods shop with 3
categories and no ratings**. Most of OrganicKart's layout exists to express things
Kraya does not have, and building them would mean inventing data — which both
`DESIGN.md` §8 and `DECISIONS.md` forbid.

---

## 2. Applied from reference 3

- **Full-bleed photographic hero.** The split hero (copy left, photo right) became one
  full-width photo with the copy over a left-weighted scrim and the price board as the
  right column. Tighter to the fold and closer to the reference's scale.
- **Circular quick-jump strip.** A row of circular thumbnails directly under the
  ticker, one per shelf, plus an "Everything" chip. Photographs come from each shelf's
  own first product, so a chip cannot point at imagery the catalogue does not serve.

Measured: hero h1 **9.04:1**, hero lede **13.71:1**, hero eyebrow **12.26:1** over the
photograph. Chip labels are `ink-2` on paper (11:1).

---

## 3. Rejected from reference 3 — and why

| Pattern | Reason |
| --- | --- |
| Vendor store cards, "Become a Seller" | Single-vendor shop. No vendor entity exists. |
| Star ratings and review counts | No rating data in the catalogue. Inventing metrics is forbidden. |
| MRP strikethrough + `%` off badges | No MRP or discount concept. Every price is the real price. |
| Header search field | Deferred by decision (see `DECISIONS.md`), threshold recorded there. |
| "Shop by Diet & Lifestyle" icon grid | 3 diet tags exist, not 7, and tags are filters not destinations. |
| Newsletter capture | No backend to receive it; a form that silently drops input is worse than none. |
| Category chip strip with 10 chips | Only 3 shelves exist. Row is 4 chips including "Everything". |
| Mega-menu "All Categories" drawer | 3 categories do not need a drawer. |

**The line:** layout patterns transfer freely. Anything requiring vendor, rating,
discount or subscription data does not, because the data is absent rather than
merely unstyled.

---

## 4. Current homepage order

1. Delivery strip (accent, scrolls away)
2. Sticky header (flat, full-bleed)
3. **Full-bleed hero** — photo, scrim, h1, lede, two CTAs, price board
4. Facts ticker (pause control, hides under reduced motion)
5. **Quick-jump strip** (circular shelf thumbnails)
6. Trust band (4 service signals)
7. Three shelves — photo-led category tiles, first tile double-width
8. Highlights banner (manual, no autoplay)
9. The range in packs (rail, 4 featured)
10. How it is weighed (4 fact tiles)
11. From the fresh shelf (lead card + 2)
12. Pantry and drinks index (compact rows)
13. Footer (flat, full-bleed)

Verified one merchandising home per product (see `./M7-M8-PROPOSAL.md`).

---

## 5. Design tokens in force

**Radius** — deliberately tight. Large radii on photographs read as bubbles.

| Token | Value | Used for |
| --- | --- | --- |
| `--radius-sm` | 10px | Chrome controls, inner frames |
| `--radius-md` | 14px | Photo wells, compact frames |
| `--radius-lg` | 18px | Cards, panels, tiles |
| `--radius-pill` | 999px | Content buttons only, never chrome |

**Surface** — `.panel` (paper + shadow + hairline) and `.panel-quiet` (paper-2 +
hairline). One definition so a panel is recognisable on every route.

**Type** — Syne display, DM Sans body, IBM Plex Mono for figures. Floor of 15px for
running text; 13px only for numeric counts.

**Chrome** — flat full-bleed bands, squared controls, 2px accent underline for the
current nav item pinned to the bar's bottom edge.

---

## 6. Open gaps

| Item | Status |
| --- | --- |
| Shop grid density | **Resolved — see §6.1.** |
| "Featured vendors"-style block | Not applicable (single vendor). |
| Header search | Deferred with a written threshold. |
| Shop sidebar styling | Still the pre-restyle language; only the grid was carried over. |

### 6.1 Grid density experiment

Ran 4, 5 and 6 columns by editing the source (a runtime class swap does nothing —
Tailwind only emits classes it finds in a file). Measured card width, title lines,
clipping and button fit at 1024 / 1280 / 1440 / 1600.

| Columns | Card width @1440 | Result |
| --- | --- | --- |
| 4 (original) | 226px | Fine, but airier than the reference. |
| 5 | 187px | **Rejected.** 12 products leave 2 orphans in a third row, and at 1280 the cards drop to 155px. |
| 6 | 157px | **Adopted at `2xl` only.** 12 ÷ 6 = exactly two rows. |

Two real bugs surfaced while testing, both fixed:

- **`QuickAdd` had `flex-1` but its parent was not a flex container**, so the add
  button collapsed to content width and floated as a small blob with dead space
  beside it. The parent is now `flex`.
- The full label "Add to cart" forced a 108px button at 157px card width (69%). The
  compact card now reads **"Add"**, which brings it to 85% of the card. The accessible
  name is still `Add <product>, <pack> to basket`, so nothing is lost to a screen
  reader.

Final: `lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 2xl:gap-x-3`. At 1280 six
columns wrapped "from £13.00" onto two lines and left the row ragged, which is why it
is gated to `2xl` rather than `xl`.

---

## 7. Verification each pass

```
npm run typecheck
npm run lint          # currently clean: 0 warnings, 0 errors
npm run build         # / must stay statically prerendered
npm run check:ui      # 5 routes x 2 viewports, checks overflow + h1 + images
npm run smoke
```

Plus axe on every route (currently **0 violations**) and pixel-level contrast
measurement for any text sitting on photography. A screenshot pass alone is not
evidence — the earlier tile pass looked fine and measured 3.87:1.

---

## 8. Standing rules

- Every product has one card home on the homepage (`DECISIONS.md`).
- Text over photography needs measurement, not an eyeball. Aim for 4.5:1 on small text.
- No invented metrics, ratings, review counts or payment claims.
- One action colour: tomato. Shelf tints are surfaces, not actions.
- Reduced motion is honoured: no autoplay, ticker pauses, control hides.
- Chrome is a frame, not an object: flat, full-bleed, squared.
