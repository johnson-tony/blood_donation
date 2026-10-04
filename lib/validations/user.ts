import { z } from "zod";

import { BLOOD_GROUPS } from "@/types/user";

/**
 * Rules that every password in this product must satisfy. Kept in one place so
 * the sign-up form hint text and the server-side schema can never drift apart.
 */
export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_REQUIREMENTS = [
  `At least ${PASSWORD_MIN_LENGTH} characters`,
  "At least one letter",
  "At least one number",
] as const;

const password = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

const fullName = z
  .string()
  .trim()
  .min(2, "Enter your full name.")
  .max(80, "Full name is too long.");

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .max(254, "Email address is too long.")
  .email("Enter a valid email address.");

/**
 * Mobile numbers are stored as typed (digits, spaces and a leading `+`) and
 * only normalised for comparison, because formats differ by country.
 */
const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid mobile number.")
  .max(20, "Enter a valid mobile number.")
  .regex(/^\+?[0-9 ()-]+$/, "Use digits, spaces, brackets, an optional + and hyphens only.");

const locationField = (label: string, max: number) =>
  z.string().trim().min(2, `Enter your ${label.toLowerCase()}.`).max(max);

export const signUpSchema = z
  .object({
    name: fullName,
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const profileSchema = z.object({
  name: fullName,
  // No `profileImage`: a photo is only ever set by the upload action, so the
  // profile form cannot point the app at an arbitrary host.
  phone,
  bloodGroup: z.enum(BLOOD_GROUPS, {
    error: "Select your blood group.",
  }),
  state: locationField("State", 80),
  district: locationField("District", 80),
  locality: locationField("Village or locality", 120),
  availability: z.enum(["available", "unavailable"], {
    error: "Tell us whether you are available to donate.",
  }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
