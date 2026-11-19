# Design: Kraya

Kraya is a single-vendor provisions shop. The visual idea is a market price sheet: real photographs, paper and ink, one tomato action colour, and a live pack price. The product data is the design.

## 1. Tokens

Colour and type live in `src/app/tokens.css`. Components read tokens; no literal colours.

| Token | Role |
| --- | --- |
| `--color-paper` | cool white page |
| `--color-paper-2` | quiet panels and footer |
| `--color-paper-3` | pressed and hovered surfaces |
| `--color-ink` | near-black navy for type |
| `--color-ink-2` | secondary type |
| `--color-muted` | metadata and captions |
| `--color-accent` | deeper tomato; the only action colour |
| `--color-shelf-pantry` | pale citrus field |
| `--color-shelf-drinks` | pale cobalt field |
| `--color-shelf-fresh` | pale tomato field |

Contrast: ink on paper 17.7:1, ink-2 on paper 11:1, muted on paper 6.4:1, white on accent 5.2:1, ink on the shelf tints 14.7-15.3:1.

## 2. Type

### 2.1 The scale

This is a storefront scale, not a mobile OS scale. Shopify's Dawn storefront sets h1 at 40, h2 at 24, h3 at 18 and body at 15; Baymard's product-page research puts hierarchy and readability ahead of oversized headings. Kraya keeps its Syne display voice for the home and uses the content scale everywhere else.

| Token | 1440 | 390 | Role | Where |
| --- | --- | --- | --- | --- |
| `--text-xs` | 13 | 13 | micro | counts and badges only, never running text |
| `--text-sm` | 15 | 15 | meta and controls | labels, pack prices, buttons, nav, captions |
| `--text-md` | 17 | 17 | body | running copy, cards, details |
| `--text-lead` | 20 | 18 | intro | page lede, product summary, PDP provision |
| `--text-title` | 24 | 20 | card title | product cards, compact group headings |
| `--text-section-s` | 24 | 20 | content section | PDP "Also on this shelf", inner-page sections |
| `--text-page-title` | 40 | 32 | page title | shop, product, basket, checkout, wishlist h1 |
| `--text-price` | 28 | 24 | selected price | PDP price; card "from" price is 20 with a 15 rate |
| `--text-section` | 59 | 36 | home section | home section headings only |
| `--text-display-s` | 68 | 40 | reserved | not used on content pages |
| `--text-display` | 92 | 48 | home hero | the home h1 only |
| `--text-display-xl` | 144 | 60 | reserved | not used |

The home highlight banner may use 36-60. The footer wordmark may use 40-72. Nothing else exceeds the scale.

### 2.2 Rules

1. One `h1` per page. Content pages use `--text-page-title` (40/32); the home uses `--text-display` (92/48).
2. Content section headings use `--text-section-s` (24/20). Only the home uses `--text-section` (59/36).
3. The PDP product title is 40/32, not a display size. The "Also on this shelf" heading is 24/20. The PDP price is 28/24.
4. Body is 17. Metadata and controls are 15. No running text below 15; 13 is only for numeric counts and badges.
5. Card titles use `--text-title` (24/20); compact shelf rows use 17.
6. Use role tokens, never arbitrary `text-3xl`, `text-4xl` or `text-[clamp(...)]` on content pages.
7. Syne is display only: home h1/h2, the wordmark and the facts ticker. DM Sans carries everything functional. IBM Plex Mono carries prices, rates, quantities and counts.
8. Display tracking applies only to display sizes. Functional headings use normal tracking.
9. Line height: display 0.98-1.1, headings 1.2-1.25, body 1.5, lead 1.4.
10. Measure: 44-70 characters; the PDP summary is capped at 44ch.
11. Accessibility: WCAG 1.4.4 at 200% zoom, 1.4.12 text spacing, 4.5:1 text contrast, 44px controls. No tracked-capital labels.
12. Every size above comes from a token. If a new role is needed, add a token and a row here first.

## 3. Geometry

- Pills for buttons, chips and tags.
- 32px for panels and image cards.
- 16px for inputs and inner photo frames.
- Cards are flat: a card contains a photo and text, never another card.
- Control boundaries use `--color-rule-strong`; decoration uses the hairline rule.

## 4. Shells

- `PageShell`: one container, one top and bottom rhythm.
- `PageHeader`: page title at `--text-page-title`, one lede, optional actions.
- `Section` and `SectionHeader`: home rhythm and section heading at `--text-section`.
- The delivery strip scrolls away; the header bar is sticky. On small screens the nav sits behind `Menu`; the shop filters sit behind `Filters`.

## 5. Pages

### Home
Banner strip, split photo-led hero with the live price ticket, facts ticker, three shelf cards, highlights banner, range rail, weighing tiles, fresh feature, and the pantry/drinks shelf index. The fresh counter above is the only place the three fresh items appear in the index. Cards use Add to cart and the heart.

### Shop
`PageHeader` at 40. A sticky sidebar: shelf radios with counts, diet checkboxes with counts (multi-select), and a short service note. The results toolbar carries the count, removable filter chips, Clear all and the sort select. The grid is four cards at xl, three at lg, two at sm. Cards show the shelf label, heart, origin, full title, from-price, unit price, full pack list and diet line.

### Product
A gallery with a 4:5 main image, vertical thumbnails, a counter and per-image credit; a buy box with pack buttons, price, unit rate, stock, quantity, Add to basket, heart and delivery; a full-width provision sheet (provision, packs, delivery/returns); related products in the compact card.

### Basket, checkout, saved, credits
Same shell and page title. Basket lines carry the pack and rate; checkout validates and states that no order is placed; saved uses the same card actions; credits lists photograph authors and licences.

## 6. Motion

CSS-first, transform and opacity only, disabled under reduced motion: hero entrance, price figure on change, facts ticker with Pause/Play, manual highlights banner, scroll-snap carousels, hover lift. No autoplay.

## 7. Imagery

Local photographs in `public/photos`, full colour inside rounded frames. Every library photograph is credited on `/credits`, linked from the footer. No invented or AI imagery.

## 8. Content

No invented metrics, reviews or customer counts. Prices, counts and packs come from the JSON. No em dashes, no exclamation marks. The checkout states that no order is placed.

## 9. Checks

`npm run build`, `npm run check:ui`, axe and a 320px overflow pass. The type rules in section 2 are review criteria, not suggestions.
