import { cn } from "@/lib/utils/cn";

export function Hint({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p id={id} className={cn("text-sm text-ink-muted", className)}>
      {children}
    </p>
  );
}

/**
 * Field-level error. Always rendered with a leading icon and the word "Error"
 * context supplied by the parent, so the state is never communicated by colour
 * alone.
 */
export function FieldError({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-sm font-medium text-mahogany-700"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="mt-px size-4 shrink-0 fill-none stroke-current"
      >
        <circle cx="8" cy="8" r="6.25" strokeWidth="1.5" />
        <path d="M8 5v3.5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.85" fill="currentColor" stroke="none" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
