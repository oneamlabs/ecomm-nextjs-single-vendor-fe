import type { Metadata } from "next";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Newsletter } from "@/components/home/newsletter";
import { CatalogueBrowser } from "@/components/shop/catalogue-browser";
import { CatalogueHero } from "@/components/shop/catalogue-hero";
import { CataloguePagination } from "@/components/shop/catalogue-pagination";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import {
  CERTIFICATIONS,
  discountPercent,
  getCategories,
  getProductCertifications,
  getProducts,
  getVendors,
  sortProducts,
  toProductSort,
} from "@/lib/catalogue";
import { DIETS } from "@/lib/diets";
import {
  PAGE_SIZE,
  PRICE_MAX_RUPEES,
  PRICE_MIN_RUPEES,
  type ShopQuery,
} from "@/lib/shop-query";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Products - Kraya",
  description:
    "Explore Kraya's complete range of organic, natural and chemical-free food from verified Indian producers.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "All Products - Kraya",
    description:
      "Explore Kraya's complete range of organic, natural and chemical-free food from verified Indian producers.",
    url: "/shop",
    images: [
      {
        url: "/photos/apples-crate.jpg",
        width: 1280,
        height: 853,
        alt: "A crate of organically grown apples",
      },
    ],
  },
};

/**
 * Filters are read from the URL on the server, and the catalogue is local JSON,
 * so rendering blocks for microseconds.
 */
export const instant = false;

const DISCOUNTS = [10, 20, 30, 40];

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;

  const categoryId = first(params.category);
  const selectedTags = toArray(params.tag);
  const selectedDiets = toArray(params.diet);
  const selectedVendors = toArray(params.vendor);
  const selectedCertifications = toArray(params.certification);
  const q = first(params.q);
  const sort = toProductSort(first(params.sort));
  const discount = toDiscount(params.discount);
  const stock = toStock(params.stock);

  const rawMin = toNumber(params.min) ?? PRICE_MIN_RUPEES;
  const rawMax = toNumber(params.max) ?? PRICE_MAX_RUPEES;
  const minPrice = Math.max(PRICE_MIN_RUPEES, Math.min(rawMin, rawMax));
  const maxPrice = Math.max(minPrice, Math.min(rawMax, PRICE_MAX_RUPEES));

  const sorted = sortProducts(
    getProducts({
      categoryId,
      tags: selectedTags,
      diets: selectedDiets,
      vendorIds: selectedVendors,
      certifications: selectedCertifications,
      minPriceCents: minPrice * 100,
      maxPriceCents: maxPrice * 100,
      minDiscount: discount,
      stock,
      q,
    }),
    sort,
  );

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const requestedPage = Math.max(1, Number(first(params.page)) || 1);
  const page = Math.min(requestedPage, pageCount);
  const pageProducts = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const allProducts = getProducts();
  const categories = getCategories();
  const vendors = getVendors();

  const counts = {
    total: allProducts.length,
    category: Object.fromEntries(
      categories.map((category) => [
        category.id,
        allProducts.filter((product) => product.categoryId === category.id).length,
      ]),
    ),
    vendor: Object.fromEntries(
      vendors.map((vendor) => [
        vendor.id,
        allProducts.filter((product) => product.vendorId === vendor.id).length,
      ]),
    ),
    diet: Object.fromEntries(
      DIETS.map((diet) => [
        diet.id,
        allProducts.filter((product) => product.diets?.includes(diet.id)).length,
      ]),
    ),
    certification: Object.fromEntries(
      CERTIFICATIONS.map((certification) => [
        certification.id,
        allProducts.filter((product) =>
          getProductCertifications(product).includes(certification.id),
        ).length,
      ]),
    ),
    discount: Object.fromEntries(
      DISCOUNTS.map((threshold) => [
        threshold,
        allProducts.filter((product) => {
          const value = discountPercent(product);
          return value !== undefined && value >= threshold;
        }).length,
      ]),
    ),
    stock: {
      in: allProducts.filter((product) =>
        product.variants.some((variant) => variant.inStock),
      ).length,
      out: allProducts.filter((product) =>
        product.variants.every((variant) => !variant.inStock),
      ).length,
    },
  };

  const query: ShopQuery = {
    category: categoryId,
    tags: selectedTags,
    diets: selectedDiets,
    vendors: selectedVendors,
    certifications: selectedCertifications,
    q,
    sort,
    min: minPrice,
    max: maxPrice,
    discount,
    stock,
    page,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All products",
    itemListElement: pageProducts.map((product, index) => ({
      "@type": "ListItem",
      position: (page - 1) * PAGE_SIZE + index + 1,
      name: product.name,
      url: `${SITE_URL}/shop/${product.id}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <CatalogueHero />

      <div className="container">
        <nav aria-label="Breadcrumb" className="mt-3">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
            <li>
              <Link href="/" className="transition hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <CaretRightIcon size={11} weight="bold" />
            </li>
            <li aria-current="page" className="font-medium text-ink-2">
              All Products
            </li>
          </ol>
        </nav>

        <div className="mt-4 pb-[var(--section-gap)]">
          <CatalogueBrowser
            products={pageProducts}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            sort={sort}
            query={query}
            categories={categories}
            sidebar={
              <ShopSidebar
                categories={categories}
                vendors={vendors}
                diets={DIETS}
                certifications={CERTIFICATIONS}
                filters={query}
                counts={counts}
              />
            }
            pagination={
              <CataloguePagination
                page={page}
                pageCount={pageCount}
                query={query}
              />
            }
          />
        </div>
      </div>

      <Newsletter />
    </>
  );
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNumber(value: string | string[] | undefined): number | undefined {
  const raw = Number(first(value));
  return Number.isFinite(raw) ? raw : undefined;
}

function toDiscount(value: string | string[] | undefined): number | undefined {
  const raw = Number(first(value));
  return DISCOUNTS.includes(raw) ? raw : undefined;
}

function toStock(value: string | string[] | undefined): "in" | "out" | undefined {
  const raw = first(value);
  return raw === "in" || raw === "out" ? raw : undefined;
}
