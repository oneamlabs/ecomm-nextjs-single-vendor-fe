export const DELIVERY = {
  freeThresholdCents: 99900,
  feeCents: 4900,
  window: "Delivered in 3 to 5 days across India",
} as const;

export const DELIVERY_SLOTS = [
  { value: "morning", label: "Morning, 9:00 to 13:00" },
  { value: "afternoon", label: "Afternoon, 13:00 to 18:00" },
] as const;

export interface OrderTotals {
  subtotalCents: number;
  deliveryCents: number;
  totalCents: number;
  remainingForFreeDeliveryCents: number;
}

export function orderTotals(subtotalCents: number): OrderTotals {
  const qualifies = subtotalCents >= DELIVERY.freeThresholdCents;
  const deliveryCents = qualifies ? 0 : DELIVERY.feeCents;

  return {
    subtotalCents,
    deliveryCents,
    totalCents: subtotalCents + deliveryCents,
    remainingForFreeDeliveryCents: qualifies
      ? 0
      : DELIVERY.freeThresholdCents - subtotalCents,
  };
}
