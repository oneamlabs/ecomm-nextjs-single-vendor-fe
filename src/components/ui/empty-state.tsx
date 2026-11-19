import Link from "next/link";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: { href: string; label: string };
}

export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-paper-2 p-8 md:p-12">
      <h2 className="text-[length:var(--text-section-s)] font-bold">{title}</h2>
      <p className="mt-3 max-w-[46ch] text-ink-2">{body}</p>
      {action && (
        <Link href={action.href} className="btn btn--primary mt-6">
          {action.label}
        </Link>
      )}
    </div>
  );
}
