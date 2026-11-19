import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { FactsTicker } from "@/components/market/facts-ticker";
import { HighlightBanner } from "@/components/market/highlight-banner";
import { PriceBoard } from "@/components/market/price-board";
import { CompactProductCard } from "@/components/product/compact-product-card";
import { ProductCard } from "@/components/product/product-card";
import { ProductPhoto } from "@/components/product/product-photo";
import { Carousel } from "@/components/ui/carousel";
import { getCategories, getPhoto, getProduct, getProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/money";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Product } from "@/lib/types";

const HOME_PRODUCTS = [
  "olive-oil",
  "wildflower-honey",
  "medium-roast-coffee",
  "lemon-cordial",
  "sourdough-loaf",
  "beaufort-cheese",
];

const CATEGORY_META: Record<string, { photo: string; alt: string; tone: string; dark: boolean }> = {
  pantry: {
    photo: "cacao-pod",
    alt: "A yellow cacao pod hanging from a tree trunk",
    tone: "shelf-pantry",
    dark: false,
  },
  drinks: {
    photo: "coffee-roasted",
    alt: "Roasted coffee beans spread across a dark surface",
    tone: "shelf-drinks",
    dark: false,
  },
  fresh: {
    photo: "sourdough-loaf",
    alt: "A round sourdough loaf with a scored crust",
    tone: "shelf-fresh",
    dark: false,
  },
};

const SHOP_FACTS = [
  {
    title: "Weighing",
    line: "Weighed and labelled here.",
    tone: "shelf-pantry",
    dark: false,
  },
  {
    title: "Cut-off",
    line: "Same day before 11:00, within eight miles.",
    tone: "shelf-drinks",
    dark: false,
  },
  {
    title: "Delivery",
    line: "£3.50 under £40.",
    tone: "shelf-fresh",
    dark: false,
  },
  {
    title: "Returns",
    line: "Replaced if it arrives wrong.",
    tone: "bg-paper-2",
    dark: false,
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

function lowestPrice(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.priceCents));
}

export default function HomePage() {
  const featured = HOME_PRODUCTS.map(getProduct).filter((product) => product !== undefined);
  const oliveOil = getProduct("olive-oil")!;
  const categories = getCategories();
  const shelves = categories.map((category) => ({
    category,
    products: getProducts({ categoryId: category.id }),
  }));
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
        <SectionHeader title="Three shelves, one price list" lede="Sorted by shelf." />

        <div className="mt-8">
          <Carousel label="Three shelves" controlsClassName="lg:hidden">
            {categories.map((category) => {
              const meta = CATEGORY_META[category.id];
              const count = getProducts({ categoryId: category.id }).length;
              const dark = meta?.dark ?? false;

              return (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.id}`}
                  className={`group lift flex w-[82%] flex-col overflow-hidden rounded-[var(--radius-lg)] sm:w-[52%] lg:w-[31.5%] ${
                    meta?.tone ?? "bg-paper-2"
                  } ${dark ? "text-paper" : "text-ink"}`}
                >
                  {meta && (
                    <ProductPhoto
                      photoKey={meta.photo}
                      alt={meta.alt}
                      sizes="(min-width: 64rem) 38vw, 82vw"
                      className="aspect-[16/9] rounded-none shadow-none"
                    />
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[length:var(--text-title)] font-bold">{category.name}</h3>
                      <span
                        className={`num text-sm font-semibold ${
                          dark ? "text-paper" : "text-ink-2"
                        }`}
                      >
                        {count} {count === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <p
                      className={`mt-2 max-w-[34ch] text-sm ${dark ? "text-paper" : "text-ink-2"}`}
                    >
                      {category.summary}
                    </p>
                    <span className="mt-auto pt-5 text-sm font-semibold">
                      Browse {category.name.toLowerCase()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </Carousel>
        </div>
      </Section>

      <Section>
        <HighlightBanner slides={BANNER_SLIDES} />
      </Section>

      <Section>
        <SectionHeader title="The range in packs" />

        <div className="mt-8">
          <Carousel label="Featured provisions">
            {featured.map((product) => (
              <div key={product.id} className="w-[72%] sm:w-[42%] lg:w-[23.5%]">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      </Section>

      <Section id="weighed">
        <SectionHeader title="How it is weighed" />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {SHOP_FACTS.map((fact) => (
            <div
              key={fact.title}
              className={`rounded-[var(--radius-lg)] p-7 md:p-9 ${
                fact.tone
              } ${fact.dark ? "text-paper" : "text-ink"}`}
            >
              <h3 className="text-[length:var(--text-title)] font-bold">{fact.title}</h3>
              <p className={`mt-3 max-w-[40ch] ${fact.dark ? "text-paper" : "text-ink-2"}`}>
                {fact.line}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader title="From the fresh shelf" />

        <div className="mt-8 grid gap-4 md:grid-cols-12">
          {freshLead && (
            <Link
              href={`/shop/${freshLead.id}`}
              className="group lift flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-shelf-fresh text-ink md:col-span-6"
            >
              <ProductPhoto
                photoKey={freshLead.photo}
                alt={freshLead.photoAlt}
                sizes="(min-width: 64rem) 50vw, 100vw"
                className="aspect-[16/10] rounded-none shadow-none"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[length:var(--text-title)] font-bold">{freshLead.name}</h3>
                <p className="mt-1 text-sm">{freshLead.origin}</p>
                <p className="num mt-auto pt-4 text-sm font-semibold">
                  from {formatPrice(lowestPrice(freshLead))}
                </p>
              </div>
            </Link>
          )}

          {freshRest.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.id}`}
              className="group lift flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] bg-paper-2 md:col-span-3"
            >
              <ProductPhoto
                photoKey={product.photo}
                alt={product.photoAlt}
                sizes="(min-width: 64rem) 24vw, 100vw"
                className="aspect-square rounded-none shadow-none"
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-body text-lg font-bold">{product.name}</h3>
                <p className="mt-1 text-sm text-muted">{product.origin}</p>
                <p className="num mt-auto pt-4 text-sm font-semibold">
                  from {formatPrice(lowestPrice(product))}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          title="The pantry and drinks shelves"
          lede="Nine provisions here; the fresh counter is just above."
        />

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {shelves
            .filter(({ category }) => category.id !== "fresh")
            .map(({ category, products }) => (
            <section key={category.id} aria-labelledby={`shelf-${category.id}`} className="min-w-0">
              <div className="flex items-baseline justify-between gap-3 border-b border-rule pb-3">
                <h3 id={`shelf-${category.id}`} className="text-[length:var(--text-title)] font-bold">
                  {category.name}
                </h3>
                <Link
                  href={`/shop?category=${category.id}`}
                  aria-label={`Browse ${category.name.toLowerCase()}`}
                  className="link-quiet inline-flex min-h-11 items-center text-sm font-semibold"
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
          ))}
        </div>
      </Section>
    </>
  );
}
