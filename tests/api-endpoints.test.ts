import assert from "node:assert/strict";
import test from "node:test";

import { ENDPOINTS, productIdFromPath } from "../src/lib/api/endpoints.ts";

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
