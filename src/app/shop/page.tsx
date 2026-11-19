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
} from "@/lib/catalogue";
import { DIETS } from "@/lib/diets";
import {
  DISCOUNT_THRESHOLDS,
  PAGE_SIZE,
  parseShopParams,
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

const DISCOUNTS = [...DISCOUNT_THRESHOLDS];

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const raw = await searchParams;
  const params = parseShopParams(raw);

  const categoryId = params.category;
  const selectedTags = params.tag;
  const selectedDiets = params.diet;
  const selectedVendors = params.vendor;
  const selectedCertifications = params.certification;
  const q = params.q;
  const sort = params.sort;
  const discount = params.discount;
  const stock = params.stock;

  const minPrice = params.min;
  const maxPrice = params.max;

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
  const page = Math.min(params.page, pageCount);
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

