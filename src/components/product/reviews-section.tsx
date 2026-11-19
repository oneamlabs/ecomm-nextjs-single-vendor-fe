"use client";

import {
  CheckCircleIcon,
  PencilSimpleIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { useId, useState } from "react";
import {
  ratingBreakdown,
  type ProductReview,
} from "@/lib/reviews";

interface ReviewsSectionProps {
  productName: string;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  plain?: boolean;
}

export function ReviewsSection({
  productName,
  rating,
  reviewCount,
  reviews,
  plain = false,
}: ReviewsSectionProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [stars, setStars] = useState("5");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const id = useId();
  const buckets = ratingBreakdown(rating, reviewCount);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError("Enter a name of at least two characters.");
      setMessage("");
      return;
    }
    if (text.trim().length < 10) {
      setError("Write at least ten characters.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("Thanks. Reviews are not stored in this demo.");
    setName("");
    setStars("5");
    setText("");
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={
        plain
          ? "min-w-0"
          : "min-w-0 rounded-[var(--radius-md)] border border-rule bg-paper p-4 sm:p-5"
      }
    >
      <h2
        id={`${id}-heading`}
        className="font-body text-lg font-bold text-ink"
      >
        Customer Reviews
      </h2>

      <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div>
          <div className="flex items-end gap-2">
            <span className="font-display text-4xl font-bold leading-none text-ink">
              {rating.toFixed(1)}
            </span>
            <span className="pb-1 text-sm text-muted">/ 5</span>
          </div>

          <Stars rating={rating} className="mt-2" />
          <p className="mt-1 text-xs text-muted">
            Based on {reviewCount} reviews
          </p>

          <ul className="mt-4 grid gap-1.5">
            {buckets.map((bucket) => (
              <li key={bucket.stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 shrink-0 text-muted">{bucket.stars} ★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-rule">
                  <span
                    className="block h-full rounded-full bg-accent"
                    style={{ width: `${bucket.percent}%` }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right text-muted">
                  {bucket.percent}%
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={`${id}-form`}
            className="btn btn--outline mt-4 min-h-10 w-full text-xs"
          >
            <PencilSimpleIcon size={15} weight="bold" aria-hidden="true" />
            Write a Review
          </button>

          {open && (
            <form
              id={`${id}-form`}
              onSubmit={submit}
              noValidate
              className="mt-3 rounded-[var(--radius-sm)] border border-rule bg-paper-2/50 p-3"
            >
              <div className="grid gap-2">
                <div>
                  <label
                    htmlFor={`${id}-name`}
                    className="text-xs font-semibold text-ink-2"
                  >
                    Name
                  </label>
                  <input
                    id={`${id}-name`}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="field mt-1 h-9 min-h-9 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${id}-stars`}
                    className="text-xs font-semibold text-ink-2"
                  >
                    Rating
                  </label>
                  <select
                    id={`${id}-stars`}
                    value={stars}
                    onChange={(event) => setStars(event.target.value)}
                    className="mt-1 h-9 w-full rounded-[var(--radius-sm)] border border-rule-strong bg-paper px-2 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} {value === 1 ? "star" : "stars"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor={`${id}-text`}
                    className="text-xs font-semibold text-ink-2"
                  >
                    Review
                  </label>
                  <textarea
                    id={`${id}-text`}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={3}
                    className="field mt-1 py-2 text-sm"
                    placeholder={`How was the ${productName}?`}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn--primary mt-3 min-h-9 w-full text-xs">
                Submit Review
              </button>
              <p aria-live="polite" className="mt-2 min-h-[1lh] text-xs text-error">
                {error}
              </p>
              <p aria-live="polite" className="mt-1 min-h-[1lh] text-xs text-muted">
                {message}
              </p>
            </form>
          )}
        </div>

        <ul className="grid content-start gap-4">
          {reviews.map((review) => (
            <li key={`${review.name}-${review.date}`} className="border-t border-rule-2 pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-start gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-accent">
                        <CheckCircleIcon size={11} weight="fill" aria-hidden="true" />
                        Verified Purchase
                      </span>
                    )}
                    <span className="ml-auto text-[11px] text-muted">{review.date}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Stars rating={review.rating} size={11} />
                    <span className="text-xs font-semibold text-ink">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                    {review.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars({
  rating,
  size = 15,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((value) => (
        <StarIcon
          key={value}
          size={size}
          weight="fill"
          className={value <= Math.round(rating) ? "text-star" : "text-rule-strong"}
        />
      ))}
    </span>
  );
}
