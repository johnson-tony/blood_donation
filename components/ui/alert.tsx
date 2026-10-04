import { cn } from "@/lib/utils/cn";

export type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, { wrap: string; icon: React.ReactNode }> = {
  error: {
    wrap: "border-mahogany-200 bg-mahogany-50 text-mahogany-900",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-[1.125rem] shrink-0 fill-none stroke-mahogany-700 stroke-[1.5]"
      >
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6.25v4" strokeLinecap="round" />
        <circle cx="10" cy="13.4" r="0.95" fill="mahogany-700" stroke="none" />
      </svg>
    ),
  },
  success: {
    wrap: "border-success-line bg-success-surface text-success",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-[1.125rem] shrink-0 fill-none stroke-success stroke-[1.6]"
      >
        <circle cx="10" cy="10" r="7.5" />
        <path
          d="m6.75 10.25 2.25 2.25 4.25-4.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  info: {
    wrap: "border-line-strong bg-surface-muted text-ink-secondary",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-[1.125rem] shrink-0 fill-none stroke-current stroke-[1.5]"
      >
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 9.25v4.25" strokeLinecap="round" />
        <circle cx="10" cy="6.5" r="0.95" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  tone?: AlertTone;
  title?: string;
}) {
  const config = TONES[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-2.5 rounded-lg border p-3.5 text-sm",
        config.wrap,
        className,
      )}
      {...props}
    >
      {config.icon}
      <div className="min-w-0 space-y-0.5">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="[&_a]:underline">{children}</div> : null}
      </div>
    </div>
  );
}
