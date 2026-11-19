import assert from "node:assert/strict";
import test from "node:test";

import {
  checkoutFields,
  firstInvalidField,
  validateCheckout,
} from "../src/lib/checkout.ts";

test("empty form reports every required field", () => {
  const errors = validateCheckout({ ...checkoutFields });
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.address);
  assert.ok(errors.postcode);
  assert.ok(errors.slot);
});

test("keeps the original user-facing copy", () => {
  const errors = validateCheckout({
    name: "A",
    email: "nope",
    address: "short",
    postcode: "12",
    slot: "",
  });
  assert.equal(errors.name, "Enter the name the order should be addressed to.");
  assert.equal(errors.email, "Enter an email address in the form name@example.com.");
  assert.equal(errors.address, "Enter the street and area, at least six characters.");
  assert.equal(errors.postcode, "Enter a 6-digit PIN code, for example 110001.");
  assert.equal(errors.slot, "Choose a delivery window.");
});

test("a complete draft validates", () => {
  const errors = validateCheckout({
    name: "Meera Patel",
    email: "meera@example.com",
    address: "12 Hill Road, Dehradun",
    postcode: "110001",
    slot: "morning",
  });
  assert.deepEqual(errors, {});
});

test("rejects a PIN that is not six digits", () => {
  const errors = validateCheckout({
    name: "Meera Patel",
    email: "meera@example.com",
    address: "12 Hill Road, Dehradun",
    postcode: "11000a",
    slot: "afternoon",
  });
  assert.ok(errors.postcode);
});

test("focus order points at the first invalid field", () => {
  const errors = validateCheckout({
    name: "",
    email: "nope",
    address: "12 Hill Road, Dehradun",
    postcode: "110001",
    slot: "morning",
  });
  assert.equal(firstInvalidField(errors), "name");
});

test("no invalid field returns undefined", () => {
  assert.equal(firstInvalidField({}), undefined);
});
