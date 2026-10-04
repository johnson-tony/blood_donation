import { cn } from "@/lib/utils/cn";

export type BadgeTone = "neutral" | "brand" | "success" | "muted";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-ink-secondary ring-line-strong",
  brand: "bg-mahogany-50 text-mahogany-800 ring-mahogany-200",
  success: "bg-success-surface text-success ring-success-line",
  muted: "bg-transparent text-ink-subtle ring-line",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/**
 * A status indicator. The dot is decorative and always paired with a text
 * label, so the state is never communicated by colour alone.
 */
export function StatusDot({
  tone = "neutral",
  className,
}: {
  tone?: "neutral" | "success" | "brand";
  className?: string;
}) {
  const colors = {
    neutral: "bg-ink-subtle",
    success: "bg-success",
    brand: "bg-mahogany-600",
  } as const;

  return (
    <span
      aria-hidden="true"
      className={cn("size-1.5 shrink-0 rounded-full", colors[tone], className)}
    />
  );
}
