/**
 * Converts a `FormData` instance into a plain string record.
 *
 * Server Actions receive every field as `string | File | null`. Working with a
 * `Record<string, string>` lets the Zod schemas stay free of null handling and
 * makes "field was not submitted" indistinguishable from "field was empty",
 * which is what we want for required inputs.
 */
export function formDataToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      values[key] = value;
    }
  }

  return values;
}
