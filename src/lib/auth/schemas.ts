import { z } from "zod";

/**
 * The auth form schemas. Kept out of the server-only customer store so the
 * browser form, the route handlers and the tests all validate identically.
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter an email address in the form name@example.com."),
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name, at least two characters."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter an email address in the form name@example.com."),
    password: z.string().min(8, "Use a password of at least eight characters."),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "The passwords do not match.",
    path: ["confirm"],
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
