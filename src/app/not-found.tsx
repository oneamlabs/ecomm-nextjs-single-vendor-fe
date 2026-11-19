import Link from "next/link";
import { PageHeader } from "@/components/chrome/page-header";
import { PageShell } from "@/components/layout/page-shell";

export default function NotFound() {
  return (
    <PageShell>
      <PageHeader
        title="No such page"
        lede="That address does not belong to anything here. The whole range is one link away."
        actions={
          <>
            <Link href="/shop" className="btn btn--primary">
              Shop the range
            </Link>
            <Link href="/" className="btn">
              Back to the front
            </Link>
          </>
        }
      />
    </PageShell>
  );
}
