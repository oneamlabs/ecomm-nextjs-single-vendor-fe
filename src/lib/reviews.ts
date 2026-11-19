import reviewsJson from "@/data/reviews.json";

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
}

export interface RatingBucket {
  stars: number;
  percent: number;
  count: number;
}

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

export function ratingBreakdown(rating: number, reviewCount: number): RatingBucket[] {
  const percents =
    rating >= 4.8
      ? [76, 18, 4, 1, 1]
      : rating >= 4.6
        ? [68, 22, 7, 2, 1]
        : rating >= 4.4
          ? [60, 25, 10, 3, 2]
          : [52, 28, 12, 5, 3];

  return percents.map((percent, index) => ({
    stars: 5 - index,
    percent,
    count: Math.round((reviewCount * percent) / 100),
  }));
}
