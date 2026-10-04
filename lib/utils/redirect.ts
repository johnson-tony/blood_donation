/**
 * Only same-origin, path-only destinations are allowed, so a crafted
 * `?callbackUrl=https://evil.example` cannot turn sign-in into an open redirect.
 */
export function safeCallbackUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string" || value.length === 0) {
    return fallback;
  }

  // "//evil.example" and "https://evil.example" are both rejected.
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }

  if (value.includes("\\") || value.includes("\n") || value.includes("\r")) {
    return fallback;
  }

  return value;
}