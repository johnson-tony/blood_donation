import { cn } from "@/lib/utils/cn";
import { Field } from "@/components/ui/input";

const SELECT_BASE =
  "block h-10.5 w-full appearance-none rounded-xl border bg-surface px-3.5 pr-9 text-sm font-medium text-ink transition-all duration-150 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted focus:outline-none focus:ring-4 focus:bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]";

const SELECT_TONE = (invalid: boolean) =>
  invalid
    ? "border-red-500 text-red-950 focus:border-red-600 focus:ring-red-500/15"
    : "border-line-strong/80 hover:border-ink-subtle/70 focus:border-mahogany-600 focus:ring-mahogany-600/10";

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
