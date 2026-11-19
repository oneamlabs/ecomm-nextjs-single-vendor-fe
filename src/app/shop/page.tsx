import type { Metadata } from "next";
import Link from "next/link";
import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Newsletter } from "@/components/home/newsletter";
import { CatalogueBrowser } from "@/components/shop/catalogue-browser";
import { CatalogueHero } from "@/components/shop/catalogue-hero";
import { CataloguePagination } from "@/components/shop/catalogue-pagination";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { serverApi } from "@/lib/api";
import { CERTIFICATIONS } from "@/lib/certifications";
import { DIETS } from "@/lib/diets";
import { PAGE_SIZE, parseShopParams, type ShopQuery } from "@/lib/shop-query";
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

  const [list, { items: categories }, { items: vendors }] = await Promise.all([
    serverApi.listProducts({
      category: categoryId,
      q,
      tag: selectedTags,
      diet: selectedDiets,
      vendor: selectedVendors,
      certification: selectedCertifications,
      min: minPrice,
      max: maxPrice,
      discount,
      stock,
      sort,
      page: params.page,
      pageSize: PAGE_SIZE,
    }),
    serverApi.getCategories(),
    serverApi.getVendors(),
  ]);

  const { items: pageProducts, total, pageCount, page } = list;
  const counts = list.facets;

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

