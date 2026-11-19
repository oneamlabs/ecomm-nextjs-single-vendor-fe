"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { WishlistCount } from "@/components/wishlist/wishlist-count";

export interface NavLinkItem {
  href: string;
  label: string;
}

interface NavListProps {
  links: NavLinkItem[];
  activeHref: string | null;
  mobile?: boolean;
  onNavigate?: () => void;
}

function matches(href: string, pathname: string, search: string) {
  const [path, query = ""] = href.split("?");
  if (path !== pathname) return false;

  const linkParams = new URLSearchParams(query);
  const currentParams = new URLSearchParams(search);

  if (linkParams.size === 0) return currentParams.size === 0;

  for (const [key, value] of linkParams) {
    if (currentParams.get(key) !== value) return false;
  }
  return true;
}

export function NavList({
  links,
  activeHref,
  mobile = false,
  onNavigate,
}: NavListProps) {
  return (
    <>
      {links.map((link) => {
        const active = link.href === activeHref;

        if (mobile) {
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center justify-between rounded-[var(--radius-pill)] px-3 py-2.5 ${
                  active ? "bg-paper-2 text-ink" : "text-ink-2 hover:bg-paper-2"
                }`}
              >
                <span>{link.label}</span>
                {link.href === "/wishlist" && <WishlistCount />}
              </Link>
            </li>
          );
        }

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-pill)] px-3.5 py-2 transition-colors duration-200 hover:bg-paper-2 ${
                active ? "bg-paper-2 text-ink" : "text-ink-2"
              }`}
            >
              {link.label}
              {link.href === "/wishlist" && <WishlistCount />}
            </Link>
          </li>
        );
      })}
    </>
  );
}

export function NavLinks({
  links,
  mobile = false,
  onNavigate,
}: {
  links: NavLinkItem[];
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const activeHref =
    links.find((link) => matches(link.href, pathname, search))?.href ?? null;

  return (
    <NavList
      links={links}
      activeHref={activeHref}
      mobile={mobile}
      onNavigate={onNavigate}
    />
  );
}
