import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { FactsTicker } from "@/components/market/facts-ticker";
import { HighlightBanner } from "@/components/market/highlight-banner";
import { PriceBoard } from "@/components/market/price-board";
import { CompactProductCard } from "@/components/product/compact-product-card";
import { FreshShelfCard } from "@/components/product/fresh-shelf-card";
import { ProductCard } from "@/components/product/product-card";
import { ProductPhoto } from "@/components/product/product-photo";
import { CategoryTile } from "@/components/shop/category-tile";
import { TrustBand } from "@/components/market/trust-band";
import { Carousel } from "@/components/ui/carousel";
import { getCategories, getPhoto, getProduct, getProducts } from "@/lib/catalogue";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * The large cards in "The range in packs". These four pantry and drinks
 * provisions appear at full size here; the shelf index below carries only the
 * ones this rail does not, so nothing is merchandised twice.
 */
const FEATURED_PRODUCTS = [
  "wildflower-honey",
  "medium-roast-coffee",
  "lemon-cordial",
  "dark-chocolate",
];

const SHOP_FACTS = [
  {
    title: "Weighing",
    line: "Weighed and labelled here.",
    tone: "shelf-pantry",
  },
  {
    title: "Cut-off",
    line: "Same day before 11:00, within eight miles.",
    tone: "shelf-drinks",
  },
  {
    title: "Delivery",
    line: "£3.50 under £40.",
    tone: "shelf-fresh",
  },
  {
    title: "Returns",
    line: "Replaced if it arrives wrong.",
    tone: "bg-paper-2",
  },
];

const STORE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/photos/market-stall.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Row Street",
    addressLocality: "Bristol",
    postalCode: "BS1 4QA",
    addressCountry: "GB",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
};

const BANNER_SLIDES = [
  {
    image: getPhoto("apples-crate").src,
    alt: "Green and red russet apples piled in a wooden crate",
    eyebrow: "Delivery",
    title: "Free delivery over £40.",
    body: "£3.50 under £40. Before 11:00, same day.",
    cta: "Shop the range",
    href: "/shop",
  },
  {
    image: getPhoto("lavender-field").src,
    alt: "Rows of flowering lavender running toward the horizon",
    eyebrow: "The shop",
    title: "Weighed here, packed here.",
    body: "Twelve organic provisions, packed by weight and priced by the pack.",
    cta: "Meet the range",
    href: "/shop",
  },
  {
    image: getPhoto("sourdough-loaf").src,
    alt: "Round sourdough loaf with a dark scored crust on a wooden board",
    eyebrow: "The fresh counter",
    title: "Bread, cheese and produce.",
    body: "From the fresh shelf, in the weights it comes in.",
    cta: "Shop fresh",
    href: "/shop?category=fresh",
  },
];

export default function HomePage() {
  const featured = FEATURED_PRODUCTS.map(getProduct).filter(
    (product) => product !== undefined,
  );
  const featuredIds = new Set(FEATURED_PRODUCTS);
  const oliveOil = getProduct("olive-oil")!;

  const shelves = getCategories().map((category) => {
    const allProducts = getProducts({ categoryId: category.id });

    // The index carries only what the featured rail does not already show, so no
    // product is merchandised twice. Olive oil stays here as well as in the hero
    // ticket, which is a price readout rather than a product card.
    return {
      category,
      allProducts,
      products: allProducts.filter((product) => !featuredIds.has(product.id)),
    };
  });
  const fresh = getProducts({ categoryId: "fresh" });
  const [freshLead, ...freshRest] = fresh;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_JSON_LD) }}
      />
      <section className="bg-shelf-pantry">
        <div className="container pb-10 pt-7 md:pt-9">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
            <div className="enter lg:col-span-6 lg:flex lg:flex-col lg:justify-center">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Bristol provisions, by weight.
              </p>
              <h1 className="mt-4 text-[length:var(--text-display)]">
                The price is the weight.
              </h1>
              <p className="lead mt-6 text-ink-2">
                Twelve organic provisions, weighed and labelled on Row Street.
              </p>
              <div className="mt-7">
                <Link href="/shop" className="btn btn--primary">
                  Shop the range
                </Link>
              </div>
            </div>

            <div className="enter enter-2 relative lg:col-span-6">
              <div className="enter enter-3 relative z-10 mt-2 lg:absolute lg:bottom-6 lg:left-6 lg:mt-0 lg:w-[300px] xl:w-[330px]">
                <PriceBoard product={oliveOil} />
              </div>
              <ProductPhoto
                photoKey="market-stall"
                alt="A sunlit market stall under green canopies, with crates of tomatoes, lemons and greens"
                sizes="(min-width: 64rem) 48vw, 100vw"
                priority
                className="aspect-[4/3] rounded-[var(--radius-lg)] lg:aspect-auto lg:h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <FactsTicker />

      <Section>
        <TrustBand />
      </Section>

      <Section>
        <SectionHeader
          title="Three shelves, one price list"
          lede="Sorted by shelf. Every one weighed and labelled here."
          action={{ href: "/shop", label: "Shop the range" }}
        />

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {shelves.map(({ category, allProducts }, index) => (
            <li
              key={category.id}
              className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <CategoryTile
                category={category}
                products={allProducts}
                size={index === 0 ? "large" : "small"}
              />
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <HighlightBanner slides={BANNER_SLIDES} />
      </Section>

      <Section>
        <SectionHeader title="The range in packs" />

        <div className="mt-8">
          <Carousel label="Featured provisions">
            {featured.map((product) => (
              <div
                key={product.id}
                className="w-[72%] sm:w-[42%] lg:w-[calc((100%-3*var(--space-md))/4)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      </Section>

      <Section id="weighed">
        <SectionHeader
          title="How it is weighed"
          lede="Four things that decide whether an order arrives right."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SHOP_FACTS.map((fact) => (
            <div
              key={fact.title}
              className={`rounded-[var(--radius-lg)] p-7 text-ink md:p-9 ${fact.tone}`}
            >
              <h3 className="text-[length:var(--text-title)] font-bold">{fact.title}</h3>
              <p className="mt-3 max-w-[40ch] text-ink-2">{fact.line}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="From the fresh shelf"
          action={{ href: "/shop?category=fresh", label: "Shop fresh" }}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          {freshLead && <FreshShelfCard product={freshLead} lead />}
          {freshRest.map((product) => (
            <FreshShelfCard key={product.id} product={product} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="The pantry and drinks shelves"
          lede="The rest of both shelves; four more are on the rail above."
        />

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {shelves.map(({ category, products }) => {
            if (category.id === "fresh") return null;
            if (products.length === 0) return null;

            return (
              <section
                key={category.id}
                aria-labelledby={`shelf-${category.id}`}
                className="min-w-0"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-rule pb-3">
                  <h3 id={`shelf-${category.id}`} className="text-[length:var(--text-title)] font-bold">
                    {category.name}
                  </h3>
                  <Link
                    href={`/shop?category=${category.id}`}
                    aria-label={`Browse ${category.name.toLowerCase()}`}
                    className="link-quiet inline-flex min-h-11 min-w-11 items-center justify-end text-sm font-semibold"
                  >
                    Browse
                  </Link>
                </div>
                <ul className="mt-1 divide-y divide-rule-2">
                  {products.map((product) => (
                    <li key={product.id}>
                      <CompactProductCard product={product} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </Section>
    </>
  );
}
