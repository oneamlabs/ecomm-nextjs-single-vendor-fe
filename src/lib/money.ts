import type { Variant } from "./types";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatPrice(cents: number): string {
  return money.format(cents / 100);
}

export function formatCount(value: number): string {
  return compact.format(value).toLowerCase();
}

/**
 * Price per 100 g or 100 ml, for comparing packs of different sizes.
 */
export function formatUnitRate(variant: Variant): string {
  if (variant.netUnit === "item") {
    return `${formatPrice(variant.priceCents)} / pack`;
  }

  const per100 = (variant.priceCents / variant.netAmount) * 100;
  const unit = variant.netUnit === "g" ? "100 g" : "100 ml";
  return `${money.format(per100 / 100)} / ${unit}`;
}

export function lineTotalCents(variant: Variant, quantity: number): number {
  return variant.priceCents * quantity;
}
