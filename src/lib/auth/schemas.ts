import { z } from "zod";

export const emailSchema = z.string().email("Enter a valid email").max(320);

export const passwordSchema = z
  .string()
  .min(10, "At least 10 characters")
  .max(128, "At most 128 characters")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[0-9]/, "Add a number");

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(200).optional(),
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(128),
});

export const forgotSchema = z.object({
  email: emailSchema,
});

export const resetSchema = z.object({
  token: z.string().length(64),
  password: passwordSchema,
});

export const passwordChecks = [
  { label: "10+ characters", test: (v: string) => v.length >= 10 },
  { label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
] as const;

export type PasswordCheck = (typeof passwordChecks)[number];
