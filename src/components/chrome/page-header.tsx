import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
  size?: "display" | "section";
}

/**
 * The standard page header. One title, one short lede, optional actions.
 * Every content route uses this so the first screen reads the same.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  size = "display",
}: PageHeaderProps) {
  const sizeClass =
    size === "display"
      ? "text-[length:var(--text-page-title)]"
      : "text-[length:var(--text-section-s)]";

  return (
    <header className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[42ch]">
        {eyebrow && <p className="tag mb-4">{eyebrow}</p>}
        <h1 className={sizeClass}>{title}</h1>
        {lede && <p className="lead mt-4 text-ink-2">{lede}</p>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </header>
  );
}
