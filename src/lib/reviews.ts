import "server-only";

import reviewsJson from "@/data/reviews.json";
import type { ProductReview } from "./types";

export type { ProductReview } from "./types";
export type { RatingBucket } from "./rating";
export { ratingBreakdown } from "./rating";

const stored = reviewsJson.reviews as Record<string, ProductReview[]>;

const FALLBACK: ProductReview[] = [
  {
    name: "Meera P.",
    rating: 5,
    date: "Nov 12, 2026",
    text: "Arrived well packed and fresh. Exactly as described.",
    verified: true,
  },
  {
    name: "Arjun N.",
    rating: 4,
    date: "Nov 6, 2026",
    text: "Good quality and a fair price. Will order again.",
    verified: true,
  },
];

export function getReviews(productId: string): ProductReview[] {
  return stored[productId] ?? FALLBACK;
}
