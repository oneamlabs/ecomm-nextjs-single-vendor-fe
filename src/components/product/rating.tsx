import { formatCount } from "@/lib/money";

interface RatingProps {
  rating?: number;
  reviewCount?: number;
  className?: string;
}

export function Rating({ rating, reviewCount, className = "" }: RatingProps) {
  if (rating === undefined) return null;

  return (
    <p className={`flex items-center gap-1.5 text-xs ${className}`}>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="size-3.5 shrink-0 text-star"
      >
        <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.49-4-3.9 5.53-.8L10 1.6z" />
      </svg>
      <span className="font-semibold text-ink">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-muted">({formatCount(reviewCount)})</span>
      )}
      <span className="sr-only">out of 5</span>
    </p>
  );
}
