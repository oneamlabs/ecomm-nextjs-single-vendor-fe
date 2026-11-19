"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";

interface ShopFilters {
  category: string;
  tags: string[];
  sort: string;
}

interface ShopSidebarProps {
  categories: Category[];
  tags: string[];
  filters: ShopFilters;
  counts: {
    total: number;
    shelf: Record<string, number>;
    tag: Record<string, number>;
  };
}

const shelfTone: Record<string, string> = {
  pantry: "shelf-pantry",
  drinks: "shelf-drinks",
  fresh: "shelf-fresh",
};

export function ShopSidebar({ categories, tags, filters, counts }: ShopSidebarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function navigate(category: string, selected: string[]) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    for (const tag of selected) params.append("tag", tag);
    if (filters.sort !== "name") params.set("sort", filters.sort);
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  }

  function toggleTag(tag: string) {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((item) => item !== tag)
      : [...filters.tags, tag];
    navigate(filters.category, next);
  }

  const activeCount = (filters.category ? 1 : 0) + filters.tags.length;

  return (
    <aside aria-label="Catalogue filters" className="min-w-0 lg:sticky lg:top-28 lg:self-start">
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
        className={open ? "mt-5 block" : "mt-5 hidden lg:mt-0 lg:block"}
      >
        <div className="flex items-baseline justify-between gap-3 border-b border-rule pb-4">
          <h2 className="text-sm font-semibold">Filter</h2>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={() => navigate("", [])}
              className="link-quiet inline-flex min-h-11 items-center text-sm font-semibold"
            >
              Clear all
            </button>
          ) : (
            <span className="num text-sm text-muted">{counts.total} items</span>
          )}
        </div>

        <fieldset className="border-b border-rule py-5">
          <legend className="text-sm font-semibold text-muted">Shelf</legend>
          <div className="mt-2">
            <ShelfOption
              label="All shelves"
              count={counts.total}
              checked={filters.category === ""}
              onChange={() => navigate("", filters.tags)}
            />
            {categories.map((item) => (
              <ShelfOption
                key={item.id}
                label={item.name}
                count={counts.shelf[item.id] ?? 0}
                swatch={shelfTone[item.id]}
                checked={filters.category === item.id}
                onChange={() => navigate(item.id, filters.tags)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="border-b border-rule py-5">
          <legend className="text-sm font-semibold text-muted">Suitable for</legend>
          <div className="mt-2">
            {tags.map((item) => (
              <DietOption
                key={item}
                label={tagLabel(item)}
                count={counts.tag[item] ?? 0}
                checked={filters.tags.includes(item)}
                onChange={() => toggleTag(item)}
              />
            ))}
          </div>
        </fieldset>

        <div className="pt-5">
          <p className="tag">Packed here</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            Weighed and labelled on Row Street. Free delivery over £40; order by
            11:00 for same-day within eight miles.
          </p>
        </div>
      </div>
    </aside>
  );
}

function ShelfOption({
  label,
  count,
  checked,
  onChange,
  swatch,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
  swatch?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 border-b border-rule-2 py-2 text-sm last:border-b-0">
      <span className="flex min-w-0 items-center gap-2.5">
        <input
          type="radio"
          name="shop-shelf"
          checked={checked}
          onChange={onChange}
          className="size-4 shrink-0 accent-[var(--color-ink)]"
        />
        {swatch && (
          <span
            className={`size-2 shrink-0 rounded-full ${swatch}`}
            aria-hidden="true"
          />
        )}
        <span
          className={`truncate ${checked ? "font-semibold text-ink" : "text-ink-2"}`}
        >
          {label}
        </span>
      </span>
      <span className={`num shrink-0 text-sm ${checked ? "text-ink" : "text-muted"}`}>
        {count}
      </span>
    </label>
  );
}

function DietOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 border-b border-rule-2 py-2 text-sm last:border-b-0">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 shrink-0 accent-[var(--color-ink)]"
        />
        <span className={checked ? "font-semibold text-ink" : "text-ink-2"}>
          {label}
        </span>
      </span>
      <span className={`num shrink-0 text-sm ${checked ? "text-ink" : "text-muted"}`}>
        {count}
      </span>
    </label>
  );
}

function tagLabel(tag: string) {
  return tag === "gluten-free" ? "Gluten-free" : tag.charAt(0).toUpperCase() + tag.slice(1);
}
