import { NextResponse } from "next/server";
import { readAccount, register, signUpSchema } from "@/lib/auth/customers";
import { fieldErrors } from "@/lib/auth/fields";
import { writeSession } from "@/lib/auth/session";
import { badRequest, toApiErrorResponse } from "@/lib/api/responses";
import type { SessionResponse } from "@/lib/api/types";

/** POST /api/auth/sign-up — creates an in-memory demo account. */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Check the fields marked in red.", fieldErrors(parsed.error));
    }

    const customer = register(parsed.data);
    if (!customer) {
      return badRequest("An account with that email already exists.", {
        email: "An account with that email already exists.",
      });
    }

    await writeSession({ id: customer.id, name: customer.name, email: customer.email });

    return NextResponse.json<SessionResponse>({ profile: readAccount(customer).profile });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
