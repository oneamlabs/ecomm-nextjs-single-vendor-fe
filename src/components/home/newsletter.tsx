"use client";

import { EnvelopeSimpleIcon } from "@phosphor-icons/react";
import { useId, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);
  const statusId = useId();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!EMAIL.test(email.trim())) {
      setInvalid(true);
      setMessage("Enter an email address in the form name@example.com.");
      return;
    }

    setInvalid(false);
    setEmail("");
    setMessage("Thanks. This demo does not store subscriptions.");
  }

  return (
    <section aria-labelledby="newsletter-title" className="container py-6 md:py-8">
      <div className="rounded-[var(--radius-lg)] bg-accent-soft px-5 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-accent shadow-card">
              <EnvelopeSimpleIcon size={22} weight="duotone" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="newsletter-title"
                className="font-body text-lg font-bold text-ink"
              >
                Get Organic Deals &amp; Updates
              </h2>
              <p className="mt-0.5 text-sm text-ink-2">
                Be the first to know about new products, offers and seasonal harvests.
              </p>
            </div>
          </div>

          <form
            onSubmit={submit}
            noValidate
            className="w-full md:ml-auto md:max-w-xl"
          >
            <div className="flex items-center gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={invalid ? true : undefined}
                aria-describedby={statusId}
                className="field h-11 min-h-11 border-rule bg-paper"
              />
              <button type="submit" className="btn btn--primary shrink-0">
                Subscribe
              </button>
            </div>
            <p
              id={statusId}
              aria-live="polite"
              className={`mt-1.5 min-h-[1lh] text-xs ${
                invalid ? "text-error" : "text-ink-2"
              }`}
            >
              {message}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
