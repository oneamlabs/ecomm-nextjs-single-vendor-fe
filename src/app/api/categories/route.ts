import { NextResponse } from "next/server";
import { readCategories } from "@/lib/api/mock-backend";
import { toApiErrorResponse } from "@/lib/api/responses";
import type { CategoryListResponse } from "@/lib/api/types";

/** GET /api/categories */
export function GET() {
  try {
    return NextResponse.json<CategoryListResponse>(readCategories());
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
