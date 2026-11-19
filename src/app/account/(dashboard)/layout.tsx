import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { AccountSidebar } from "@/components/auth/account-sidebar";
import { SignedOutPrompt } from "@/components/auth/signed-out-prompt";
import { readAccountOrNull } from "@/lib/auth/read-account";

/**
 * Reading the session is runtime data, so these routes block rather than
 * prerender. Declaring it once here covers every account page beneath the group.
 */
export const instant = false;

/**
 * The account section frame: sidebar beside the page, or the sign-in prompt when
 * there is no session. Individual pages own only their own section.
 *
 * `readAccountOrNull` is wrapped in `React.cache`, so this read and the page's
 * read share one lookup per request.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const account = await readAccountOrNull();

  if (!account) {
    return (
      <PageShell>
        <SignedOutPrompt />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
        <AccountSidebar account={account} />
        <div className="min-w-0">{children}</div>
      </div>
    </PageShell>
  );
}
