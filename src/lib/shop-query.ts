export const PRICE_MIN_RUPEES = 0;
export const PRICE_MAX_RUPEES = 1500;
export const PAGE_SIZE = 12;

export interface ShopQuery {
  category?: string;
  tags?: string[];
  diets?: string[];
  vendors?: string[];
  certifications?: string[];
  q?: string;
  sort?: string;
  min?: number;
  max?: number;
  discount?: number;
  stock?: string;
  page?: number;
}

/**
 * One URL builder for every filter control, so changing a filter never drops
 * the others. Defaults are omitted: popular sort, page one, the full price
 * range and an empty page.
 */
export function buildShopHref(
  query: ShopQuery,
  overrides: Partial<ShopQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (merged.category) params.set("category", merged.category);
  if (merged.q) params.set("q", merged.q);
  if (merged.vendors) {
    for (const vendor of merged.vendors) params.append("vendor", vendor);
  }
  if (merged.certifications) {
    for (const certification of merged.certifications) {
      params.append("certification", certification);
    }
  }
  if (merged.diets) {
    for (const diet of merged.diets) params.append("diet", diet);
  }
  if (merged.tags) {
    for (const tag of merged.tags) params.append("tag", tag);
  }
  if (merged.min !== undefined && merged.min > PRICE_MIN_RUPEES) {
    params.set("min", String(merged.min));
  }
  if (merged.max !== undefined && merged.max < PRICE_MAX_RUPEES) {
    params.set("max", String(merged.max));
  }
  if (merged.discount) params.set("discount", String(merged.discount));
  if (merged.stock) params.set("stock", merged.stock);
  if (merged.sort && merged.sort !== "popular") params.set("sort", merged.sort);
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));

  const search = params.toString();
  return search ? `/shop?${search}` : "/shop";
}
