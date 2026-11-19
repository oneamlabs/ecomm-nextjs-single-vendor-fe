"use client";

import { useRouter } from "next/navigation";
import { buildShopHref, type ShopQuery } from "@/lib/shop-query";

interface ShopSortProps {
  value: string;
  query: ShopQuery;
}

export function ShopSort({ value, query }: ShopSortProps) {
  const router = useRouter();

  function change(sort: string) {
    router.replace(buildShopHref(query, { sort, page: 1 }), { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      <span className="shrink-0 font-medium">Sort by:</span>
      <select
        value={value}
        onChange={(event) => change(event.target.value)}
        className="h-9 rounded-[var(--radius-sm)] border border-rule bg-paper px-3 text-sm text-ink"
      >
        <option value="popular">Popular</option>
        <option value="price">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name, A to Z</option>
      </select>
    </label>
  );
}
