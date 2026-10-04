import { cn } from "@/lib/utils/cn";
import { FieldError, Hint } from "@/components/ui/field";

export type RadioCardOption<T extends string> = {
  value: T;
  title: string;
  description?: string;
  /** Adds a small status marker in the brand's success tone. */
  tone?: "positive" | "neutral";
};

export type RadioCardGroupProps<T extends string> = {
  id: string;
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  value: T | "";
  options: ReadonlyArray<RadioCardOption<T>>;
  onChange: (value: T) => void;
};

/**
 * A segmented choice control. Used instead of a plain radio list so the two
 * options read as a single decision.
 */
export function RadioCardGroup<T extends string>({
  id,
  name,
  legend,
  hint,
  error,
  value,
  options,
  onChange,
}: RadioCardGroupProps<T>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset className="space-y-2">
      <legend className="mb-1.5 text-sm font-medium text-ink">{legend}</legend>
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      <div
        className={cn(
          "grid gap-2.5 sm:grid-cols-2",
          error && "rounded-lg",
        )}
        aria-describedby={describedBy}
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "relative flex cursor-pointer gap-3 rounded-lg border p-3.5 transition-colors duration-150",
                selected
                  ? "border-mahogany-600 bg-mahogany-50"
                  : "border-line-strong bg-surface hover:border-ink-subtle",
                error && !selected && "border-mahogany-300",
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="mt-0.5 size-4 shrink-0 accent-mahogany-600"
              />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  {option.title}
                  {option.tone === "positive" && selected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-surface px-1.5 py-0.5 text-[0.6875rem] font-medium text-success ring-1 ring-success-line">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-success"
                      />
                      Available
                    </span>
                  ) : null}
                </span>
                {option.description ? (
                  <span className="mt-0.5 block text-sm text-ink-muted">
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </fieldset>
  );
}
