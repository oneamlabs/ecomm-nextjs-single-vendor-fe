import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { DEMO_CREDENTIALS } from "@/lib/auth/demo";

export const metadata: Metadata = {
  title: "Sign in - Kraya",
  description: "Sign in to your Kraya customer account.",
  robots: { index: false, follow: true },
};

export default function SignInPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-[30rem]">
        <header>
          <h1 className="text-[length:var(--text-page-title)]">Sign in</h1>
          <p className="mt-2 text-sm text-ink-2">
            Your orders, addresses and saved list, in one place.
          </p>
        </header>

        <AuthForm mode="sign-in" next="/account" />

        <p className="mt-8 rounded-[var(--radius-sm)] bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-2">
          <strong className="font-semibold text-ink">Demo account.</strong> The form is
          pre-filled with
          <span className="num font-semibold text-ink"> {DEMO_CREDENTIALS.email} </span>
          and the password
          <span className="num font-semibold text-ink"> {DEMO_CREDENTIALS.password}</span>, so
          signing in is one click. There is no real authentication here: the session is a
          demo cookie and nothing is verified against a server.
        </p>
      </div>
    </PageShell>
  );
}
