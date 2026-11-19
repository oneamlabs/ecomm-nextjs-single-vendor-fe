export const DELIVERY = {
  freeThresholdCents: 4000,
  feeCents: 350,
  window: "Same day before 11:00, within eight miles",
} as const;

export const DELIVERY_SLOTS = [
  { value: "morning", label: "Morning, 8:00 to 12:00" },
  { value: "afternoon", label: "Afternoon, 12:00 to 17:00" },
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
