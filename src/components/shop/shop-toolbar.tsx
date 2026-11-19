import Link from "next/link";
import type { Category } from "@/lib/types";
import { ShopSort } from "./shop-sort";

interface ShopToolbarProps {
  count: number;
  category?: Category;
  tags: string[];
  sort: string;
}

export function ShopToolbar({ count, category, tags, sort }: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <p aria-live="polite" className="tag">
          {count} {count === 1 ? "item" : "items"}
        </p>

        {category && (
          <Link
            href={href({ tags, sort })}
            aria-label={`Remove ${category.name} shelf filter`}
            className="tag hover:text-ink"
          >
            {category.name} <span aria-hidden="true">×</span>
          </Link>
        )}

        {tags.map((tag) => (
          <Link
            key={tag}
            href={href({
              category: category?.id,
              tags: tags.filter((item) => item !== tag),
              sort,
            })}
            aria-label={`Remove ${tagLabel(tag)} filter`}
            className="tag hover:text-ink"
          >
            {tagLabel(tag)} <span aria-hidden="true">×</span>
          </Link>
        ))}

        {(category || tags.length > 0) && (
          <Link
            href={href({ sort })}
            className="link-quiet inline-flex min-h-11 items-center text-sm font-semibold"
          >
            Clear all
          </Link>
        )}
      </div>

      <ShopSort value={sort} category={category?.id} tags={tags} />
    </div>
  );
}

function href(filters: { category?: string; tags?: string[]; sort?: string }) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  for (const tag of filters.tags ?? []) params.append("tag", tag);
  if (filters.sort && filters.sort !== "name") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
}

function tagLabel(tag: string) {
  return tag === "gluten-free" ? "Gluten-free" : tag.charAt(0).toUpperCase() + tag.slice(1);
}
