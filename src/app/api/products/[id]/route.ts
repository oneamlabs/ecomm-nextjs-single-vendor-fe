import { NextResponse } from "next/server";
import { readProduct } from "@/lib/api/mock-backend";
import { notFound, toApiErrorResponse } from "@/lib/api/responses";
import type { Product } from "@/lib/api/types";

/** GET /api/products/[id] */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const product = readProduct(id);
    if (!product) return notFound(`No product with id "${id}".`);

    return NextResponse.json<Product>(product);
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
