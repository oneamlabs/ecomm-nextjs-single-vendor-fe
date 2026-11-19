import assert from "node:assert/strict";
import test from "node:test";

import { isMissingResource } from "../src/lib/api/errors.ts";
import { ApiError } from "../src/lib/api/types.ts";

test("a not_found ApiError means the resource is missing", () => {
  assert.equal(isMissingResource(new ApiError("not_found", "gone", 404)), true);
});

test("every other API failure is not treated as missing", () => {
  const codes = ["bad_request", "internal_error", "network_error", "timeout"] as const;
  for (const code of codes) {
    assert.equal(
      isMissingResource(new ApiError(code, "failed", 500)),
      false,
      `${code} must not be treated as a 404`,
    );
  }
});

test("a plain error is not treated as missing", () => {
  assert.equal(isMissingResource(new Error("boom")), false);
  assert.equal(isMissingResource(undefined), false);
  assert.equal(isMissingResource(null), false);
  assert.equal(isMissingResource("not_found"), false);
});
