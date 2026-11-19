"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  UserIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { browserApi } from "@/lib/api/browser";
import { ApiError } from "@/lib/api/types";
import { DEMO_CREDENTIALS } from "@/lib/auth/demo";

type Mode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: Mode;
  /** Where to go after a successful sign-in. */
  next?: string;
}

export function AuthForm({ mode, next = "/account" }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  const [values, setValues] = useState({
    name: "",
    // The demo account is pre-filled so the flow is one click. Sign-up starts
    // empty: those fields create a different account.
    email: isSignUp ? "" : DEMO_CREDENTIALS.email,
    password: isSignUp ? "" : DEMO_CREDENTIALS.password,
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setFields((current) => ({ ...current, [key]: "" }));
    setMessage("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setMessage("");

    try {
      if (isSignUp) {
        await browserApi.signUp(values);
      } else {
        await browserApi.signIn({
          email: values.email,
          password: values.password,
        });
      }

      router.push(next);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setFields(error.fields);
        setMessage(error.message);
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-[46ch]">
      <div className="grid gap-4">
        {isSignUp && (
          <Field
            id="name"
            label="Name"
            type="text"
            autoComplete="name"
            value={values.name}
            error={fields.name}
            onChange={(value) => update("name", value)}
            icon={<UserIcon size={16} aria-hidden="true" />}
          />
        )}

        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          error={fields.email}
          onChange={(value) => update("email", value)}
          icon={<EnvelopeIcon size={16} aria-hidden="true" />}
        />

        <Field
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          value={values.password}
          error={fields.password}
          onChange={(value) => update("password", value)}
          icon={<LockIcon size={16} aria-hidden="true" />}
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="grid size-11 place-items-center text-muted transition hover:text-ink"
            >
              {showPassword ? (
                <EyeSlashIcon size={17} aria-hidden="true" />
              ) : (
                <EyeIcon size={17} aria-hidden="true" />
              )}
            </button>
          }
        />

        {isSignUp && (
          <Field
            id="confirm"
            label="Confirm password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.confirm}
            error={fields.confirm}
            onChange={(value) => update("confirm", value)}
            icon={<LockIcon size={16} aria-hidden="true" />}
          />
        )}
      </div>

      {message && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-sale-soft px-3 py-2 text-sm text-sale"
        >
          <WarningCircleIcon size={16} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn btn--primary mt-5 min-h-12 w-full"
      >
        {submitting
          ? isSignUp
            ? "Creating account…"
            : "Signing in…"
          : isSignUp
            ? "Create account"
            : "Sign in"}
        <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
      </button>

      <p className="mt-4 text-center text-sm text-muted">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <Link href="/account/sign-in" className="link-quiet font-semibold text-accent">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Kraya?{" "}
            <Link href="/account/sign-up" className="link-quiet font-semibold text-accent">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email";
  onChange: (value: string) => void;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}

function Field({
  id,
  label,
  type,
  value,
  error,
  autoComplete,
  inputMode,
  onChange,
  icon,
  trailing,
}: FieldProps) {
  const errorId = `auth-${id}-error`;

  return (
    <div>
      <label htmlFor={`auth-${id}`} className="block text-sm font-semibold text-ink-2">
        {label}
      </label>
      <div className="relative mt-2 flex items-center">
        <span className="pointer-events-none absolute left-3 text-muted">{icon}</span>
        <input
          id={`auth-${id}`}
          name={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`field ${trailing ? "pr-12" : ""} pl-10`}
        />
        {trailing && <span className="absolute right-0">{trailing}</span>}
      </div>
      <p id={errorId} className="mt-1.5 min-h-[1lh] text-sm text-error">
        {error ?? ""}
      </p>
    </div>
  );
}
