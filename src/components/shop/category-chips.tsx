import Link from "next/link";
import { ProductPhoto } from "@/components/product/product-photo";
import { buildShopHref, type ShopQuery } from "@/lib/shop-query";
import type { Category } from "@/lib/types";

const CHIP_PHOTOS: Record<string, string> = {
  grains: "spices-dark",
  pulses: "sloe-berries",
  oils: "olives-harvest",
  snacks: "coffee-green",
  breakfast: "sourdough-loaf",
  spices: "chillies-market",
  beverages: "coffee-roasted",
  combos: "market-stall",
};

const ORDER = ["grains", "pulses", "oils", "snacks", "breakfast", "spices", "beverages", "combos"];

interface CategoryChipsProps {
  categories: Category[];
  query: ShopQuery;
}

export function CategoryChips({ categories, query }: CategoryChipsProps) {
  const items = ORDER.flatMap((id) => {
    const category = categories.find((item) => item.id === id);
    return category ? [category] : [];
  });

  return (
    <nav aria-label="Shop by category">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
        {items.map((category) => {
          const active = query.category === category.id;

          return (
            <li key={category.id} className="min-w-0">
              <Link
                href={buildShopHref(query, { category: category.id, page: 1 })}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 items-center gap-2 rounded-[var(--radius-md)] border bg-paper p-2 transition hover:border-accent-line ${
                  active
                    ? "border-accent bg-accent-soft"
                    : "border-rule hover:shadow-card"
                }`}
              >
                <span className="size-9 shrink-0 overflow-hidden rounded-full bg-paper-2 ring-1 ring-rule">
                  <ProductPhoto
                    photoKey={CHIP_PHOTOS[category.id] ?? "market-stall"}
                    alt=""
                    sizes="36px"
                    className="size-full rounded-full shadow-none"
                  />
                </span>
                <span
                  className={`min-w-0 text-xs font-semibold leading-tight ${
                    active ? "text-accent" : "text-ink-2"
                  }`}
                >
                  {category.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
