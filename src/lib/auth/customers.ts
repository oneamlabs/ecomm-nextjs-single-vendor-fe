import "server-only";

import customersJson from "@/data/customers.json";
import { signInSchema, signUpSchema, type SignUpValues } from "./schemas";
import type { Address, CustomerProfile, Order } from "./types";

/**
 * The demo customer records. Like the catalogue, this stands in for a backend:
 * `customers.json` is the mock database and this module is the fake data access
 * layer. Sign-in compares a plain demo password, which a real backend would never
 * do; that is called out in the UI and in DECISIONS.md.
 */

interface StoredCustomer {
  id: string;
  name: string;
  email: string;
  demoPassword: string;
  phone?: string;
  city?: string;
  memberSince?: string;
  addresses: Address[];
  orders: Order[];
}

const customers = customersJson.customers as StoredCustomer[];

/**
 * Accounts created in this process only.
 *
 * Stored on `globalThis` rather than a module-level `Map` on purpose: Next
 * bundles each route and page into its own chunk, so a module-scoped map is
 * duplicated and a customer registered by the sign-up handler is invisible to
 * the `/account` page. A single process-wide registry fixes that. It is still
 * per-process: accounts do not survive a restart or reach another instance,
 * which is why real sign-up belongs on a backend.
 */
const REGISTRY = Symbol.for("kraya.demo.signedUp");

function registry(): Map<string, StoredCustomer> {
  const global = globalThis as typeof globalThis & {
    [REGISTRY]?: Map<string, StoredCustomer>;
  };
  global[REGISTRY] ??= new Map();
  return global[REGISTRY];
}

export { signInSchema, signUpSchema };
export type { SignInValues, SignUpValues } from "./schemas";

function allCustomers(): StoredCustomer[] {
  return [...registry().values(), ...customers];
}

export function findCustomer(email: string): StoredCustomer | undefined {
  const wanted = email.trim().toLowerCase();
  return allCustomers().find((customer) => customer.email.toLowerCase() === wanted);
}

/** Returns the customer when the demo password matches. */
export function authenticate(email: string, password: string) {
  const customer = findCustomer(email);
  if (!customer) return undefined;
  return customer.demoPassword === password ? customer : undefined;
}

/**
 * Register a demo customer. Rejects a duplicate email instead of silently
 * returning the existing account, so the form can report it.
 */
export function register(values: SignUpValues): StoredCustomer | undefined {
  if (findCustomer(values.email)) return undefined;

  const customer: StoredCustomer = {
    id: `cus-${Math.random().toString(36).slice(2, 10)}`,
    name: values.name,
    email: values.email,
    // The demo password is kept so the same account can be signed into again.
    demoPassword: values.password,
    memberSince: new Date().toISOString().slice(0, 10),
    addresses: [],
    orders: [],
  };

  registry().set(customer.id, customer);
  return customer;
}

export function readAccount(customer: StoredCustomer): {
  profile: CustomerProfile;
  addresses: Address[];
  orders: Order[];
  isDemoSignup: boolean;
} {
  return {
    profile: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      memberSince: customer.memberSince,
    },
    addresses: customer.addresses,
    orders: customer.orders,
    isDemoSignup: registry().has(customer.id),
  };
}

export function getCustomerById(id: string): StoredCustomer | undefined {
  return allCustomers().find((customer) => customer.id === id);
}
