export interface CheckoutValues {
  name: string;
  email: string;
  address: string;
  postcode: string;
  slot: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, string>>;

export const checkoutFields: CheckoutValues = {
  name: "",
  email: "",
  address: "",
  postcode: "",
  slot: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PIN_CODE = /^\d{6}$/;

const FIELD_ORDER: (keyof CheckoutValues)[] = [
  "name",
  "email",
  "address",
  "postcode",
  "slot",
];

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Enter the name the order should be addressed to.";
  }
  if (!EMAIL.test(values.email.trim())) {
    errors.email = "Enter an email address in the form name@example.com.";
  }
  if (values.address.trim().length < 6) {
    errors.address = "Enter the street and area, at least six characters.";
  }
  if (!PIN_CODE.test(values.postcode.trim())) {
    errors.postcode = "Enter a 6-digit PIN code, for example 110001.";
  }
  if (!values.slot) {
    errors.slot = "Choose a delivery window.";
  }

  return errors;
}

export function firstInvalidField(errors: CheckoutErrors): keyof CheckoutValues | undefined {
  return FIELD_ORDER.find((field) => errors[field]);
}
