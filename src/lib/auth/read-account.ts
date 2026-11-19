import "server-only";

import { cache } from "react";
import { serverApi } from "@/lib/api";
import { isMissingResource } from "@/lib/api/errors";
import type { AccountResponse } from "@/lib/auth/types";

/**
 * Read the signed-in customer's account, or `undefined` when signed out.
 *
 * Signed out is not an error: the pages render the sign-in prompt. Any other
 * failure is rethrown so it reaches the error boundary rather than looking like
 * a signed-out state.
 *
 * Wrapped in `React.cache` because the account layout and the page both need it
 * in the same render. Without this the session cookie is read twice per request.
 */
export const readAccountOrNull = cache(
  async (): Promise<AccountResponse | undefined> => {
    try {
      return await serverApi.getAccount();
    } catch (error) {
      if (isMissingResource(error)) return undefined;
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "unauthenticated"
      ) {
        return undefined;
      }
      throw error;
    }
  },
);
