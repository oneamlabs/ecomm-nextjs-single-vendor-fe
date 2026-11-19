import assert from "node:assert/strict";
import test from "node:test";

import type { Product } from "../src/lib/types.ts";
import {
  defaultVariant,
  discountPercent,
  lowestPriceCents,
  variantMrpCents,
} from "../src/lib/variant.ts";
import { ratingBreakdown } from "../src/lib/rating.ts";

const product: Product = {
  id: "organic-red-quinoa",
  name: "Organic Red Quinoa",
  categoryId: "grains",
  vendorId: "pahadi-organics",
  origin: "Uttarakhand, India",
  summary: "Whole red quinoa.",
  photo: "spices-dark",
  photoAlt: "A dark bowl of grains",
  organic: true,
  tags: ["vegan"],
  mrpCents: 39900,
  variants: [
    {
      id: "500g",
      label: "500 g",
      priceCents: 31900,
      mrpCents: 39900,
      netAmount: 500,
      netUnit: "g",
      inStock: true,
    },
    {
      id: "1kg",
      label: "1 kg",
      priceCents: 59900,
      mrpCents: 74900,
      netAmount: 1000,
      netUnit: "g",
      inStock: true,
    },
  ],
};

test("default variant is the first in-stock pack", () => {
  assert.equal(defaultVariant(product).id, "500g");
});

test("sold-out first pack falls through to the next in-stock pack", () => {
  const soldOutFirst: Product = {
    ...product,
    variants: [
      { ...product.variants[0], inStock: false },
      product.variants[1],
    ],
  };
  assert.equal(defaultVariant(soldOutFirst).id, "1kg");
});

test("lowest price is the cheapest pack", () => {
  assert.equal(lowestPriceCents(product), 31900);
});

test("variant MRP prefers the pack's own MRP", () => {
  assert.equal(variantMrpCents(product, product.variants[1]), 74900);
});

test("discount is computed against the default pack", () => {
  assert.equal(discountPercent(product), 20);
});

test("no MRP means no discount", () => {
  assert.equal(discountPercent({ ...product, mrpCents: undefined }), undefined);
});

test("rating breakdown always sums its stars", () => {
  const buckets = ratingBreakdown(4.8, 1000);
  assert.equal(buckets.length, 5);
  assert.deepEqual(
    buckets.map((bucket) => bucket.stars),
    [5, 4, 3, 2, 1],
  );
  const total = buckets.reduce((sum, bucket) => sum + bucket.percent, 0);
  assert.ok(total >= 99 && total <= 101);
});
