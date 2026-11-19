import { z } from "zod";

/**
 * One authoritative schema for the checkout form. The inferred types are the
 * only place the shape is written down, and the same schema re-validates at the
 * trusted boundary (see `validateCheckout`).
 */
export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter the name the order should be addressed to."),
  email: z
    .string()
    .trim()
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Enter an email address in the form name@example.com.",
    ),
  address: z
    .string()
    .trim()
    .min(6, "Enter the street and area, at least six characters."),
  postcode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a 6-digit PIN code, for example 110001."),
  slot: z.enum(["morning", "afternoon"], {
    message: "Choose a delivery window.",
  }),
});

/** A fully valid submission. */
export type CheckoutValues = z.infer<typeof checkoutSchema>;

/** The form's working state: the slot starts empty until the visitor picks. */
export type CheckoutDraft = Omit<CheckoutValues, "slot"> & { slot: string };

export type CheckoutErrors = Partial<Record<keyof CheckoutDraft, string>>;

export const checkoutFields: CheckoutDraft = {
  name: "",
  email: "",
  address: "",
  postcode: "",
  slot: "",
};

const FIELD_ORDER: (keyof CheckoutDraft)[] = [
  "name",
  "email",
  "address",
  "postcode",
  "slot",
];

/**
 * Validate the draft and return one message per field, keeping the form's
 * existing copy. An empty slot reads as "choose a window" rather than an enum
 * error.
 */
export function validateCheckout(draft: CheckoutDraft): CheckoutErrors {
  const result = checkoutSchema.safeParse(draft);

  if (result.success) return {};

  const errors: CheckoutErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof CheckoutDraft | undefined;
    if (key && !(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export function firstInvalidField(
  errors: CheckoutErrors,
): keyof CheckoutDraft | undefined {
  return FIELD_ORDER.find((field) => errors[field]);
}
