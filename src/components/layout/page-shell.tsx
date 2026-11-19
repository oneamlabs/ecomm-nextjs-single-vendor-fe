import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * The standard content page frame: one container, one top/bottom rhythm.
 * Home is the only page that starts with a full-bleed hero instead.
 */
export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`container pb-16 pt-10 md:pt-14 ${className}`}>
      {children}
    </div>
  );
}
