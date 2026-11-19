import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";

/** Shown on every account page when there is no session. */
export function SignedOutPrompt() {
  return (
    <PageHeader
      title="Sign In / Register"
      lede="Sign in to see your orders, addresses and details. The cart and saved list work without an account."
      actions={
        <>
          <Link href="/account/sign-in" className="btn btn--primary">
            Sign in
          </Link>
          <Link href="/account/sign-up" className="btn">
            Create account
          </Link>
        </>
      }
    />
  );
}
