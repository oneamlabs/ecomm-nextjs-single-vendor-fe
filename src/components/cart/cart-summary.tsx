"use client";

import Link from "next/link";
import {
  ArrowRightIcon,
  CaretDownIcon,
  HeadsetIcon,
  LockSimpleIcon,
  ShieldCheckIcon,
  TagIcon,
  TruckIcon,
} from "@phosphor-icons/react";
import { useId, useState } from "react";
import { formatPrice } from "@/lib/money";
import { DELIVERY, type OrderTotals } from "@/lib/order";

interface CartSummaryProps {
  itemCount: number;
  itemTotalCents: number;
  discountCents: number;
  totals: OrderTotals;
}

const TRUST = [
  { Icon: ShieldCheckIcon, label: "100% Secure\nPayments" },
  { Icon: TruckIcon, label: "Easy\nReturns" },
  { Icon: HeadsetIcon, label: "24x7\nSupport" },
];

export function CartSummary({
  itemCount,
  itemTotalCents,
  discountCents,
  totals,
}: CartSummaryProps) {
  const [couponOpen, setCouponOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const couponId = useId();

  function applyCoupon(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(
      code.trim()
        ? `"${code.trim()}" is not a demo coupon.`
        : "Enter a coupon code.",
    );
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-rule bg-paper p-5">
      <h2 className="font-body text-lg font-bold text-ink">Order Summary</h2>

      <dl className="mt-4 text-sm">
        <div className="flex justify-between gap-4 py-1.5">
          <dt className="text-ink-2">
            Item Total ({itemCount} {itemCount === 1 ? "Item" : "Items"})
          </dt>
          <dd className="num font-semibold">{formatPrice(itemTotalCents)}</dd>
        </div>
        {discountCents > 0 && (
          <div className="flex justify-between gap-4 py-1.5">
            <dt className="text-ink-2">Item Discount</dt>
            <dd className="num font-semibold text-accent">
              −{formatPrice(discountCents)}
            </dd>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-rule-2 py-1.5">
          <dt className="text-ink-2">Subtotal</dt>
          <dd className="num font-semibold">
            {formatPrice(totals.subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 py-1.5">
          <dt className="flex items-center gap-1 text-ink-2">
            Delivery Charges
            <button
              type="button"
              aria-describedby={`${couponId}-delivery`}
              aria-label="Delivery charge details"
              className="grid size-5 cursor-help place-items-center rounded-full border border-rule text-[10px] text-muted"
            >
              i
            </button>
            <span id={`${couponId}-delivery`} className="sr-only">
              Delivery is free on orders above{" "}
              {formatPrice(DELIVERY.freeThresholdCents)}, otherwise{" "}
              {formatPrice(DELIVERY.feeCents)}.
            </span>
          </dt>
          <dd className="num font-semibold">
            {totals.deliveryCents === 0
              ? "Free"
              : formatPrice(totals.deliveryCents)}
          </dd>
        </div>
      </dl>

      <p className="mt-2 flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent-soft px-3 py-2 text-xs font-medium text-accent-hover">
        <TruckIcon size={15} weight="duotone" aria-hidden="true" />
        Free Delivery on orders above {formatPrice(DELIVERY.freeThresholdCents)}
      </p>

      <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-rule pt-4">
        <div>
          <p className="text-base font-bold text-ink">Total Amount</p>
          <p className="text-xs text-muted">(Inclusive of all taxes)</p>
        </div>
        <p className="num text-2xl font-bold text-accent">
          {formatPrice(totals.totalCents)}
        </p>
      </div>

      <div className="mt-4 rounded-[var(--radius-sm)] border border-rule">
        <button
          type="button"
          aria-expanded={couponOpen}
          aria-controls={couponId}
          onClick={() => setCouponOpen((value) => !value)}
          className="flex min-h-11 w-full items-center justify-between gap-2 px-3 text-sm font-semibold text-ink"
        >
          <span className="inline-flex items-center gap-2">
            <TagIcon
              size={17}
              weight="duotone"
              className="text-accent"
              aria-hidden="true"
            />
            Apply Coupon
          </span>
          <CaretDownIcon
            size={15}
            weight="bold"
            aria-hidden="true"
            className={`text-muted transition-transform ${couponOpen ? "rotate-180" : ""}`}
          />
        </button>

        {couponOpen && (
          <form
            id={couponId}
            onSubmit={applyCoupon}
            className="border-t border-rule-2 p-3"
          >
            <div className="flex gap-2">
              <label htmlFor={`${couponId}-field`} className="sr-only">
                Coupon code
              </label>
              <input
                id={`${couponId}-field`}
                type="text"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError("");
                }}
                placeholder="Enter coupon code"
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${couponId}-error` : undefined}
                className="field h-11 min-h-11 flex-1"
              />
              <button type="submit" className="btn btn--soft h-11">
                Apply
              </button>
            </div>
            <p
              id={`${couponId}-error`}
              aria-live="polite"
              className="mt-2 min-h-[1lh] text-xs text-error"
            >
              {error}
            </p>
          </form>
        )}
      </div>

      <Link
        href="/checkout"
        className="btn btn--primary mt-4 min-h-12 w-full"
      >
        <LockSimpleIcon size={17} weight="bold" aria-hidden="true" />
        Proceed to Checkout
        <ArrowRightIcon size={17} weight="bold" aria-hidden="true" />
      </Link>

      <ul className="mt-4 grid grid-cols-3 divide-x divide-rule border-t border-rule pt-3">
        {TRUST.map(({ Icon, label }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-1.5 px-1 text-center"
          >
            <Icon
              size={22}
              weight="duotone"
              className="text-accent"
              aria-hidden="true"
            />
            <span className="whitespace-pre-line text-[11px] font-semibold leading-tight text-ink-2">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
