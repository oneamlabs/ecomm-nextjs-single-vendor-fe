"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { announce } from "@/lib/announce";
import { formatPrice } from "@/lib/money";

interface QuickAddProps {
  productId: string;
  variantId: string;
  name: string;
  label: string;
  priceCents: number;
  soldOut: boolean;
  compact?: boolean;
}

/**
 * The button keeps a stable accessible name; the confirmation is announced once
 * through the layout's single status region rather than a live region per card.
 */
export function QuickAdd({
  productId,
  variantId,
  name,
  label,
  priceCents,
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
    announce(
      `${name}, ${label}, added to basket. ${formatPrice(priceCents)}.`,
    );
    if (reset.current) window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={soldOut}
      aria-label={
        soldOut ? `${name} is sold out` : `Add ${name}, ${label} to basket`
      }
      className={`btn btn--primary min-h-11 flex-1 ${
        compact ? "px-2 text-sm" : "px-4 text-sm"
      }`}
    >
      {soldOut ? "Sold out" : added ? "Added" : compact ? "Add" : "Add to cart"}
    </button>
  );
}
