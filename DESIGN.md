# Design: Kraya

Kraya is a multi-vendor organic marketplace. The visual idea is a trusted greenmarket:
cream paper, white product surfaces, real photography, one deep-green action colour, and
ratings and pack prices that read at a glance. The catalogue is the design.

## 1. Tokens

Colour and type live in `src/app/tokens.css`. Components read tokens; no literal colours.

| Token | Role |
| --- | --- |
| `--color-paper` | white card surface |
| `--color-paper-2` | quiet panels and image wells |
| `--color-cream` | warm hero ground |
| `--color-ink` | near-black green for type |
| `--color-ink-2` | secondary type |
| `--color-muted` | metadata and captions |
| `--color-accent` | deep green; the only action colour |
| `--color-accent-soft` | pale green bands and chips |
| `--color-forest` | footer and dark feature panels |
| `--color-forest-2` | darker green |
| `--color-star` | rating stars |
| `--color-sale` | saved-heart state |
| `--color-rule` | hairlines |

Contrast: ink on paper 16.8:1, ink-2 on paper 10.2:1, muted on paper 5.8:1, white on
accent 5.4:1, ink on accent-soft 15.2:1.

## 2. Type

### 2.1 The scale

This is a storefront scale, not a mobile OS scale. Card and body copy stay in the readable
body face; the serif display voice belongs to the home and to section headings.

| Token | 1440 | 390 | Role | Where |
| --- | --- | --- | --- | --- |
| `--text-xs` | 12 | 12 | micro | counts, badges, captions |
| `--text-sm` | 14 | 14 | meta and controls | labels, buttons, nav, card meta |
| `--text-md` | 16 | 16 | body | running copy, cards, details |
| `--text-lead` | 17 | 16 | intro | page lede, product summary |
| `--text-title` | 16 | 16 | card title | product cards, compact rows |
| `--text-section-s` | 18-20 | 18 | content section | PDP related rail, inner sections |
| `--text-page-title` | 32-36 | 28 | page title | shop, product, cart, checkout, vendors |
| `--text-price` | 18-20 | 18 | price | PDP selected price |
| `--text-section` | 24-32 | 24 | home section | home section headings |
| `--text-display` | 40-60 | 40 | home hero | the home h1 only |

### 2.2 Rules

1. One `h1` per page. Content pages use `--text-page-title`; the home uses `--text-display`.
2. Content section headings use `--text-section-s`. Only the home uses `--text-section`.
3. Body is 16. Metadata and controls are 14. No running text below 14; 12 is only for
   numeric counts, badges and captions.
4. Product card titles are 16 and clamp to two lines. Prices are 16 bold with a 12px
   strikethrough MRP.
5. Syne was removed. Fraunces is display only: the home h1/h2 and section headings. DM Sans
   carries body, controls, prices and figures.
6. Display tracking applies only to display sizes. Functional headings use normal tracking.
7. Line height: display 1.02-1.08, headings 1.2-1.3, body 1.55.
8. Measure: 44-70 characters; the PDP summary is capped at 44ch.
9. Accessibility: WCAG 1.4.4 at 200% zoom, 1.4.12 text spacing, 4.5:1 text contrast, 44px
   controls. No tracked-capital labels except the home eyebrow.
10. Every size above comes from a token. If a new role is needed, add a token and a row
    here first.

## 3. Geometry

- 8px controls and chrome. 12px cards and image wells. 16px panels and feature banners.
- Cards are flat: white surface, one hairline, no nested cards.
- Product photography sits on a quiet paper-2 well with a tight radius.
- Pills are for tags and badges, not for chrome controls.

## 4. Shells

- `PageShell`: one container, one top and bottom rhythm.
- `PageHeader`: page title at `--text-page-title`, one lede, optional actions.
- `Section` and `SectionHeader`: home rhythm and section heading at `--text-section`.
- The header is two flat bands: a sticky search bar and a category bar. On small screens the
  category bar hides and the mobile menu carries the links and categories.
- Header and footer are **flat, full-bleed bands**: background runs edge to edge, no radius,
  no shadow, content inside the shared container.
