import { NextResponse } from "next/server";
import { readProductDetail } from "@/lib/api/mock-backend";
import { notFound, toApiErrorResponse } from "@/lib/api/responses";
import type { ProductDetailResponse } from "@/lib/api/types";

/** GET /api/products/[id]/detail — the product page bundle. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const bundle = readProductDetail(id);
    if (!bundle) return notFound(`No product with id "${id}".`);

    return NextResponse.json<ProductDetailResponse>(bundle);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
