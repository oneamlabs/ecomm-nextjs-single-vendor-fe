import type { CartLine } from "../cart-store";

export interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  totalCents: number;
  items: CartLine[];
}

/** The signed-in customer, without anything secret. */
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  memberSince?: string;
}

/** The dashboard payload. */
export interface AccountResponse {
  profile: CustomerProfile;
  addresses: Address[];
  orders: Order[];
  /** True when the account was created in this session and has no seeded history. */
  isDemoSignup?: boolean;
}

/** Sign-in and sign-up form values, inferred from the zod schemas. */
export type { SignInValues, SignUpValues } from "./schemas";
