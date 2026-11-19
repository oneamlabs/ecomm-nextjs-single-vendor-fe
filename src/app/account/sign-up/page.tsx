import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create an account - Kraya",
  description: "Create a Kraya customer account.",
  robots: { index: false, follow: true },
};

export default function SignUpPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[30rem]">
        <header>
          <h1 className="text-[length:var(--text-page-title)]">Create an account</h1>
          <p className="mt-2 text-sm text-ink-2">
            Keep your orders and addresses together. It takes a moment.
          </p>
        </header>

        <AuthForm mode="sign-up" next="/account" />

        <p className="mt-8 rounded-[var(--radius-sm)] bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Demo sign-up.</strong> Accounts are
          created in memory for this session only. There is no real authentication, no
          email verification and nothing is stored on a server.
        </p>
      </div>
    </PageShell>
  );
}
