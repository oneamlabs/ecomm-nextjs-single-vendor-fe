"use client";

import Link from "next/link";
import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductListRow } from "@/components/product/product-list-row";
import type { Category, Product } from "@/lib/types";
import type { ShopQuery } from "@/lib/shop-query";
import { CategoryChips } from "./category-chips";
import { ShopSort } from "./shop-sort";

interface CatalogueBrowserProps {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  sort: string;
  query: ShopQuery;
  categories: Category[];
  sidebar: ReactNode;
  pagination?: ReactNode;
}

export function CatalogueBrowser({
  products,
  total,
  page,
  pageSize,
  sort,
  query,
  categories,
  sidebar,
  pagination,
}: CatalogueBrowserProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[length:var(--text-page-title)]">All Products</h1>
          <p className="mt-1 text-sm text-muted">
            Explore our complete range of organic, natural and chemical-free food products.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ShopSort value={sort} query={query} />

          <fieldset className="m-0 flex items-center gap-1 border-0 p-0">
            <legend className="sr-only">Product view</legend>
            <button
              type="button"
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              onClick={() => setView("grid")}
              className={`grid size-9 place-items-center rounded-[var(--radius-sm)] border transition ${
                view === "grid"
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-rule bg-paper text-ink-2 hover:border-accent-line hover:text-accent"
              }`}
            >
              <SquaresFourIcon size={17} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              aria-label="List view"
              onClick={() => setView("list")}
              className={`grid size-9 place-items-center rounded-[var(--radius-sm)] border transition ${
                view === "list"
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-rule bg-paper text-ink-2 hover:border-accent-line hover:text-accent"
              }`}
            >
              <ListIcon size={17} weight="bold" aria-hidden="true" />
            </button>
          </fieldset>
        </div>
      </div>

      <div className="mt-5">
        <CategoryChips categories={categories} query={query} />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
        <div>{sidebar}</div>

        <div className="min-w-0">
          <p aria-live="polite" className="text-sm text-muted">
            Showing {from}–{to} of {total} products
          </p>

          {products.length === 0 ? (
            <div className="mt-4 rounded-[var(--radius-md)] border border-rule bg-paper-2 p-8">
              <h2 className="font-body text-base font-bold text-ink">
                No products match
              </h2>
              <p className="mt-2 max-w-[44ch] text-sm text-ink-2">
                Try a wider price range or clear a filter.
              </p>
              <Link href="/shop" className="btn btn--primary mt-4">
                Clear filters
              </Link>
            </div>
          ) : view === "grid" ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  showPack
                  showVendor
                />
              ))}
            </div>
          ) : (
            <div className="mt-3 grid gap-3">
              {products.map((product) => (
                <ProductListRow key={product.id} product={product} />
              ))}
            </div>
          )}

          {pagination}
        </div>
      </div>
    </div>
  );
}
