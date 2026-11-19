"use client";

import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  InfoIcon,
  LightningIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartSimpleIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { announce } from "@/lib/announce";
import {
  defaultVariant,
  variantMrpCents,
} from "@/lib/variant";
import { formatCount, formatPrice } from "@/lib/money";
import type { Product, ProductDetail } from "@/lib/types";
import { Rating } from "./rating";

interface ProductBuyBoxProps {
  product: Product;
  detail: ProductDetail;
}

export function ProductBuyBox({ product, detail }: ProductBuyBoxProps) {
  const router = useRouter();
  const { addLine } = useCart();
  const [selectedId, setSelectedId] = useState(defaultVariant(product).id);
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
    product.variants.find((variant) => variant.id === selectedId) ??
    defaultVariant(product);
  const mrp = variantMrpCents(product, selected);
  const discount =
    mrp !== undefined && mrp > selected.priceCents
      ? Math.round(((mrp - selected.priceCents) / mrp) * 100)
      : undefined;
  const soldOut = !selected.inStock;

  function add() {
    addLine(product.id, selected.id, quantity);
    setAdded(true);
    announce(
      `${quantity} × ${selected.label} of ${product.name} added to cart. ${formatPrice(
        selected.priceCents * quantity,
      )}.`,
    );
    if (reset.current) window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setAdded(false), 2500);
  }

  function buyNow() {
    addLine(product.id, selected.id, quantity);
    router.push("/checkout");
  }

  return (
    <div>
      {product.badge && (
        <span className="tag inline-flex items-center gap-1">{product.badge}</span>
      )}
      <h1 className="mt-2 text-[length:var(--text-page-title)] leading-[1.12]">
        {product.name}
      </h1>
      <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-ink-2">
        {product.summary}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        {detail.soldCount !== undefined && (
          <span className="text-xs text-muted">
            {formatCount(detail.soldCount).toUpperCase()}+ sold
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-bold text-ink">
          {formatPrice(selected.priceCents)}
        </span>
        {mrp !== undefined && mrp > selected.priceCents && (
          <span className="text-sm text-muted line-through">{formatPrice(mrp)}</span>
        )}
        {discount !== undefined && <span className="tag">{discount}% OFF</span>}
      </div>
      <p className="mt-0.5 text-xs text-muted">Inclusive of all taxes</p>

      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-ink">Pack Size:</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {product.variants.map((variant) => {
            const variantMrp = variantMrpCents(product, variant);
            const selectedVariant = variant.id === selected.id;

            return (
              <label
                key={variant.id}
                className={`cursor-pointer rounded-[var(--radius-sm)] border p-2.5 text-center transition ${
                  selectedVariant
                    ? "border-accent bg-accent-soft"
                    : "border-rule bg-paper hover:border-accent-line"
                } ${!variant.inStock ? "opacity-50" : ""}`}
              >
                <input
                  type="radio"
                  name="pdp-pack"
                  value={variant.id}
                  checked={selectedVariant}
                  disabled={!variant.inStock}
                  onChange={() => setSelectedId(variant.id)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-ink">
                  {variant.label}
                </span>
                <span className="mt-0.5 block text-sm font-bold text-ink">
                  {variant.inStock ? formatPrice(variant.priceCents) : "Sold out"}
                </span>
                {variant.inStock &&
                  variantMrp !== undefined &&
                  variantMrp > variant.priceCents && (
                    <span className="block text-[11px] text-muted line-through">
                      {formatPrice(variantMrp)}
                    </span>
                  )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">Quantity:</p>
          <div className="mt-1.5 flex h-10 items-center rounded-[var(--radius-sm)] border border-rule">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="grid size-10 place-items-center disabled:opacity-40"
            >
              <MinusIcon size={14} aria-hidden="true" />
            </button>
            <span className="num w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(10, value + 1))}
              disabled={quantity >= 10}
              aria-label="Increase quantity"
              className="grid size-10 place-items-center disabled:opacity-40"
            >
              <PlusIcon size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 text-xs font-medium">
        <CheckCircleIcon
          size={15}
          weight="fill"
          className={soldOut ? "text-muted" : "text-accent"}
          aria-hidden="true"
        />
        <span className={soldOut ? "text-muted" : "text-accent"}>
          {soldOut ? "Out of stock" : "In Stock"}
        </span>
        {!soldOut && detail.stockLeft !== undefined && (
          <span className="text-ink-2">(Only {detail.stockLeft} left)</span>
        )}
        <InfoIcon
          size={13}
          className="text-muted"
          aria-label="Stock and availability are sample data"
        />
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={add}
          disabled={soldOut}
          className="btn btn--primary min-h-11 flex-1"
        >
          <ShoppingCartSimpleIcon size={17} weight="bold" aria-hidden="true" />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={buyNow}
          disabled={soldOut}
          className="btn btn--outline min-h-11 flex-1"
        >
          <LightningIcon size={17} weight="fill" aria-hidden="true" />
          Buy Now
        </button>
      </div>

      <p aria-live="off" className="mt-2 min-h-[1lh] text-xs text-muted">
        {added ? `Added ${quantity} × ${selected.label} to the cart.` : ""}
      </p>
    </div>
  );
}
