"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPinIcon,
  PackageIcon,
  SignOutIcon,
  SquaresFourIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserApi } from "@/lib/api/browser";
import type { AccountResponse } from "@/lib/auth/types";

/**
 * The account section navigation. Real routes, not in-page anchors, so each
 * section is linkable, back/forward works, and the current page is derived from
 * the URL rather than a local click state.
 */
export const ACCOUNT_SECTIONS = [
  { href: "/account", label: "Overview", Icon: SquaresFourIcon },
  { href: "/account/orders", label: "Orders", Icon: PackageIcon },
  { href: "/account/addresses", label: "Addresses", Icon: MapPinIcon },
  { href: "/account/profile", label: "Profile", Icon: UserCircleIcon },
] as const;

export function AccountSidebar({ account }: { account: AccountResponse }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const { profile, orders, addresses } = account;

  async function signOut() {
    setSigningOut(true);
    try {
      await browserApi.signOut();
      router.push("/account/sign-in");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <aside aria-label="Account sections" className="min-w-0">
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper lg:sticky lg:top-24">
        <div className="flex items-center gap-3 border-b border-rule p-4">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent"
          >
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-ink">
              {profile.name}
            </span>
            <span className="block truncate text-xs text-muted">{profile.email}</span>
          </span>
        </div>

        <nav aria-label="Account pages" className="p-2">
          <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:gap-0.5">
            {ACCOUNT_SECTIONS.map((section) => {
              const { Icon } = section;
              const isActive = pathname === section.href;
              const count =
                section.href === "/account/orders"
                  ? orders.length
                  : section.href === "/account/addresses"
                    ? addresses.length
                    : undefined;

              return (
                <li key={section.href} className="shrink-0 lg:shrink">
                  <Link
                    href={section.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm transition ${
                      isActive
                        ? "bg-accent-soft font-semibold text-accent-hover"
                        : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                    }`}
                  >
                    <Icon
                      size={18}
                      weight={isActive ? "fill" : "regular"}
                      aria-hidden="true"
                      className="shrink-0"
                    />
                    <span className="whitespace-nowrap">{section.label}</span>
                    {count !== undefined && (
                      <span className="num ml-auto rounded-[var(--radius-pill)] bg-paper-2 px-2 py-0.5 text-xs font-semibold text-ink-2">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-rule p-2">
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex min-h-11 w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm text-ink-2 transition hover:bg-sale-soft hover:text-sale disabled:opacity-50"
          >
            <SignOutIcon size={18} aria-hidden="true" className="shrink-0" />
            <span className="whitespace-nowrap">
              {signingOut ? "Signing out…" : "Sign out"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
