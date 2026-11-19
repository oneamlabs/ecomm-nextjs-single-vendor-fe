import assert from "node:assert/strict";
import test from "node:test";

import {
  PRICE_MAX_RUPEES,
  PRICE_MIN_RUPEES,
  buildShopHref,
  parseShopParams,
} from "../src/lib/shop-query.ts";

test("empty params fall back to defaults", () => {
  const params = parseShopParams({});
  assert.equal(params.sort, "popular");
  assert.equal(params.page, 1);
  assert.equal(params.min, PRICE_MIN_RUPEES);
  assert.equal(params.max, PRICE_MAX_RUPEES);
  assert.deepEqual(params.tag, []);
  assert.deepEqual(params.diet, []);
});

test("repeated keys become arrays", () => {
  const params = parseShopParams({
    vendor: ["pahadi-organics", "desiroots"],
    tag: "vegan",
  });
  assert.deepEqual(params.vendor, ["pahadi-organics", "desiroots"]);
  assert.deepEqual(params.tag, ["vegan"]);
});

test("unknown sort, discount and stock values are rejected", () => {
  const params = parseShopParams({
    sort: "cheapest",
    discount: "15",
    stock: "maybe",
  });
  assert.equal(params.sort, "popular");
  assert.equal(params.discount, undefined);
  assert.equal(params.stock, undefined);
});

test("unknown diet ids are dropped", () => {
  const params = parseShopParams({ diet: ["vegan", "keto"] });
  assert.deepEqual(params.diet, ["vegan"]);
});

test("price range is clamped and ordered", () => {
  const inverted = parseShopParams({ min: "900", max: "200" });
  assert.deepEqual([inverted.min, inverted.max], [200, 900]);

  const outOfRange = parseShopParams({ min: "-50", max: "99999" });
  assert.ok(outOfRange.min >= PRICE_MIN_RUPEES);
  assert.ok(outOfRange.max <= PRICE_MAX_RUPEES);
  assert.ok(outOfRange.min <= outOfRange.max);
});

test("non-numeric and negative page values fall back to page one", () => {
  assert.equal(parseShopParams({ page: "abc" }).page, 1);
  assert.equal(parseShopParams({ page: "-3" }).page, 1);
});

test("overlong search text is dropped rather than passed through", () => {
  assert.equal(parseShopParams({ q: "x".repeat(200) }).q, undefined);
});

test("href builder omits defaults and keeps other filters", () => {
  const href = buildShopHref(
    { category: "oils", vendors: ["desiroots"], sort: "popular", page: 1 },
    { page: 2 },
  );
  assert.equal(href, "/shop?category=oils&vendor=desiroots&page=2");
});

test("href builder returns the bare route when nothing is set", () => {
  assert.equal(buildShopHref({}), "/shop");
});
