const TIME_BASED_GREETINGS = [
  { until: 12, greeting: "Good morning" },
  { until: 17, greeting: "Good afternoon" },
  { until: 24, greeting: "Good evening" },
] as const;

/** Rendered on the server, so it follows the server's timezone. */
export function greetingFor(date: Date = new Date()): string {
  const hour = date.getHours();
  const match = TIME_BASED_GREETINGS.find((entry) => hour < entry.until);

  return match?.greeting ?? "Good evening";
}

/** First name only, which is what a dashboard greeting should use. */
export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}
