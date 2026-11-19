import { NextResponse } from "next/server";
import { readAccount } from "@/lib/auth/customers";
import { getCustomerById } from "@/lib/auth/customers";
import { readSession } from "@/lib/auth/session";
import { toApiErrorResponse, unauthenticated } from "@/lib/api/responses";
import type { AccountResponse } from "@/lib/api/types";

/**
 * GET /api/account — the signed-in customer's dashboard.
 *
 * The session is the only source of identity. The client cannot ask for another
 * customer's account by changing an id, which is the point of reading it here
 * rather than in a component.
 */
export async function GET() {
  try {
    const session = await readSession();
    if (!session) return unauthenticated("Sign in to view your account.");

    const customer = getCustomerById(session.id);
    if (!customer) return unauthenticated("That session is no longer valid.");

    return NextResponse.json<AccountResponse>(readAccount(customer));
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
