"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, formatUnitRate } from "@/lib/money";
import type { Product } from "@/lib/types";

export function PriceBoard({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  return (
    <div className="rounded-[var(--radius-lg)] border border-rule bg-paper p-5 shadow-lift md:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-rule pb-3">
        <span className="text-sm font-semibold text-muted">Today’s ticket</span>
        <span className="num text-sm text-muted">No. 01</span>
      </div>
      <Link
        href={`/shop/${product.id}`}
        className="link-quiet mt-4 font-body text-lg font-semibold"
      >
        {product.name}
      </Link>
      <p className="mt-1 text-sm text-muted">{product.origin}</p>

      <fieldset className="mt-4">
        <legend className="sr-only">Pack size</legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === variant.id}
              onClick={() => setVariantId(item.id)}
              className="chip"
            >
              {item.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div key={variant.id} className="price-in mt-6">
        <p className="num text-[length:var(--text-page-title)] font-bold">
          {formatPrice(variant.priceCents)}
        </p>
        <p className="num mt-1 text-sm text-ink-2">{formatUnitRate(variant)}</p>
      </div>

      <p aria-live="polite" className="sr-only">
        {`${variant.label}: ${formatPrice(variant.priceCents)}, ${formatUnitRate(variant)}`}
      </p>
    </div>
  );
}
