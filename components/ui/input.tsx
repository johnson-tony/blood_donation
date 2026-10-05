import { cn } from "@/lib/utils/cn";
import { FieldError, Hint } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

const CONTROL_BASE =
  "block w-full rounded-2xl border bg-surface px-4 text-[0.9375rem] text-ink placeholder:text-ink-subtle transition-all duration-150 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted focus:shadow-[0_0_0_4px_rgb(173_40_49_/_0.08)]";

const CONTROL_TONE = (invalid: boolean) =>
  invalid
    ? "border-mahogany-600 focus:border-mahogany-700"
    : "border-line-strong hover:border-ink-subtle focus:border-mahogany-600";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: (describedBy: string | undefined, invalid: boolean) => React.ReactNode;
};

export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  className,
  children,
}: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {optional ? (
          <span className="text-xs text-ink-subtle">Optional</span>
        ) : null}
      </div>
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      {children(describedBy, Boolean(error))}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

export type InputProps = Omit<React.ComponentProps<"input">, "className" | "id"> & {
  /** Required so the label can always be associated with the control. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  containerClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  optional,
  containerClassName,
  id,
  ...props
}: InputProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      optional={optional}
      className={containerClassName}
    >
      {(describedBy, invalid) => (
        <input
          id={id}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            CONTROL_BASE,
            CONTROL_TONE(invalid),
            "h-12",
          )}
          {...props}
        />
      )}
    </Field>
  );
}
