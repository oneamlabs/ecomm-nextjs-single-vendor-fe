"use client";

import { ShoppingCartSimpleIcon } from "@phosphor-icons/react";
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
        soldOut
          ? `Sold Out: ${name}, ${label}`
          : added
            ? `Added: ${name}, ${label}`
            : `Add to Cart: ${name}, ${label}`
      }
      className={`btn btn--primary w-full min-h-10 ${
        compact ? "px-2 text-xs" : "px-3 text-sm"
      }`}
    >
      <ShoppingCartSimpleIcon
        size={compact ? 14 : 16}
        weight="bold"
        aria-hidden="true"
      />
      {soldOut ? "Sold Out" : added ? "Added" : "Add to Cart"}
    </button>
  );
}
