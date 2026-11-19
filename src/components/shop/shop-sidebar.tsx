"use client";

import { useRouter } from "next/navigation";
import {
  ArrowClockwiseIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import {
  buildShopHref,
  PRICE_MAX_RUPEES,
  PRICE_MIN_RUPEES,
  type ShopQuery,
} from "@/lib/shop-query";
import type { Category, Vendor } from "@/lib/types";

interface ShopSidebarProps {
  categories: Category[];
  vendors: Vendor[];
  diets: readonly { id: string; label: string }[];
  certifications: readonly { id: string; label: string }[];
  filters: ShopQuery;
  counts: {
    total: number;
    category: Record<string, number>;
    vendor: Record<string, number>;
    diet: Record<string, number>;
    certification: Record<string, number>;
    discount: Record<number, number>;
    stock: { in: number; out: number };
  };
}

const DISCOUNTS = [10, 20, 30, 40];

export function ShopSidebar({
  categories,
  vendors,
  diets,
  certifications,
  filters,
  counts,
}: ShopSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");

  const selectedVendors = filters.vendors ?? [];
  const selectedDiets = filters.diets ?? [];
  const selectedCertifications = filters.certifications ?? [];
  const minPrice = filters.min ?? PRICE_MIN_RUPEES;
  const maxPrice = filters.max ?? PRICE_MAX_RUPEES;

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.q ? 1 : 0) +
    (filters.discount ? 1 : 0) +
    (filters.stock ? 1 : 0) +
    (minPrice > PRICE_MIN_RUPEES ? 1 : 0) +
    (maxPrice < PRICE_MAX_RUPEES ? 1 : 0) +
    selectedVendors.length +
    selectedDiets.length +
    selectedCertifications.length;

  function navigate(next: Partial<ShopQuery>) {
    router.replace(buildShopHref(filters, { ...next, page: 1 }), {
      scroll: false,
    });
  }

  function toggle(
    key: "vendors" | "diets" | "certifications",
    value: string,
  ) {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    navigate({ [key]: next });
  }

  const visibleVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(vendorSearch.trim().toLowerCase()),
  );

  return (
    <aside aria-label="Product filters" className="min-w-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="shop-filters"
        onClick={() => setOpen((value) => !value)}
        className="btn flex w-full items-center justify-between lg:hidden"
      >
        <span>
          Filters
          {activeCount > 0 && (
            <span className="tag ml-2" aria-label={`${activeCount} active`}>
              {activeCount}
            </span>
          )}
        </span>
        <span className="text-muted">{open ? "Hide" : "Show"}</span>
      </button>

      <div
        id="shop-filters"
        className={open ? "mt-4 block" : "mt-4 hidden lg:mt-0 lg:block"}
      >
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper">
          <Section title="Categories">
            <Option
              label="All Products"
              count={counts.total}
              checked={!filters.category}
              onChange={() => navigate({ category: undefined })}
              type="radio"
            />
            {categories.map((category) => (
              <Option
                key={category.id}
                label={category.name}
                count={counts.category[category.id] ?? 0}
                checked={filters.category === category.id}
                onChange={() => navigate({ category: category.id })}
                type="radio"
              />
            ))}
          </Section>

          <Section title="Price Range">
            <PriceRange
              key={`${minPrice}-${maxPrice}`}
              min={minPrice}
              max={maxPrice}
              onCommit={(nextMin, nextMax) =>
                navigate({ min: nextMin, max: nextMax })
              }
            />
          </Section>

          <Section title="Discount">
            {DISCOUNTS.map((discount) => (
              <Option
                key={discount}
                label={`${discount}% or more`}
                count={counts.discount[discount] ?? 0}
                checked={filters.discount === discount}
                onChange={() =>
                  navigate({
                    discount:
                      filters.discount === discount ? undefined : discount,
                  })
                }
              />
            ))}
          </Section>

          <Section title="Brand / Vendor">
            <div className="relative">
              <MagnifyingGlassIcon
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <label htmlFor="vendor-filter" className="sr-only">
                Search vendors
              </label>
              <input
                id="vendor-filter"
                type="search"
                value={vendorSearch}
                onChange={(event) => setVendorSearch(event.target.value)}
                placeholder="Search vendor..."
                className="h-9 w-full rounded-[var(--radius-sm)] border border-rule bg-paper pl-8 pr-2 text-xs text-ink outline-none focus:border-accent"
              />
            </div>
            <div className="mt-1">
              {visibleVendors.map((vendor) => (
                <Option
                  key={vendor.id}
                  label={vendor.name}
                  count={counts.vendor[vendor.id] ?? 0}
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => toggle("vendors", vendor.id)}
                />
              ))}
              {visibleVendors.length === 0 && (
                <p className="py-2 text-xs text-muted">No vendors match.</p>
              )}
            </div>
          </Section>

          <Section title="Dietary Preference">
            {diets.map((diet) => (
              <Option
                key={diet.id}
                label={diet.label}
                count={counts.diet[diet.id] ?? 0}
                checked={selectedDiets.includes(diet.id)}
                onChange={() => toggle("diets", diet.id)}
              />
            ))}
          </Section>

          <Section title="Certification">
            {certifications.map((certification) => (
              <Option
                key={certification.id}
                label={certification.label}
                count={counts.certification[certification.id] ?? 0}
                checked={selectedCertifications.includes(certification.id)}
                onChange={() => toggle("certifications", certification.id)}
              />
            ))}
          </Section>

          <Section title="Availability">
            <Option
              label="In Stock"
              count={counts.stock.in}
              checked={filters.stock === "in"}
              onChange={() =>
                navigate({ stock: filters.stock === "in" ? undefined : "in" })
              }
            />
            <Option
              label="Out of Stock"
              count={counts.stock.out}
              checked={filters.stock === "out"}
              onChange={() =>
                navigate({ stock: filters.stock === "out" ? undefined : "out" })
              }
            />
          </Section>

          <div className="p-4">
            <button
              type="button"
              onClick={() => router.replace("/shop", { scroll: false })}
              className="btn btn--ghost w-full justify-center gap-2 text-xs"
            >
              <ArrowClockwiseIcon size={15} weight="bold" aria-hidden="true" />
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details open className="group border-b border-rule px-4 py-3.5">
      <summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
        <span className="font-body text-sm font-semibold text-ink">{title}</span>
        <CaretUpIcon
          size={14}
          className="rotate-180 text-muted transition group-open:rotate-0"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

