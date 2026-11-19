import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopSidebar } from "@/components/shop/shop-sidebar";
import { ShopToolbar } from "@/components/shop/shop-toolbar";
import { getCategories, getProducts, sortProducts, toProductSort } from "@/lib/catalogue";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop - Kraya",
  description:
    "Twelve provisions, filtered by shelf and by diet, with prices per pack and per 100 g or 100 ml.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    title: "Shop - Kraya",
    description:
      "Twelve provisions, filtered by shelf and by diet, with prices per pack and per 100 g or 100 ml.",
    url: "/shop",
    images: [
      {
        url: "/photos/market-stall.jpg",
        width: 1280,
        height: 961,
        alt: "A sunlit market stall under green canopies, with crates of tomatoes, lemons and greens",
      },
    ],
  },
};

/**
 * Filters are read from the URL on the server, and the catalogue is local JSON,
 * so rendering blocks for microseconds. Opting out of instant-navigation
 * validation says so on the record, instead of wrapping the page in a Suspense
 * boundary that would flash a loading state for data already in memory.
 */
export const instant = false;

const TAGS = ["vegan", "gluten-free", "organic"];

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  const categoryId = first(params.category);
  const selectedTags = toArray(params.tag);
  const sort = toProductSort(first(params.sort));

  const products = sortProducts(
    getProducts({ categoryId, tags: selectedTags }),
    sort,
  );
  const allProducts = getProducts();
  const categories = getCategories();
  const activeCategory = categories.find((item) => item.id === categoryId);
  const counts = {
    total: allProducts.length,
    shelf: Object.fromEntries(
      categories.map((category) => [
        category.id,
        allProducts.filter((product) => product.categoryId === category.id).length,
      ]),
    ),
    tag: Object.fromEntries(
      TAGS.map((item) => [
        item,
        allProducts.filter((product) =>
          item === "organic" ? product.organic : product.tags.includes(item),
        ).length,
      ]),
    ),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The range",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${SITE_URL}/shop/${product.id}`,
    })),
  };

  return (
    <PageShell className="pb-[var(--section-gap)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PageHeader
        title="The range"
        lede={
          activeCategory
            ? activeCategory.summary
            : "Everything we keep in stock, in the weights it comes in, priced per pack and per 100 g."
        }
      />

      <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-14">
        <ShopSidebar
          categories={categories}
          tags={TAGS}
          filters={{ category: categoryId ?? "", tags: selectedTags, sort }}
          counts={counts}
        />

        <div className="min-w-0">
          <ShopToolbar
            count={products.length}
            category={activeCategory}
            tags={selectedTags}
            sort={sort}
          />

          {products.length === 0 ? (
            <div className="mt-8 rounded-[var(--radius-lg)] bg-paper-2 p-8 md:p-12">
              <h2 className="text-[length:var(--text-section-s)] font-bold">Nothing on this shelf</h2>
              <p className="mt-3 max-w-[46ch] text-ink-2">
                No items match that combination. Try the whole shelf.
              </p>
              <Link href="/shop" className="btn btn--primary mt-6">
                Show the whole shelf
              </Link>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="sr-only">Products</h2>
              <ProductGrid
                products={products}
                priorityCount={4}
                compact
                className="lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6"
              />
            </div>
          )}
        </div>
      </div>
    </PageShell>
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
