"use client";

import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { OrderSummaryRows } from "@/components/cart/order-summary-rows";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductPhoto } from "@/components/product/product-photo";
import { formatPrice, formatUnitRate, lineTotalCents } from "@/lib/money";
import { DELIVERY, orderTotals } from "@/lib/order";
import type { Product } from "@/lib/types";

export function BasketContents({ products }: { products: Product[] }) {
  const { lines, setQuantity, removeLine, clearCart } = useCart();
  const productById = new Map(products.map((product) => [product.id, product]));
  const subtotalCents = lines.reduce((sum, line) => {
    const variant = productById
      .get(line.productId)
      ?.variants.find((item) => item.id === line.variantId);
    return variant ? sum + variant.priceCents * line.quantity : sum;
  }, 0);

  if (lines.length === 0) {
    return (
      <div className="mt-10">
        <EmptyState
          title="Your cart is empty"
          body="Nothing has been added yet. Browse the organic range and add what you need."
          action={{ href: "/shop", label: "Shop the range" }}
        />
      </div>
    );
  }

  const totals = orderTotals(subtotalCents);

  return (
    <div className="mt-10 grid gap-10 md:grid-cols-12">
      <div className="md:col-span-8">
        <ul className="border-b border-rule">
          {lines.map((line) => {
            const product = productById.get(line.productId);
            const variant = product?.variants.find((item) => item.id === line.variantId);
            if (!product || !variant) return null;

            return (
              <li key={`${line.productId}-${line.variantId}`} className="border-t border-rule py-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex min-w-0 items-center gap-4">
                    <Link href={`/shop/${product.id}`} className="shrink-0">
                      <ProductPhoto
                        photoKey={product.photo}
                        alt={product.photoAlt}
                        sizes="80px"
                        className="h-20 w-20 rounded-[var(--radius-sm)]"
                      />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/shop/${product.id}`}
                        className="font-body text-lg font-semibold"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">
                        {variant.label}, {formatUnitRate(variant)}
                      </p>
                    </div>
                  </div>
                  <p className="num shrink-0 text-base">
                    {formatPrice(lineTotalCents(variant, line.quantity))}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.variantId, line.quantity - 1)}
                      aria-label={`One fewer ${product.name}, ${variant.label}`}
                      className="btn min-h-11 w-11 px-0"
                    >
                      <MinusIcon aria-hidden="true" size={16} />
                    </button>
                    <span className="num w-8 text-center">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.variantId, line.quantity + 1)}
                      aria-label={`One more ${product.name}, ${variant.label}`}
                      className="btn min-h-11 w-11 px-0"
                    >
                      <PlusIcon aria-hidden="true" size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.productId, line.variantId)}
                    aria-label={`Remove ${product.name}, ${variant.label}`}
                    className="link-quiet inline-flex min-h-11 items-center text-sm text-muted"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={clearCart}
          className="link-quiet mt-6 inline-flex min-h-11 items-center text-sm text-muted"
        >
          Empty the cart
        </button>
      </div>

      <aside className="md:col-span-4">
        <div className="panel-quiet p-6">
          <h2 className="font-body text-xl font-semibold leading-tight tracking-normal">
            Order summary
          </h2>
          <div className="mt-4">
            <OrderSummaryRows totals={totals} />
          </div>

          {totals.remainingForFreeDeliveryCents > 0 && (
            <p className="num mt-4 text-sm text-muted">
              {formatPrice(totals.remainingForFreeDeliveryCents)} more for free delivery.
            </p>
          )}

          <Link href="/checkout" className="btn btn--primary mt-6 w-full">
            Checkout
          </Link>
          <p className="mt-3 text-sm text-muted">
            Delivery is {formatPrice(DELIVERY.feeCents)}, free over{" "}
            {formatPrice(DELIVERY.freeThresholdCents)}.
          </p>
        </div>
      </aside>
    </div>
  );
}
