export interface RatingBucket {
  stars: number;
  percent: number;
  count: number;
}

const BUCKETS: Record<string, number[]> = {
  high: [76, 18, 4, 1, 1],
  good: [68, 22, 7, 2, 1],
  fair: [60, 25, 10, 3, 2],
  low: [52, 28, 12, 5, 3],
};

/**
 * Sample review distribution derived from the rating. Client-safe: it reads no
 * review records, so the review JSON never reaches the browser.
 */
export function ratingBreakdown(rating: number, reviewCount: number): RatingBucket[] {
  const percents =
    rating >= 4.8
      ? BUCKETS.high
      : rating >= 4.6
        ? BUCKETS.good
        : rating >= 4.4
          ? BUCKETS.fair
          : BUCKETS.low;

  return percents.map((percent, index) => ({
    stars: 5 - index,
    percent,
    count: Math.round((reviewCount * percent) / 100),
  }));
}
