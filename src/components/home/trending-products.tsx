"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

interface Tab {
  id: string;
  label: string;
  categories: string[] | null;
}

const TABS: Tab[] = [
  { id: "all", label: "All", categories: null },
  { id: "grains-pulses", label: "Grains & Pulses", categories: ["grains", "pulses"] },
  { id: "snacks", label: "Snacks", categories: ["snacks"] },
  { id: "oils", label: "Oils & Ghee", categories: ["oils"] },
  { id: "beverages", label: "Beverages", categories: ["beverages"] },
];

export function TrendingProducts({ products }: { products: Product[] }) {
  const [active, setActive] = useState<string>("all");
  const tab = TABS.find((item) => item.id === active) ?? TABS[0];
  const visible = products
    .filter((product) =>
      tab.categories ? tab.categories.includes(product.categoryId) : true,
    )
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div className="max-w-[52ch]">
          <h2 className="text-[length:var(--text-section)]">Trending Organic Products</h2>
          <p className="mt-1 text-sm text-muted">
            Handpicked organic essentials from trusted sellers
          </p>
        </div>

        <fieldset className="m-0 flex flex-wrap items-center gap-1.5 border-0 p-0">
          <legend className="sr-only">Filter trending products</legend>
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={active === item.id}
              onClick={() => setActive(item.id)}
              className={`inline-flex h-9 items-center rounded-[var(--radius-sm)] border px-3 text-xs font-semibold transition ${
                active === item.id
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-rule bg-paper text-ink-2 hover:border-accent-line hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </fieldset>
      </div>

      <p aria-live="polite" className="sr-only">
        {visible.length} products shown
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visible.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>
    </div>
  );
}
