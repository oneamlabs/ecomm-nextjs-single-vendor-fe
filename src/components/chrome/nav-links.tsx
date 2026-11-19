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
                className={`flex min-h-11 items-center justify-between border-l-2 px-3 py-2.5 ${
                  active
                    ? "border-accent font-semibold text-ink"
                    : "border-transparent text-ink-2 hover:border-rule-strong hover:text-ink"
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
              className={`inline-flex h-[var(--nav-height)] items-center gap-1.5 border-b-2 px-2.5 text-sm transition-colors duration-200 ${
                active
                  ? "border-accent text-ink"
                  : "border-transparent text-ink-2 hover:border-rule-strong hover:text-ink"
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
