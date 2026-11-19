import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import type { Address, CustomerProfile, Order } from "./types";

/**
 * Demo session handling.
 *
 * This is a mock, not authentication. There is no database, no password hashing
 * and no server-side session store: the cookie is a signed identity token that
 * this demo trusts. It exists so the account flow has realistic shape (an
 * httpOnly cookie, server-side reads, a sign-out that clears both). A real
 * deployment must replace every function here with a verified session from an
 * auth provider; nothing above this module assumes the demo behaviour.
 */

const COOKIE = "kraya-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** The parts of a customer record that a session may carry. */
export const sessionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export type Session = z.infer<typeof sessionSchema>;

/**
 * A demo "signature": a stable digest of the payload plus a fixed salt. It is
 * deliberately not a real HMAC, because claiming cryptographic integrity here
 * would be worse than admitting this is a demo. Its only job is to make a
 * hand-edited cookie fail closed instead of silently signing someone in.
 */
function seal(payload: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < payload.length; index += 1) {
    hash ^= payload.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

function encode(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
  return `${payload}.${seal(payload)}`;
}

function decode(value: string): Session | undefined {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return undefined;
  if (seal(payload) !== signature) return undefined;

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    const result = sessionSchema.safeParse(parsed);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export async function readSession(): Promise<Session | undefined> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  return raw ? decode(raw) : undefined;
}

export async function writeSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, encode(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** The public profile a client may see: no password, no internal fields. */
export function toProfile(customer: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  memberSince?: string;
}): CustomerProfile {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: customer.city,
    memberSince: customer.memberSince,
  };
}

export type { Address, CustomerProfile, Order };
