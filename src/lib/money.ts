import type { Variant } from "./types";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return money.format(cents / 100);
}

/**
 * Price per 100 g or 100 ml, for comparing packs of different sizes.
 * Returns to one decimal place, the precision a shop would print.
 */
export function formatUnitRate(variant: Variant): string {
  const per100 = (variant.priceCents / variant.netAmount) * 100;
  const unit = variant.netUnit === "g" ? "100 g" : "100 ml";
  return `${money.format(per100 / 100)} / ${unit}`;
}

export function lineTotalCents(variant: Variant, quantity: number): number {
  return variant.priceCents * quantity;
}
