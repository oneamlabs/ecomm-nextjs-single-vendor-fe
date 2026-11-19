"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { announce } from "@/lib/announce";
import { formatPrice, formatUnitRate } from "@/lib/money";
import type { Product, Variant } from "@/lib/types";

interface VariantPickerProps {
  product: Product;
}

export function VariantPicker({ product }: VariantPickerProps) {
  const { addLine } = useCart();
  const [selectedId, setSelectedId] = useState(
    product.variants.find((variant) => variant.inStock)?.id ?? product.variants[0].id,
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const reset = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (reset.current) window.clearTimeout(reset.current);
    },
    [],
  );

  const selected =
    product.variants.find((variant) => variant.id === selectedId) ?? product.variants[0];
  const soldOut = !selected.inStock;

  function select(variant: Variant) {
    setSelectedId(variant.id);
    setAdded(false);
  }

  function add() {
    addLine(product.id, selected.id, quantity);
    setAdded(true);
    announce(
      `${quantity} × ${selected.label} of ${product.name} added to basket. ${formatPrice(
        selected.priceCents * quantity,
      )}.`,
    );
    if (reset.current) window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-muted">Pack</legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {product.variants.map((variant) => (
            <div key={variant.id} className="seg flex">
              <input
                type="radio"
                name="variant"
                id={`variant-${variant.id}`}
                value={variant.id}
                checked={variant.id === selectedId}
                disabled={!variant.inStock}
                onChange={() => select(variant)}
              />
              <label htmlFor={`variant-${variant.id}`} className="w-full justify-between gap-3">
                <span>{variant.label}</span>
                <span className="num text-sm">
                  {variant.inStock ? formatPrice(variant.priceCents) : "Sold out"}
                </span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-y border-rule py-5">
        <div>
          <p className="num text-[length:var(--text-price)] font-semibold">{formatPrice(selected.priceCents)}</p>
          <p className="num mt-1 text-sm text-muted">{formatUnitRate(selected)}</p>
        </div>
        <p className="text-sm text-muted">
          {selected.inStock ? "In stock" : "Sold out"} · Packed as {selected.label}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Quantity</p>
          <div className="mt-2 flex h-11 items-center rounded-[var(--radius-md)] border border-rule">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="grid h-11 w-11 place-items-center text-lg disabled:opacity-40"
            >
              <MinusIcon aria-hidden="true" size={16} />
            </button>
            <span className="num min-w-9 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(10, value + 1))}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="grid h-11 w-11 place-items-center text-lg disabled:opacity-40"
            >
              <PlusIcon aria-hidden="true" size={16} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={soldOut}
          className="btn btn--primary min-h-11 flex-1"
        >
          {soldOut ? "Out of stock" : "Add to basket"}
        </button>
        <WishlistButton productId={product.id} name={product.name} />
      </div>

      <p aria-live="off" className="mt-3 min-h-[1lh] text-sm text-muted">
        {added
          ? `Added ${quantity} × ${selected.label} to the basket.`
          : ""}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Free delivery over £40; £3.50 under. Order by 11:00 for same-day within
        eight miles. Replaced if it arrives wrong.
      </p>
    </div>
  );
}
