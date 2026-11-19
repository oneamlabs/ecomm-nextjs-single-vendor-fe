"use client";

import Link from "next/link";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { PageShell } from "@/components/layout/page-shell";

/**
 * Route-level error boundary. It states what happened plainly, offers a single
 * retry, and never pretends the failed render succeeded.
 */
export default function AppError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <PageShell>
      <div className="panel-quiet mt-10 max-w-[54ch] p-8">
        <span className="grid size-11 place-items-center rounded-full bg-paper text-sale shadow-card">
          <WarningCircleIcon size={24} weight="duotone" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-[length:var(--text-page-title)]">This page failed to load</h1>
        <p className="mt-3 text-ink-2">
          Something went wrong while rendering. Nothing was charged and no data was sent.
          Try again, or head back to the range.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => retry()} className="btn btn--primary">
            Try again
          </button>
          <Link href="/shop" className="btn">
            Shop the range
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
