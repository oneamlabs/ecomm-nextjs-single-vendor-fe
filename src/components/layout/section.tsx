import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

const tones: Record<string, string> = {
  none: "",
  "paper-2": "bg-paper-2",
  "accent-soft": "bg-accent-soft",
};

const spacing: Record<string, string> = {
  none: "",
  sm: "py-[var(--section-gap-s)]",
  md: "py-[var(--section-gap)]",
};

interface SectionProps {
  children: ReactNode;
  tone?: keyof typeof tones;
  space?: keyof typeof spacing;
  contained?: boolean;
  className?: string;
  id?: string;
}

export function Section({
  children,
  tone = "none",
  space = "sm",
  contained = true,
  className = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${spacing[space]} ${tones[tone]} ${className}`}>
      {contained ? <div className="container">{children}</div> : children}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  lede?: string;
  action?: { href: string; label: string };
  className?: string;
}

/**
 * Section headings pair a title and one short line with an optional trailing
 * link, so a section names its own "see everything" target.
 */
export function SectionHeader({
  title,
  lede,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-2 ${className}`}
    >
      <div className="max-w-[52ch]">
        <h2 className="text-[length:var(--text-section)]">{title}</h2>
        {lede && <p className="mt-1 text-sm text-muted">{lede}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="link-quiet inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
        >
          {action.label}
          <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
