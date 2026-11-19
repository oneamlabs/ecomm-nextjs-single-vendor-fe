"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";

interface QuickAddProps {
  productId: string;
  variantId: string;
  name: string;
  label: string;
  soldOut: boolean;
  compact?: boolean;
}

export function QuickAdd({
  productId,
  variantId,
  name,
  label,
  soldOut,
  compact = false,
}: QuickAddProps) {
  const { addLine } = useCart();
  const [added, setAdded] = useState(false);
  const reset = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (reset.current) window.clearTimeout(reset.current);
    },
    [],
  );

  function add() {
    addLine(productId, variantId, 1);
    setAdded(true);
    if (reset.current) window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={add}
        disabled={soldOut}
        aria-label={
          soldOut
            ? `${name} is sold out`
            : added
              ? `Added ${name}, ${label} to cart`
              : `Add ${name}, ${label} to cart`
        }
        className={`btn btn--primary flex-1 ${
          compact ? "min-h-11 px-3 text-sm md:min-h-9" : "min-h-11 px-4 text-sm"
        }`}
      >
        {soldOut ? "Sold out" : added ? "Added" : "Add to cart"}
      </button>
      <span aria-live="polite" className="sr-only">
        {added ? `${name}, ${label} added to cart.` : ""}
      </span>
    </>
  );
}
