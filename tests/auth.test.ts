import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { DEMO_CREDENTIALS } from "../src/lib/auth/demo.ts";
import { signInSchema, signUpSchema } from "../src/lib/auth/schemas.ts";

/**
 * The sign-in form is pre-filled from `demo.ts`, while the account itself lives
 * in `customers.json`. This test is the link between them: if someone edits one
 * and not the other, the pre-filled form silently stops working.
 */
const readCustomers = async () => {
  const raw = await readFile(
    new URL("../src/data/customers.json", import.meta.url),
    "utf8",
  );
  return JSON.parse(raw).customers as {
    email: string;
    demoPassword: string;
    addresses: unknown[];
    orders: unknown[];
  }[];
};

test("pre-filled demo credentials match a real seeded account", async () => {
  const customers = await readCustomers();
  const match = customers.find(
    (customer) =>
      customer.email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase(),
  );

  assert.ok(match, `no seeded customer with email ${DEMO_CREDENTIALS.email}`);
  assert.equal(match.demoPassword, DEMO_CREDENTIALS.password);
});

test("the seeded demo account has data worth showing on a dashboard", async () => {
  const customers = await readCustomers();
  const match = customers.find(
    (customer) => customer.email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase(),
  );

  assert.ok(match);
  assert.ok(match.orders.length > 0, "demo account should have order history");
  assert.ok(match.addresses.length > 0, "demo account should have an address");
});

test("every seeded account has a unique email and a usable password", async () => {
  const customers = await readCustomers();
  const emails = customers.map((customer) => customer.email.toLowerCase());
  assert.equal(new Set(emails).size, emails.length);

  for (const customer of customers) {
    assert.ok(customer.demoPassword.length >= 8, `${customer.email} password too short`);
  }
});

test("sign-in schema lowercases and trims the email", () => {
  const parsed = signInSchema.parse({
    email: "  MEERA@Example.com ",
    password: "x",
  });
  assert.equal(parsed.email, "meera@example.com");
});

test("sign-in rejects a malformed address", () => {
  assert.equal(signInSchema.safeParse({ email: "nope", password: "x" }).success, false);
});

test("sign-up requires matching passwords and a long enough secret", () => {
  const base = { name: "Test Buyer", email: "buyer@example.com", password: "short", confirm: "short" };
  assert.equal(signUpSchema.safeParse(base).success, false);

  const strong = { ...base, password: "long-enough", confirm: "long-enough" };
  assert.equal(signUpSchema.safeParse(strong).success, true);

  const mismatch = { ...base, password: "long-enough", confirm: "different-one" };
  const result = signUpSchema.safeParse(mismatch);
  assert.equal(result.success, false);
  assert.ok(
    result.error?.issues.some((issue) => issue.path[0] === "confirm"),
    "the mismatch should be reported on the confirm field",
  );
});
