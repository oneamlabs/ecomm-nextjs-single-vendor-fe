import { serverApi } from "@/lib/api";
import { AccountLink } from "./account-link";

/**
 * Reads the session cookie, so it must be rendered behind a Suspense boundary.
 * Signed out is the normal case and is not an error.
 */
export async function HeaderAccount() {
  const session = await serverApi.getSession().catch(() => null);
  return <AccountLink profile={session?.profile ?? null} />;
}
