/**
 * The demo sign-in credentials, pre-filled in the form so the flow is one click.
 *
 * Client-safe on purpose: both the sign-in form and the marketing copy read it.
 * `src/data/customers.json` remains the record of truth for the account itself;
 * `tests/demo-credentials.test.ts` fails if these values drift from it.
 */
export const DEMO_CREDENTIALS = {
  email: "meera@example.com",
  password: "kraya-demo",
} as const;
