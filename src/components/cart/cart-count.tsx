"use client";

import { useCart } from "./cart-provider";

export function CartCount() {
  const { totalQuantity } = useCart();

  if (totalQuantity === 0) {
    return <span aria-hidden="true" className="inline-block min-w-7" />;
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="num inline-flex min-w-7 items-center justify-center rounded-[var(--radius-pill)] bg-accent px-1.5 py-0.5 text-xs font-semibold text-accent-ink"
      >
        {totalQuantity}
      </span>
      <span className="sr-only">
        , {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
      </span>
    </>
  );
}
