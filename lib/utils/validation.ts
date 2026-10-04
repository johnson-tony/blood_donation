import "server-only";

import { z } from "zod";

/** Converts a `ZodError` into the flat `{ field: string[] }` shape the UI uses. */
export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (fieldErrors[key] ??= []).push(issue.message);
  }

  return fieldErrors;
}
