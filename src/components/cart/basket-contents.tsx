"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretRightIcon,
  HeartIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StorefrontIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { ProductPhoto } from "@/components/product/product-photo";
import { announce } from "@/lib/announce";
import type { CartLine } from "@/lib/cart-store";
import { variantMrpCents } from "@/lib/variant";
import { getVendor } from "@/lib/vendors";
import { formatPrice, formatUnitRate, lineTotalCents } from "@/lib/money";
import { orderTotals } from "@/lib/order";
import { saveToWishlist } from "@/lib/wishlist-store";
import type { Product } from "@/lib/types";

const MAX_QUANTITY = 10;

function keyOf(line: CartLine) {
  return `${line.productId}::${line.variantId}`;
}

function lineTags(product: Product): string[] {
  const tags: string[] = [];
  if (product.organic) tags.push("100% Organic");
  if (product.tags.includes("gluten-free")) tags.push("Gluten Free");
  if (product.tags.includes("vegan")) tags.push("Vegan");
  return tags.slice(0, 2);
}

export function BasketContents({ products }: { products: Product[] }) {
  const { lines, setQuantity, removeLine, clearCart, totalQuantity } = useCart();
  const [deselected, setDeselected] = useState<Set<string>>(() => new Set());

  const productById = new Map(products.map((product) => [product.id, product]));

  let subtotalCents = 0;
  let itemTotalCents = 0;
  for (const line of lines) {
    const product = productById.get(line.productId);
    const variant = product?.variants.find((item) => item.id === line.variantId);
    if (!product || !variant) continue;
    subtotalCents += variant.priceCents * line.quantity;
    itemTotalCents +=
      (variantMrpCents(product, variant) ?? variant.priceCents) * line.quantity;
  }
  const totals = orderTotals(subtotalCents);
  const discountCents = itemTotalCents - subtotalCents;

  const inCart = new Set(lines.map((line) => line.productId));
  const suggestions = products
    .filter((product) => !inCart.has(product.id))
    .slice(0, 6);

  const selectedCount = lines.filter((line) => !deselected.has(keyOf(line))).length;
  const allSelected = lines.length > 0 && selectedCount === lines.length;

  function toggleSelected(key: string) {
    setDeselected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAll() {
    setDeselected(allSelected ? new Set(lines.map(keyOf)) : new Set());
  }

  function removeSelected() {
    const chosen = lines.filter((line) => !deselected.has(keyOf(line)));
    for (const line of chosen) removeLine(line.productId, line.variantId);
    setDeselected(new Set());
    announce(
      `${chosen.length} ${chosen.length === 1 ? "item" : "items"} removed from the cart.`,
    );
  }

  function removeItem(product: Product, line: CartLine) {
    removeLine(line.productId, line.variantId);
    setDeselected((current) => {
      const next = new Set(current);
      next.delete(keyOf(line));
      return next;
    });
    announce(`${product.name} removed from the cart.`);
  }

  function saveForLater(product: Product, line: CartLine) {
    saveToWishlist(product.id);
    removeLine(line.productId, line.variantId);
    setDeselected((current) => {
      const next = new Set(current);
      next.delete(keyOf(line));
      return next;
    });
    announce(`${product.name} moved to the saved list.`);
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <Link href="/" className="transition hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <CaretRightIcon size={11} weight="bold" />
          </li>
          <li aria-current="page" className="font-medium text-ink-2">
            Your Cart
          </li>
        </ol>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[48ch]">
          <div className="flex items-center gap-2.5">
            <ShoppingCartIcon
              size={30}
              weight="duotone"
              className="shrink-0 text-accent"
              aria-hidden="true"
            />
            <h1 className="text-[length:var(--text-page-title)]">
              Your Cart{" "}
              <span className="num font-normal text-muted">
                ({totalQuantity} {totalQuantity === 1 ? "Item" : "Items"})
              </span>
            </h1>
          </div>
          <p className="mt-2 text-sm text-ink-2">
            Review your items, apply offers and proceed to checkout.
          </p>
        </div>

        <Link href="/shop" className="btn">
          <ArrowLeftIcon size={16} weight="bold" aria-hidden="true" />
          Continue Shopping
        </Link>
      </header>

      {lines.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Your cart is empty"
            body="Nothing has been added yet. Browse the organic range and add what you need."
            action={{ href: "/shop", label: "Shop the range" }}
          />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <section
              aria-label="Items in your cart"
              className="overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper"
            >
              <ul className="divide-y divide-rule px-4 sm:px-5">
                {lines.map((line) => {
                  const product = productById.get(line.productId);
                  const variant = product?.variants.find(
                    (item) => item.id === line.variantId,
                  );
                  if (!product || !variant) return null;

                  const key = keyOf(line);
                  const selected = !deselected.has(key);
                  const mrp = variantMrpCents(product, variant);
                  const discount =
                    mrp !== undefined && mrp > variant.priceCents
                      ? Math.round(((mrp - variant.priceCents) / mrp) * 100)
                      : undefined;
                  const vendor = getVendor(product.vendorId);
                  const tags = lineTags(product);

                  return (
                    <li key={key} className="py-5">
                      <div className="flex gap-3 sm:gap-4">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelected(key)}
                          aria-label={`Select ${product.name}, ${variant.label}`}
                          className="mt-1 size-5 shrink-0 cursor-pointer accent-[var(--color-accent)]"
                        />

                        <Link
                          href={`/shop/${product.id}`}
                          className="shrink-0"
                          aria-label={product.name}
                        >
                          <ProductPhoto
                            photoKey={product.photo}
                            alt={product.photoAlt}
                            sizes="88px"
                            className="h-[72px] w-[72px] sm:h-[88px] sm:w-[88px]"
                          />
                        </Link>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Link
                                  href={`/shop/${product.id}`}
                                  className="text-base font-semibold text-ink transition hover:text-accent"
                                >
                                  {product.name}
                                </Link>
                                {product.badge && (
                                  <span className="tag">{product.badge}</span>
                                )}
                              </div>
                              {vendor && (
                                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-accent">
                                  <StorefrontIcon
                                    size={13}
                                    weight="fill"
                                    aria-hidden="true"
                                  />
                                  By {vendor.name}
                                </p>
                              )}
                              <p className="mt-1 text-sm text-muted">
                                Pack Size: {variant.label}{" "}
                                <span className="num">
                                  ({formatUnitRate(variant)})
                                </span>
                              </p>
                            </div>

                            <div className="hidden text-right sm:block">
                              <p className="num text-base font-bold text-ink">
                                {formatPrice(variant.priceCents)}
                              </p>
                              {mrp !== undefined && mrp > variant.priceCents && (
                                <p className="num text-xs text-muted line-through">
                                  {formatPrice(mrp)}
                                </p>
                              )}
                              {discount !== undefined && (
                                <span className="tag mt-1 inline-flex">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>

                            <p className="num hidden w-20 shrink-0 text-right text-lg font-bold text-ink sm:block">
                              {formatPrice(
                                lineTotalCents(variant, line.quantity),
                              )}
                            </p>
                          </div>

                          <div className="mt-1.5 flex items-baseline gap-2 sm:hidden">
                            <span className="num text-base font-bold text-ink">
                              {formatPrice(variant.priceCents)}
                            </span>
                            {mrp !== undefined && mrp > variant.priceCents && (
                              <span className="num text-xs text-muted line-through">
                                {formatPrice(mrp)}
                              </span>
                            )}
                            {discount !== undefined && (
                              <span className="tag">{discount}% OFF</span>
                            )}
                          </div>

                          {tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1.5"
                                >
                                  <LeafIcon
                                    size={13}
                                    weight="fill"
                                    className="text-accent"
                                    aria-hidden="true"
                                  />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 items-center rounded-[var(--radius-sm)] border border-rule bg-paper">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQuantity(
                                      line.productId,
                                      line.variantId,
                                      line.quantity - 1,
                                    )
                                  }
                                  aria-label={`One fewer ${product.name}, ${variant.label}`}
                                  className="grid size-11 place-items-center text-ink-2 transition hover:text-accent disabled:opacity-40"
                                >
                                  <MinusIcon size={14} aria-hidden="true" />
                                </button>
                                <span className="num w-8 text-center text-sm">
                                  {line.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setQuantity(
                                      line.productId,
                                      line.variantId,
                                      Math.min(
                                        MAX_QUANTITY,
                                        line.quantity + 1,
                                      ),
                                    )
                                  }
                                  disabled={line.quantity >= MAX_QUANTITY}
                                  aria-label={`One more ${product.name}, ${variant.label}`}
                                  className="grid size-11 place-items-center text-ink-2 transition hover:text-accent disabled:opacity-40"
                                >
                                  <PlusIcon size={14} aria-hidden="true" />
                                </button>
                              </div>

                              <span className="num text-lg font-bold text-ink sm:hidden">
                                {formatPrice(
                                  lineTotalCents(variant, line.quantity),
                                )}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <button
                                type="button"
                                onClick={() => saveForLater(product, line)}
                                className="inline-flex min-h-11 items-center gap-1.5 text-muted transition hover:text-accent"
                              >
                                <HeartIcon size={16} aria-hidden="true" />
                                Save for Later
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(product, line)}
                                className="inline-flex min-h-11 items-center gap-1.5 text-muted transition hover:text-sale"
                              >
                                <TrashIcon size={16} aria-hidden="true" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rule bg-paper-2/50 px-4 py-3 sm:px-5">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(node) => {
                      if (node) {
                        node.indeterminate = selectedCount > 0 && !allSelected;
                      }
                    }}
                    onChange={toggleSelectAll}
                    className="size-5 cursor-pointer accent-[var(--color-accent)]"
                  />
                  Select All ({lines.length}{" "}
                  {lines.length === 1 ? "Item" : "Items"})
                </label>

                <button
                  type="button"
                  onClick={removeSelected}
                  disabled={selectedCount === 0}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted transition hover:text-sale disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <TrashIcon size={16} aria-hidden="true" />
                  Remove Selected
                </button>
              </div>
            </section>

            <aside className="min-w-0">
              <CartSummary
                itemCount={totalQuantity}
                itemTotalCents={itemTotalCents}
                discountCents={discountCents}
                totals={totals}
              />

              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setDeselected(new Set());
                  announce("The cart is empty.");
                }}
                className="link-quiet mt-4 inline-flex min-h-11 items-center text-sm text-muted transition hover:text-sale"
              >
                Empty the cart
              </button>
            </aside>
          </div>

          {suggestions.length > 0 && (
            <section className="mt-10" aria-labelledby="also-like">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="also-like"
                    className="text-[length:var(--text-section-s)]"
                  >
                    You May Also Like
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Handpicked organic products for you
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition hover:text-accent-hover"
                >
                  View More
                  <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
                {suggestions.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    compact
                    showPack
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
