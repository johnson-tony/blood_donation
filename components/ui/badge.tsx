import { cn } from "@/lib/utils/cn";

export type BadgeTone = "neutral" | "brand" | "success" | "muted" | "urgent" | "confirmed";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-secondary ring-line-strong",
  brand: "bg-mahogany-50 text-mahogany-700 ring-mahogany-200/70 font-semibold",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200/80 font-semibold",
  muted: "bg-transparent text-ink-subtle ring-line",
  urgent: "bg-red-500 text-white ring-red-600 shadow-sm font-semibold",
  confirmed: "bg-gradient-to-r from-mahogany-600 to-mahogany-700 text-white ring-mahogany-700 font-semibold shadow-sm",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs tracking-[-0.01em] ring-1 ring-inset",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/**
 * A status indicator dot with optional glow.
 */
export function StatusDot({
  tone = "neutral",
  className,
}: {
  tone?: "neutral" | "success" | "brand" | "urgent";
  className?: string;
}) {
  const colors = {
    neutral: "bg-ink-subtle",
    success: "bg-emerald-500",
    brand: "bg-mahogany-600",
    urgent: "bg-red-500 animate-ping",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn("size-2 shrink-0 rounded-full", colors[tone], className)}
    />
  );
}
