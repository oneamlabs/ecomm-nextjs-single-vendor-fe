"use client";

import { useRouter } from "next/navigation";

interface ShopSortProps {
  value: string;
  category?: string;
  tags: string[];
}

export function ShopSort({ value, category, tags }: ShopSortProps) {
  const router = useRouter();

  function change(sort: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    for (const tag of tags) params.append("tag", tag);
    if (sort !== "name") params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span>Sort</span>
      <select
        value={value}
        onChange={(event) => change(event.target.value)}
        className="h-11 rounded-[var(--radius-md)] border border-rule bg-paper px-3 text-sm text-ink"
      >
        <option value="name">Name, A to Z</option>
        <option value="price">Price, low first</option>
      </select>
    </label>
  );
}
