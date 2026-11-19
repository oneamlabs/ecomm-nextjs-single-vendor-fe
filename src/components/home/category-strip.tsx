import Link from "next/link";
import { ProductPhoto } from "@/components/product/product-photo";
import type { Category } from "@/lib/types";

const CATEGORY_PHOTOS: Record<string, string> = {
  snacks: "coffee-green",
  grains: "spices-dark",
  pulses: "sloe-berries",
  oils: "olives-harvest",
  sweeteners: "honeycomb-frame",
  breakfast: "sourdough-loaf",
  spices: "chillies-market",
  beverages: "coffee-roasted",
  combos: "market-stall",
};

interface CategoryStripProps {
  categories: Category[];
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  const items = [
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      href: `/shop?category=${category.id}`,
      photo: CATEGORY_PHOTOS[category.id] ?? "market-stall",
      isNew: false,
    })),
    {
      id: "new-arrivals",
      name: "New Arrivals",
      href: "/shop",
      photo: "apples-crate",
      isNew: true,
    },
  ];

  return (
    <section aria-label="Shop by category" className="border-b border-rule bg-paper">
      <div className="container">
        <ul className="grid grid-cols-5 gap-x-2 gap-y-4 py-5 sm:grid-cols-6 lg:grid-cols-10">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex flex-col items-center gap-2 rounded-[var(--radius-md)] px-1 py-1 text-center transition hover:bg-accent-soft"
              >
                <span className="relative">
                  <span className="block size-14 overflow-hidden rounded-full bg-paper-2 ring-1 ring-rule transition duration-300 group-hover:ring-accent sm:size-16">
                    <ProductPhoto
                      photoKey={item.photo}
                      alt=""
                      sizes="64px"
                      className="size-full rounded-full shadow-none"
                    />
                  </span>
                  {item.isNew && (
                    <span className="absolute -right-1 -top-1 rounded-[var(--radius-sm)] bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-ink">
                      New
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-medium leading-tight text-ink-2 transition group-hover:text-ink sm:text-xs lg:whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
