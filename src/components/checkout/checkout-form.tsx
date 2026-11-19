"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { BasketLineList } from "@/components/cart/basket-line-list";
import { OrderSummaryRows } from "@/components/cart/order-summary-rows";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/money";
import { orderTotals } from "@/lib/order";
import { checkoutFields, firstInvalidField, validateCheckout } from "@/lib/checkout";
import { DELIVERY_SLOTS } from "@/lib/order";
import type { Product } from "@/lib/types";

export function CheckoutForm({ products }: { products: Product[] }) {
  const { lines, clearCart } = useCart();
  const productById = new Map(products.map((product) => [product.id, product]));
  const subtotalCents = lines.reduce((sum, line) => {
    const variant = productById
      .get(line.productId)
      ?.variants.find((item) => item.id === line.variantId);
    return variant ? sum + variant.priceCents * line.quantity : sum;
  }, 0);
  const [values, setValues] = useState(checkoutFields);
  const [errors, setErrors] = useState<ReturnType<typeof validateCheckout>>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusId = useId();

  const totals = orderTotals(subtotalCents);

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);

    const invalid = firstInvalidField(found);
    if (!invalid) {
      setSubmitted(true);
      return;
    }

    formRef.current?.querySelector<HTMLElement>(`[name="${invalid}"]`)?.focus();
  }

  if (lines.length === 0 && !submitted) {
    return (
      <div className="mt-10">
        <EmptyState
          title="Nothing to check out"
          body="Your cart is empty, so there is nothing to send."
          action={{ href: "/shop", label: "Shop the range" }}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="panel-quiet mt-10 max-w-[54ch] p-8">
        <h2 className="text-[length:var(--text-section-s)] font-bold">No order was placed</h2>
        <p className="mt-4 text-ink-2">
          The form checked out, but this demo has no backend, so nothing was charged and nothing
          will arrive. Every field passed validation:
        </p>
        <dl className="mt-6 border-t border-rule pt-4 text-sm">
          <Row label="Name" value={values.name} />
          <Row label="Email" value={values.email} />
          <Row label="Address" value={`${values.address}, ${values.postcode.toUpperCase()}`} />
          <Row
            label="Window"
            value={DELIVERY_SLOTS.find((slot) => slot.value === values.slot)?.label ?? ""}
          />
          <div className="flex justify-between gap-4 border-t border-rule pt-3 text-base">
            <dt>Would have been</dt>
            <dd className="num">{formatPrice(totals.totalCents)}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn--primary">
            Shop the range
          </Link>
          <button
            type="button"
            className="btn"
            onClick={() => {
              clearCart();
              setSubmitted(false);
            }}
          >
            Empty the cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      data-endpoint=""
      className="mt-10 grid gap-12 md:grid-cols-12"
    >
      <div className="md:col-span-7">
        <fieldset>
          <legend className="font-body text-lg font-semibold tracking-normal">
            Who it is for
          </legend>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField
              label="Name"
              name="name"
              autoComplete="name"
              value={values.name}
              error={errors.name}
              onChange={(value) => update("name", value)}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={values.email}
              error={errors.email}
              onChange={(value) => update("email", value)}
            />
            <div className="sm:col-span-2">
              <TextField
                label="Address"
                name="address"
                autoComplete="street-address"
                value={values.address}
                error={errors.address}
                onChange={(value) => update("address", value)}
              />
            </div>
            <TextField
              label="PIN code"
              name="postcode"
              inputMode="numeric"
              autoComplete="postal-code"
              value={values.postcode}
              error={errors.postcode}
              onChange={(value) => update("postcode", value)}
            />
          </div>
        </fieldset>

        <fieldset
          className="mt-10 border-t border-rule pt-8"
          aria-describedby={`${statusId}-slot`}
          aria-invalid={errors.slot ? true : undefined}
        >
          <legend className="font-body text-lg font-semibold tracking-normal">Delivery window</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {DELIVERY_SLOTS.map((slot) => (
              <div key={slot.value} className="seg flex">
                <input
                  type="radio"
                  name="slot"
                  id={`slot-${slot.value}`}
                  value={slot.value}
                  checked={values.slot === slot.value}
                  onChange={() => update("slot", slot.value)}
                />
                <label htmlFor={`slot-${slot.value}`} className="w-full">
                  {slot.label}
                </label>
              </div>
            ))}
          </div>
          <p
            id={`${statusId}-slot`}
            className="mt-3 min-h-[1lh] text-sm text-error"
            aria-live="polite"
          >
            {errors.slot ?? ""}
          </p>
        </fieldset>

        <div className="mt-8">
          <button type="submit" className="btn btn--primary">
            Check the order
          </button>
          <p id={statusId} aria-live="polite" className="mt-3 min-h-[1lh] text-sm text-muted">
            {Object.keys(errors).length > 0 ? "Check the fields marked in red." : ""}
          </p>
        </div>
      </div>

      <aside className="md:col-span-5">
        <div className="panel-quiet p-6">
          <h2 className="font-body text-xl font-semibold leading-tight tracking-normal">
            What you are ordering
          </h2>
          <BasketLineList lines={lines} products={products} />
          <div className="mt-4 border-t border-rule pt-3">
            <OrderSummaryRows totals={totals} />
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          This is a demo. The form validates, but no payment is taken and no order is sent anywhere.
        </p>
      </aside>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-rule-2 py-1 first:border-t-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
  onChange: (value: string) => void;
}

function TextField({
  label,
  name,
  value,
  error,
  type = "text",
  inputMode,
  autoComplete,
  onChange,
}: TextFieldProps) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="field mt-2"
      />
      <p id={errorId} className="mt-2 min-h-[1lh] text-sm text-error">
        {error ?? ""}
      </p>
    </div>
  );
}
