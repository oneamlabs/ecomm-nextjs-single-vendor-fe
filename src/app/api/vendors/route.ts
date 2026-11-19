import { NextResponse } from "next/server";
import { readVendors } from "@/lib/api/mock-backend";
import { toApiErrorResponse } from "@/lib/api/responses";
import type { VendorListResponse } from "@/lib/api/types";

/** GET /api/vendors */
export function GET() {
  try {
    return NextResponse.json<VendorListResponse>(readVendors());
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
