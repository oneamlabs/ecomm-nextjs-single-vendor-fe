import type { Product, Variant } from "./types";

/**
 * Pure pack maths. No catalogue data is imported here, so client components can
 * use these helpers without pulling product or category JSON into the bundle.
 */

export function defaultVariant(product: Product): Variant {
  return product.variants.find((variant) => variant.inStock) ?? product.variants[0];
}

export function lowestPriceCents(product: Product): number {
  return Math.min(...product.variants.map((variant) => variant.priceCents));
}

export function variantMrpCents(
  product: Product,
  variant: Variant,
): number | undefined {
  if (variant.mrpCents !== undefined) return variant.mrpCents;

  if (product.mrpCents === undefined) return undefined;

  const base = defaultVariant(product);
  if (variant.id === base.id) return product.mrpCents;

  return Math.round((product.mrpCents * variant.priceCents) / base.priceCents / 100) * 100;
}

export function discountPercent(product: Product): number | undefined {
  if (!product.mrpCents) return undefined;
  const price = defaultVariant(product).priceCents;
  if (product.mrpCents <= price) return undefined;
  return Math.round(((product.mrpCents - price) / product.mrpCents) * 100);
}
