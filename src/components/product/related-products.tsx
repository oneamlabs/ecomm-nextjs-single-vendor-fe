"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 2;

export function RelatedProducts({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const visible = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (products.length === 0) return null;

  return (
    <section className="min-w-0 overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-body text-lg font-bold text-ink">You May Also Like</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={page === 0}
            aria-label="Previous related products"
            className="grid size-8 place-items-center rounded-full border border-rule text-ink-2 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretLeftIcon size={14} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
            disabled={page >= pageCount - 1}
            aria-label="Next related products"
            className="grid size-8 place-items-center rounded-full border border-rule text-ink-2 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CaretRightIcon size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} compact showPack />
        ))}
      </div>
    </section>
  );
}