function Option({
  label,
  count,
  checked,
  onChange,
  type = "checkbox",
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
}) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center justify-between gap-2 text-sm">
      <span className="flex min-w-0 items-center gap-2">
        <input
          type={type}
          name={type === "radio" ? "filter-category" : undefined}
          checked={checked}
          onChange={onChange}
          className="size-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span
          className={`truncate ${
            checked ? "font-semibold text-ink" : "text-ink-2"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="shrink-0 text-xs text-muted">({count})</span>
    </label>
  );
}

function PriceRange({
  min,
  max,
  onCommit,
}: {
  min: number;
  max: number;
  onCommit: (min: number, max: number) => void;
}) {
  const [values, setValues] = useState({ min, max });

  const span = PRICE_MAX_RUPEES - PRICE_MIN_RUPEES;
  const left = ((values.min - PRICE_MIN_RUPEES) / span) * 100;
  const right = 100 - ((values.max - PRICE_MIN_RUPEES) / span) * 100;

  function change(key: "min" | "max", value: number) {
    setValues((current) =>
      key === "min"
        ? { ...current, min: Math.min(value, current.max) }
        : { ...current, max: Math.max(value, current.min) },
    );
  }

  function commit() {
    onCommit(values.min, values.max);
  }

  return (
    <div>
      <div className="relative mt-2 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-rule" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${left}%`, right: `${right}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN_RUPEES}
          max={PRICE_MAX_RUPEES}
          step={50}
          value={values.min}
          onChange={(event) => change("min", Number(event.target.value))}
          onPointerUp={commit}
          onKeyUp={commit}
          aria-label="Minimum price"
          className="range-input"
        />
        <input
          type="range"
          min={PRICE_MIN_RUPEES}
          max={PRICE_MAX_RUPEES}
          step={50}
          value={values.max}
          onChange={(event) => change("max", Number(event.target.value))}
          onPointerUp={commit}
          onKeyUp={commit}
          aria-label="Maximum price"
          className="range-input"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>₹{values.min}</span>
        <span>₹{values.max}</span>
      </div>
    </div>
  );
}