- Chrome controls are squared (`--radius-sm`). Nav uses a 2px green underline for the current
  page, pinned to the bar's bottom edge.

## 5. Pages

### Home
The reference-led marketplace order:

1. Sticky header: logo, search, deliver-to, account, wishlist, cart; then All Categories,
   category links and Become a Seller.
2. Cream hero: eyebrow, "Organic & Naturally Good", proof points, two CTAs, three dots,
   photo with an organic seal.
3. Circular category strip with nine categories plus New Arrivals.
4. Pale green trust band with four service signals.
5. Featured Vendors: four cards with banner, overlapping logo, location, rating and store
   link.
6. Trending Organic Products: section heading, five tabs, six product cards.
7. Support Local Organic Farmers: dark green copy, photo, three benefits.
8. Shop by Diet & Lifestyle: seven icon tiles linking to `/shop?diet=`.
9. Why Choose Kraya: four outlined icon columns.
10. Newsletter: inset pale green band with an honest demo status.
11. Flat dark green footer with five columns.

### Shop
A pale-green catalogue hero with the range title, proof points and a produce photograph;
then a breadcrumb, the page title, sort and a grid/list toggle, and an eight-item category
chip row. A white sidebar card carries category radios, a dual price range, discount
thresholds, vendor search and checkboxes, dietary preference, certification and
availability, with Clear All Filters. The results column shows the count, a four-up
product grid (two on small screens, three at lg), and pagination. Catalogue cards add the
default pack size and the vendor to the shared card anatomy. List view switches to a
horizontal row with the same actions.

### Product
A breadcrumb, then three columns at xl: a 4:5 gallery with vertical thumbnails, arrows and
dots; a buy box with badge, title, summary, rating and sold count, price/MRP/discount,
per-pack buttons, quantity, stock, Add to Cart and Buy Now; and a right column with the
seller card, delivery/returns/payment benefits and a combo promo. A five-item highlight
strip follows, then a tabbed card (Description, Nutrition Facts, Ingredients, How to Use,
Reviews, Seller Info) with the long description and four feature notes beside a photograph.
Customer Reviews sits beside You May Also Like, with the rating summary, breakdown bars,
sample reviews, a review form and a paged two-card related view.

### Cart
A breadcrumb, then a cart glyph beside the page title, the total item count and a Continue
Shopping button. The line card is one white surface: a selection checkbox, a square photo,
the name with its badge taken from the catalogue, the vendor, the pack with its unit rate,
price, strikethrough MRP and discount tag, and the line total. Quantity stepper, Save for
Later and Remove sit on a second row. The card footer holds Select All and Remove Selected.
The right column is the Order Summary: item total, item discount, subtotal, delivery with a
free-delivery note, the total, a collapsible Apply Coupon field that honestly rejects demo
codes, Proceed to Checkout and a three-item trust strip. You May Also Like follows, then a
pale green assurance band.

### Vendors, sell, policies, checkout, saved, credits, account
Same shell and page title. Vendors lists the verified producers; sell explains the demo
application flow; policies states shipping, returns, privacy and terms; checkout validates
and states that no order is placed; saved uses the same card actions; credits lists
photograph authors and licences.

## 6. Motion

CSS-first, transform and opacity only, disabled under reduced motion: hero and card
entrance, heart and hover lift, tab transitions. No autoplay.

## 7. Imagery

Local photographs in `public/photos`, full colour inside tight frames. Every library
photograph is credited on `/credits`, linked from the footer. No invented or AI imagery.
The catalogue reuses the local library, so a product's photograph is illustrative rather
than a packshot of the exact SKU.

## 8. Content

Ratings, review counts and MRP are sample marketplace data, labelled as such in the README.
Prices, categories, vendors and packs come from JSON. No em dashes, no exclamation marks.
The checkout states that no order is placed.

## 9. Checks

`npm run build`, `npm run check:ui`, `npm run smoke`, axe and a 320px overflow pass. The
type rules in section 2 are review criteria, not suggestions.
