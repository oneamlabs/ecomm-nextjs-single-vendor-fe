import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGallery } from "@/components/product/product-gallery";
import { Rating } from "@/components/product/rating";
import { VariantPicker } from "@/components/product/variant-picker";
import {
  getCategory,
  getPhoto,
  getProduct,
  getProducts,
  getVendor,
} from "@/lib/catalogue";
import { dietLabel } from "@/lib/diets";
import { formatPrice } from "@/lib/money";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return getProducts().map((product) => ({ id: product.id }));
}

/**
 * Each product is prerendered from local JSON at build time, so the route
 * blocks for microseconds rather than streaming. Opting out of
 * instant-navigation validation makes that explicit.
 */
export const instant = false;

export async function generateMetadata(props: PageProps<"/shop/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const product = getProduct(id);
  if (!product) return { title: "Item not found - Kraya" };

  const photo = getPhoto(product.photo);

  return {
    title: `${product.name} - Kraya`,
    description: product.summary,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name} - Kraya`,
      description: product.summary,
      url: `/shop/${product.id}`,
      images: [
        {
          url: photo.src,
          width: photo.width,
          height: photo.height,
          alt: product.photoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - Kraya`,
      description: product.summary,
      images: [photo.src],
    },
  };
}

export default async function ProductPage(props: PageProps<"/shop/[id]">) {
  const { id } = await props.params;
  const product = getProduct(id);
  if (!product) notFound();

  const category = getCategory(product.categoryId);
  const vendor = getVendor(product.vendorId);
  const related = getProducts({ categoryId: product.categoryId })
    .filter((item) => item.id !== product.id)
    .slice(0, 3);
  const photo = getPhoto(product.photo);
  const gallery = [
    { key: product.photo, alt: product.photoAlt, label: product.name },
    product.photo === "coffee-roasted"
      ? {
          key: "coffee-cooling",
          alt: "Roasted coffee beans cooling after roasting",
          label: "After roasting",
        }
      : product.photo === "sourdough-loaf"
        ? {
            key: "sourdough-starter",
            alt: "A sourdough starter in a jar",
            label: "The starter",
          }
        : {
            key: "market-stall",
            alt: "A sunlit market stall under green canopies, with crates of produce",
            label: "In context",
          },
  ];
  const prices = product.variants.map((variant) => variant.priceCents / 100);
  const labels = uniqueLabels([
    ...(product.organic ? ["Organic"] : []),
    ...product.tags.map(tagLabel),
    ...(product.diets ?? []).map(dietLabel),
  ]);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.summary,
        image: `${SITE_URL}${photo.src}`,
        sku: product.id,
        category: category?.name,
        brand: { "@type": "Brand", name: SITE_NAME },
        additionalProperty: product.organic
          ? [{ "@type": "PropertyValue", name: "Organic", value: "true" }]
          : undefined,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice: Math.min(...prices).toFixed(0),
          highPrice: Math.max(...prices).toFixed(0),
          offerCount: product.variants.length,
          availability: product.variants.some((variant) => variant.inStock)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/shop/${product.id}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Shop",
            item: `${SITE_URL}/shop`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category?.name ?? "Range",
            item: `${SITE_URL}/shop?category=${product.categoryId}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${SITE_URL}/shop/${product.id}`,
          },
        ],
      },
    ],
  };

  return (
    <PageShell className="pb-[var(--section-gap)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/shop" className="link-quiet inline-flex min-h-6 items-center">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href={`/shop?category=${product.categoryId}`}
              className="link-quiet inline-flex min-h-6 items-center"
            >
              {category?.name ?? "Range"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-2">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={gallery} />
        </div>

        <div className="min-w-0">
          {category && <p className="tag">{category.name}</p>}
          <p className="mt-3 text-sm text-muted">{product.origin}</p>
          <h1 className="mt-2 text-[length:var(--text-page-title)]">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
            {vendor && (
              <Link
                href={`/shop?vendor=${vendor.id}`}
                className="link-quiet text-xs font-semibold text-accent"
              >
                Sold by {vendor.name}
              </Link>
            )}
          </div>
          <p className="lead mt-4 max-w-[44ch] text-ink-2">{product.summary}</p>
          <p className="mt-3 text-sm text-muted">{labels.join(" · ")}</p>

          <VariantPicker product={product} />
        </div>
      </div>

      <section className="mt-[var(--section-gap-s)]">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="panel-quiet p-6 md:col-span-5">
            <h2 className="text-sm font-semibold text-ink">The provision</h2>
            <p className="mt-3 text-[length:var(--text-lead)] leading-snug text-ink">
              {product.summary}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <dt className="text-muted">Origin</dt>
                <dd className="mt-0.5">{product.origin}</dd>
              </div>
              <div>
                <dt className="text-muted">Shelf</dt>
                <dd className="mt-0.5">{category?.name}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Suitable for</dt>
                <dd className="mt-0.5">{labels.join(" · ")}</dd>
              </div>
            </dl>
          </div>

          <div className="panel-quiet p-6 md:col-span-3">
            <h2 className="text-sm font-semibold text-ink">Packs</h2>
            <ul className="mt-3 divide-y divide-rule-2 text-sm">
              {product.variants.map((variant) => (
                <li key={variant.id} className="flex justify-between gap-4 py-2 first:pt-0">
                  <span>{variant.label}</span>
                  <span className="num shrink-0">
                    {variant.inStock ? formatPrice(variant.priceCents) : "Sold out"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-quiet p-6 md:col-span-4">
            <h2 className="text-sm font-semibold text-ink">Delivery and returns</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
              <li>Free delivery over ₹999; ₹49 under ₹999.</li>
              <li>Delivered in 3 to 5 days across India.</li>
              <li>Replaced if it arrives wrong.</li>
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-[var(--section-gap)]">
          <h2 className="text-[length:var(--text-section-s)]">Also on this shelf</h2>
          <div className="mt-8">
            <ProductGrid products={related} compact />
          </div>
        </section>
      )}
    </PageShell>
  );
}

function tagLabel(tag: string) {
  return dietLabel(tag);
}

function uniqueLabels(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = value.toLowerCase().replace(/[^a-z]/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
