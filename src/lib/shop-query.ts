import { z } from "zod";
import { DIET_IDS } from "./diets.ts";

export const PRICE_MIN_RUPEES = 0;
export const PRICE_MAX_RUPEES = 1500;
export const PAGE_SIZE = 12;

export const DISCOUNT_THRESHOLDS = [10, 20, 30, 40] as const;

export const SORT_VALUES = ["popular", "price", "price-desc", "name"] as const;

/**
 * One schema for the catalogue's shareable state. Everything arriving from the
 * URL is untrusted: unknown values fall back to defaults rather than throwing,
 * so a hand-edited query string never breaks the page.
 */
export const shopParamsSchema = z.object({
  category: z.string().trim().min(1).optional().catch(undefined),
  tag: z.array(z.string()).catch([]),
  diet: z
    .array(z.string())
    .transform((items) => items.filter((item) => (DIET_IDS as readonly string[]).includes(item)))
    .catch([]),
  vendor: z.array(z.string()).catch([]),
  certification: z.array(z.string()).catch([]),
  q: z.string().trim().min(1).max(120).optional().catch(undefined),
  sort: z.enum(SORT_VALUES).catch("popular"),
  min: z.coerce.number().int().min(PRICE_MIN_RUPEES).catch(PRICE_MIN_RUPEES),
  max: z.coerce.number().int().max(PRICE_MAX_RUPEES).catch(PRICE_MAX_RUPEES),
  discount: z
    .coerce
    .number()
    .refine((value) => (DISCOUNT_THRESHOLDS as readonly number[]).includes(value))
    .optional()
    .catch(undefined),
  stock: z.enum(["in", "out"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1),
});

export type ParsedShopParams = z.infer<typeof shopParamsSchema>;

type RawParam = string | string[] | undefined;

function toArray(value: RawParam): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Parse an App Router `searchParams` object. Repeated keys become arrays; the
 * price range is ordered and clamped; every other field is bounded by the
 * schema above.
 */
export function parseShopParams(params: Record<string, RawParam>): ParsedShopParams {
  const parsed = shopParamsSchema.parse({
    category: params.category,
    tag: toArray(params.tag),
    diet: toArray(params.diet),
    vendor: toArray(params.vendor),
    certification: toArray(params.certification),
    q: params.q,
    sort: params.sort,
    min: params.min ?? PRICE_MIN_RUPEES,
    max: params.max ?? PRICE_MAX_RUPEES,
    discount: params.discount,
    stock: params.stock,
    page: params.page ?? 1,
  });

  const rawMin = Math.min(Math.max(parsed.min, PRICE_MIN_RUPEES), PRICE_MAX_RUPEES);
  const rawMax = Math.min(Math.max(parsed.max, PRICE_MIN_RUPEES), PRICE_MAX_RUPEES);
  // A hand-edited inverted range should still show a usable catalogue, so the
  // bounds are swapped rather than collapsed to a single empty price point.
  const min = Math.min(rawMin, rawMax);
  const max = Math.max(rawMin, rawMax);

  return { ...parsed, min, max };
}

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
