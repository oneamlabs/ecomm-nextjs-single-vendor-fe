import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { toApiErrorResponse } from "@/lib/api/responses";
import type { SessionResponse } from "@/lib/api/types";

/** GET /api/auth/session — the current session, or `null` when signed out. */
export async function GET() {
  try {
    const session = await readSession();
    if (!session) return NextResponse.json<SessionResponse | null>(null);

    return NextResponse.json<SessionResponse>({
      profile: {
        id: session.id,
        name: session.name,
        email: session.email,
      },
    });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}
