import type { ReactNode } from "react";

const tones: Record<string, string> = {
  none: "",
  "paper-2": "bg-paper-2",
  "accent-soft": "bg-accent-soft",
  pantry: "shelf-pantry",
  drinks: "shelf-drinks",
  fresh: "shelf-fresh",
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
    <section
      id={id}
      className={`${spacing[space]} ${tones[tone]} ${className}`}
    >
      {contained ? <div className="container">{children}</div> : children}
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  lede?: string;
  className?: string;
}

/**
 * Section headings stack a title over one short paragraph. No split header,
 * no eyebrow, no floating explainer.
 */
export function SectionHeader({
  title,
  lede,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`max-w-[44ch] ${className}`}>
      <h2>{title}</h2>
      {lede && <p className="mt-4 max-w-[48ch] text-ink-2">{lede}</p>}
    </div>
  );
}
