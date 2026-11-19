import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";
import { toApiErrorResponse } from "@/lib/api/responses";

/** POST /api/auth/sign-out — clears the session cookie. */
export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ signedIn: false });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
