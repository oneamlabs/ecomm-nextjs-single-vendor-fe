import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { ComboPromo } from "@/components/product/combo-promo";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductHighlights } from "@/components/product/product-highlights";
import { ProductTabs } from "@/components/product/product-tabs";
import { RelatedProducts } from "@/components/product/related-products";
import { ReviewsSection } from "@/components/product/reviews-section";
import { SellerBenefits, SellerCard } from "@/components/product/seller-card";
import { isMissingResource, serverApi } from "@/lib/api";
import { getPhoto } from "@/lib/photos";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  // Ids only, one maximum-page call: this runs at build time to prerender.
  const { items } = await serverApi.listProducts({ pageSize: 48 });
  return items.map((product) => ({ id: product.id }));
}

/**
 * Each product is prerendered from local JSON at build time, so the route
 * blocks for microseconds rather than streaming. Opting out of
 * instant-navigation validation makes that explicit.
 */
export const instant = false;

const CONTEXT_PHOTOS: Record<string, { alt: string; label: string }> = {
  "market-stall": {
    alt: "A sunlit market stall under green canopies, with crates of produce",
    label: "At the market",
  },
  "apples-crate": {
    alt: "A crate of freshly harvested apples",
    label: "From the farm",
  },
  "olives-harvest": {
    alt: "Hands sorting a harvest of small dark olives",
    label: "At harvest",
  },
  "sourdough-starter": {
    alt: "A bubbling sourdough starter in a glass jar",
    label: "In the kitchen",
  },
};

export async function generateMetadata(props: PageProps<"/shop/[id]">): Promise<Metadata> {
  const { id } = await props.params;

  // Only "missing" becomes a 404 for crawlers. Any other failure must surface
  // as an error rather than silently claiming the product does not exist.
  const bundle = await serverApi.getProductDetail(id).catch((error: unknown) => {
    if (isMissingResource(error)) return undefined;
    throw error;
  });
  if (!bundle) return { title: "Item not found - Kraya" };

  const { product } = bundle;
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

  // `notFound()` works by throwing, so it must not run inside this handler.
  // The handler only answers "missing?" and rethrows everything else, which
  // climbs to the error boundary instead of becoming a 404.
  const bundle = await serverApi.getProductDetail(id).catch((error: unknown) => {
    if (isMissingResource(error)) return undefined;
    throw error;
  });

  if (!bundle) notFound();

  const { product, detail, reviews, category, vendor, related } = bundle;
  const photo = getPhoto(product.photo);

  const contextKeys = ["market-stall", "apples-crate", "olives-harvest"].filter(
    (key) => key !== product.photo,
  );
  const gallery = [
    {
      key: product.photo,
      alt: product.photoAlt,
      label: product.name,
    },
    ...contextKeys.slice(0, 3).map((key) => ({
      key,
      alt: CONTEXT_PHOTOS[key]?.alt ?? "",
      label: CONTEXT_PHOTOS[key]?.label ?? "In context",
    })),
  ];

  const prices = product.variants.map((variant) => variant.priceCents / 100);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: detail.longDescription,
        image: `${SITE_URL}${photo.src}`,
        sku: product.id,
        category: category?.name,
        brand: { "@type": "Brand", name: SITE_NAME },
        additionalProperty: product.organic
          ? [{ "@type": "PropertyValue", name: "Organic", value: "true" }]
          : undefined,
        aggregateRating:
          product.rating !== undefined && product.reviewCount !== undefined
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount,
              }
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
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: category?.name ?? "All Products",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="container pb-[var(--section-gap)] pt-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
            <li>
              <Link href="/" className="transition hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <CaretRightIcon size={11} weight="bold" />
            </li>
            {category && (
              <>
                <li>
                  <Link
                    href={`/shop?category=${category.id}`}
                    className="transition hover:text-accent"
                  >
                    {category.name}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <CaretRightIcon size={11} weight="bold" />
                </li>
              </>
            )}
            <li aria-current="page" className="font-medium text-ink-2">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-4 grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_minmax(0,0.75fr)]">
          <div className="min-w-0">
            <ProductGallery images={gallery} />
          </div>

          <div className="min-w-0">
            <ProductBuyBox product={product} detail={detail} />
          </div>

          <div className="flex flex-col gap-4 lg:col-span-2 lg:flex-row xl:col-span-1 xl:flex-col">
            {vendor && (
              <div className="flex-1 space-y-4">
                <SellerCard vendor={vendor} />
                <SellerBenefits />
              </div>
            )}
            <div className="lg:w-80 xl:w-auto">
              <ComboPromo />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ProductHighlights highlights={detail.highlights} />
        </div>

        <div className="mt-6">
          <ProductTabs
            product={product}
            detail={detail}
            vendor={vendor}
            reviews={reviews}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <ReviewsSection
            productName={product.name}
            rating={product.rating ?? 0}
            reviewCount={product.reviewCount ?? 0}
            reviews={reviews}
          />
          <RelatedProducts products={related} />
        </div>
      </div>
    </>
  );
}
