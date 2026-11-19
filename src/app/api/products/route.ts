import { NextResponse } from "next/server";
import { listProducts } from "@/lib/api/mock-backend";
import { badRequest, toApiErrorResponse } from "@/lib/api/responses";
import type {
  ProductListQuery,
  ProductListResponse,
} from "@/lib/api/types";

/**
 * GET /api/products
 *
 * Query params mirror the storefront's shareable catalogue state. Unknown
 * values are rejected with a 400 rather than silently ignored, so a real
 * backend contract is enforceable and a typo is visible.
 */
export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = parseQuery(searchParams);
    if ("error" in query) return badRequest(query.error);

    const result = listProducts(query.value);
    return NextResponse.json<ProductListResponse>(result);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

const SORTS = ["popular", "price", "price-desc", "name"] as const;

type Parsed = { value: ProductListQuery } | { error: string };

function parseQuery(searchParams: URLSearchParams): Parsed {
  const value: ProductListQuery = {};

  const category = single(searchParams, "category");
  if (category) value.category = category;

  const q = single(searchParams, "q");
  if (q) {
    if (q.length > 120) return { error: "q must be 120 characters or fewer." };
    value.q = q;
  }

  value.tag = searchParams.getAll("tag").filter(Boolean);
  value.diet = searchParams.getAll("diet").filter(Boolean);
  value.vendor = searchParams.getAll("vendor").filter(Boolean);
  value.certification = searchParams.getAll("certification").filter(Boolean);

  const sort = single(searchParams, "sort");
  if (sort) {
    if (!(SORTS as readonly string[]).includes(sort)) {
      return { error: `sort must be one of: ${SORTS.join(", ")}.` };
    }
    value.sort = sort as ProductListQuery["sort"];
  }

  for (const key of ["min", "max", "discount", "page", "pageSize"] as const) {
    const raw = single(searchParams, key);
    if (raw === undefined) continue;
    const number = Number(raw);
    if (!Number.isInteger(number) || number < 0) {
      return { error: `${key} must be a non-negative integer.` };
    }
    value[key] = number;
  }

  if (value.min !== undefined && value.max !== undefined && value.min > value.max) {
    return { error: "min must not be greater than max." };
  }

  const stock = single(searchParams, "stock");
  if (stock) {
    if (stock !== "in" && stock !== "out") {
      return { error: 'stock must be "in" or "out".' };
    }
    value.stock = stock;
  }

  return { value };
}

function single(searchParams: URLSearchParams, key: string) {
  const value = searchParams.get(key);
  return value === null || value === "" ? undefined : value;
}
