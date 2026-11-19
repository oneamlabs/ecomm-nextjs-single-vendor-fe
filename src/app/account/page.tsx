import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Account - Kraya",
  description: "Sign in to Kraya.",
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return (
    <PageShell>
      <PageHeader
        title="Sign In / Register"
        lede="Accounts are not part of this demo. Your cart and saved list still work without one."
        actions={
          <>
            <Link href="/basket" className="btn btn--primary">
              View cart
            </Link>
            <Link href="/wishlist" className="btn">
              View saved
            </Link>
          </>
        }
      />
    </PageShell>
  );
}
