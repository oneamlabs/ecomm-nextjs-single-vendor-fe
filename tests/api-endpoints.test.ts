import assert from "node:assert/strict";
import test from "node:test";

import {
  ENDPOINTS,
  productIdFromDetailPath,
  productIdFromPath,
} from "../src/lib/api/endpoints.ts";

test("endpoint paths are built from one base", () => {
  assert.equal(ENDPOINTS.products.list, "/api/products");
  assert.equal(ENDPOINTS.categories.list, "/api/categories");
  assert.equal(ENDPOINTS.vendors.list, "/api/vendors");
});

test("detail endpoint encodes the id", () => {
  assert.equal(ENDPOINTS.products.detail("a2-desi-ghee"), "/api/products/a2-desi-ghee");
  assert.equal(ENDPOINTS.products.detail("a b"), "/api/products/a%20b");
});

test("detail path round-trips through the parser", () => {
  assert.equal(productIdFromPath(ENDPOINTS.products.detail("organic-red-quinoa")), "organic-red-quinoa");
  assert.equal(productIdFromPath(ENDPOINTS.products.detail("a b")), "a b");
});

test("the list path is not read as a detail id", () => {
  assert.equal(productIdFromPath(ENDPOINTS.products.list), undefined);
});

test("empty and nested paths yield no id", () => {
  assert.equal(productIdFromPath("/api/products/"), undefined);
  assert.equal(productIdFromPath("/api/products/x/y"), undefined);
  assert.equal(productIdFromPath("/api/categories"), undefined);
});

test("detail bundle path is distinct from the plain detail path", () => {
  assert.equal(ENDPOINTS.products.full("a2-desi-ghee"), "/api/products/a2-desi-ghee/detail");
  assert.equal(
    productIdFromDetailPath(ENDPOINTS.products.full("a2-desi-ghee")),
    "a2-desi-ghee",
  );
  assert.equal(productIdFromDetailPath(ENDPOINTS.products.full("a b")), "a b");
});

test("the plain matcher does not swallow the bundle path", () => {
  // This is why the adapter checks the suffix first: if the plain matcher ever
  // matched "x/detail", the bundle request would resolve to a missing product.
  assert.equal(productIdFromPath(ENDPOINTS.products.full("a2-desi-ghee")), undefined);
  assert.equal(productIdFromDetailPath(ENDPOINTS.products.detail("a2-desi-ghee")), undefined);
  assert.equal(productIdFromDetailPath(ENDPOINTS.products.list), undefined);
});
