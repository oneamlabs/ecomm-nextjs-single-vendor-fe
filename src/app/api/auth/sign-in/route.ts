import { NextResponse } from "next/server";
import { authenticate, readAccount, signInSchema } from "@/lib/auth/customers";
import { fieldErrors } from "@/lib/auth/fields";
import { writeSession } from "@/lib/auth/session";
import { badRequest, toApiErrorResponse, unauthenticated } from "@/lib/api/responses";
import type { SessionResponse } from "@/lib/api/types";

/** POST /api/auth/sign-in — compares the demo password, then sets the cookie. */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Check the fields marked in red.", fieldErrors(parsed.error));
    }

    const customer = authenticate(parsed.data.email, parsed.data.password);
    if (!customer) {
      return unauthenticated("That email and password do not match an account.");
    }

    await writeSession({ id: customer.id, name: customer.name, email: customer.email });

    return NextResponse.json<SessionResponse>({ profile: readAccount(customer).profile });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
