import { Suspense } from "react";
import { serverApi } from "@/lib/api";
import { AccountLink } from "./account-link";
import { HeaderAccount } from "./header-account";
import { HeaderClient } from "./header-client";

export async function SiteHeader() {
  // Categories are public and cached; the account link reads the session cookie
  // and streams in behind its own boundary, so the rest of the header still
  // prerenders into the static shell.
  const { items: categories } = await serverApi.getCategories();

  return (
    <HeaderClient
      categories={categories}
      account={
        <Suspense fallback={<AccountLink profile={null} />}>
          <HeaderAccount />
        </Suspense>
      }
    />
  );
}

