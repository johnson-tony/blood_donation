import { cn } from "@/lib/utils/cn";
import { Field } from "@/components/ui/input";

const SELECT_BASE =
  "block h-11 w-full appearance-none rounded-lg border bg-surface px-3 pr-9 text-[0.9375rem] text-ink transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted";

const SELECT_TONE = (invalid: boolean) =>
  invalid
    ? "border-mahogany-600 focus:border-mahogany-700"
    : "border-line-strong hover:border-ink-subtle focus:border-mahogany-600";

export type SelectOption = { value: string; label: string };

export type SelectProps = Omit<
  React.ComponentProps<"select">,
  "className" | "id"
> & {
  /** Required so the label can always be associated with the control. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
};

export function Select({
  label,
  hint,
  error,
  optional,
  options,
  placeholder,
  containerClassName,
  id,
  ...props
}: SelectProps) {
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
        <div className="relative">
          <select
            id={id}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(SELECT_BASE, SELECT_TONE(invalid))}
            {...props}
          >
            {placeholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 fill-none stroke-ink-muted stroke-[1.6]"
          >
            <path
              d="m5.5 8 4.5 4.5L14.5 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </Field>
  );
}
