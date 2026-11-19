# Design tracking

Living record of the storefront's visual system: where each decision came from, what is
built, and what is deliberately not built. Update this when a pattern is added or removed.

Last updated: OrganicKart marketplace homepage pass (full structure, Kraya brand).

---

## 1. References

| # | Reference | What it gave | Where it landed |
| --- | --- | --- | --- |
| 1 | Mitti (`localhost:3001`, sibling project) | Image-led density, card surfaces, tight radii, trust band, section actions | Applied broadly |
| 2 | Internal audit and product work | Accessibility and contract fixes (44px controls, contrast, one live region) | Applied |
| 3 | OrganicKart (multi-vendor Indian marketplace) | Search header, category bar, hero, circular category strip, trust band, vendors, trending tabs, farmer banner, diet grid, why-choose, newsletter, footer | Applied as the homepage structure |

The brand stays **Kraya**. The OrganicKart name is not used anywhere.

### What changed from the previous pass

The previous pass adopted only the full-bleed hero and the circular quick-jump strip,
because the catalogue was a single-vendor shop with three categories and no vendor,
rating or discount data. That constraint was removed: the catalogue is now a multi-vendor
demo with four vendors, nine categories, ratings, review counts and sample MRP discounts.
The reference structure is therefore applied in full.

---

## 2. Applied from reference 3

- **Two-band header.** Search, deliver-to, account, wishlist and cart in the sticky top bar;
  All Categories, category links and Become a Seller in the second bar.
- **Cream hero.** Eyebrow, "Organic & Naturally Good", three proof points, two CTAs,
  three dots and a photo with an organic seal.
- **Circular category strip.** Nine categories plus New Arrivals, each using a local photo.
- **Trust band.** Four service signals on a pale green band.
- **Featured Vendors.** Four cards with banner, overlapping logo, location, rating and
  store link.
- **Trending Organic Products.** Five tabs and six product cards with discount badges,
  hearts, star ratings, MRP strikethroughs and Add to Cart.
- **Support Local Organic Farmers.** Dark green copy, a photograph and three benefits.
- **Shop by Diet & Lifestyle.** Seven icon tiles linked to `/shop?diet=`.
- **Why Choose Kraya.** Four outlined icon columns.
- **Newsletter.** Inset pale green band with an honest demo status.
- **Dark green five-column footer.**

### Adaptations, not copies

| Reference element | Kraya implementation |
| --- | --- |
| Product packshots | Local library photographs; the imagery is illustrative, not a packshot |
| OrganicKart brand | Kraya leaf mark and wordmark |
| Indian marketplace copy | Kept where it is structural (Pan-India Delivery, INR); brand copy stays Kraya |
| Vendor names | Four sample vendors in the data, not invented live sellers |
| Ratings and MRP | Sample values stored in the catalogue and labelled as demo data |

---

## 3. Current homepage order

1. Sticky search header
2. Category bar (desktop) and mobile menu
3. Cream hero with proof points and photo
4. Circular category strip
5. Pale green trust band
6. Featured Vendors
7. Trending Organic Products with tabs
8. Support Local Organic Farmers
9. Shop by Diet & Lifestyle
10. Why Choose Kraya
11. Newsletter
12. Flat dark green footer

### Catalogue page order

1. Catalogue hero with range title, proof points and a produce photograph
2. Breadcrumb, page title, sort and grid/list toggle
3. Category chip row (eight ranges)
4. Sidebar: categories, price range, discount, vendor, dietary preference,
   certification, availability, Clear All Filters
5. Results: count, product grid or list, pagination
6. Newsletter
7. Footer

The catalogue card carries the default pack size and the vendor in addition to the shared
card anatomy. Twelve products show per page. The first row follows the curated catalogue
order so the trending six lead the page.

---

## 4. Design tokens in force

**Colour** — cream and white ground, one deep green action colour, pale green bands, amber
stars, one dark forest footer. No second action colour.

**Radius** — tight. 8px controls and chrome, 12px cards and image wells, 16px panels and
feature banners, pills only for tags.

**Surface** — white product cards with one hairline. No card inside a card.

**Type** — Fraunces display, DM Sans body. Body 16, meta 14, card title 16, section 24-32,
page title 32-36, hero 40-60.

**Chrome** — flat full-bleed bands, squared controls, 2px green underline for the current
nav item.

---

## 5. Verification each pass

```
npm run check:data
npm run lint
npm run typecheck
npm run build
npm run check:ui
npm run smoke
```

Measured at 1440 and 390: no horizontal overflow, no broken images, h1 at 60px desktop and
40px phone on the home, and 33px desktop / 28px phone on content pages.

---

## 6. Standing rules

- The homepage follows the OrganicKart section order; the brand stays Kraya.
- Card surfaces are flat: one white surface and one hairline.
- Text over photography needs measurement, not an eyeball. Aim for 4.5:1 on small text.
- Ratings, review counts, vendors and MRP are sample demo data; do not present them as live.
- One action colour: deep green. Shelf tints are surfaces, not actions.
- Reduced motion is honoured: no autoplay.
- Chrome is a frame, not an object: flat, full-bleed, squared.
- Every product card keeps the same anatomy: badge, heart, title, rating, price/MRP,
  Add to Cart.
