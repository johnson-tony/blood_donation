"use client";

import { useState } from "react";

import { IconEye, IconEyeOff } from "@/components/layout/icons";
import { FieldError, Hint } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

const CONTROL_BASE =
  "block w-full rounded-xl border bg-surface px-3.5 text-sm font-medium text-ink placeholder:text-ink-subtle/75 placeholder:font-normal transition-all duration-150 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted focus:outline-none focus:ring-4 focus:bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]";

const CONTROL_TONE = (invalid: boolean) =>
  invalid
    ? "border-red-500 text-red-950 focus:border-red-600 focus:ring-red-500/15"
    : "border-line-strong/80 hover:border-ink-subtle/70 focus:border-mahogany-600 focus:ring-mahogany-600/10";

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
          <span className="text-[0.7rem] font-medium text-ink-subtle">Optional</span>
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
  className?: string;
};

export function Input({
  label,
  hint,
  error,
  optional,
  containerClassName,
  className,
  id,
  type = "text",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

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
          <input
            id={id}
            type={effectiveType}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              CONTROL_BASE,
              CONTROL_TONE(invalid),
              "h-10.5",
              isPassword && "pr-10",
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-lg text-ink-subtle hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mahogany-600/30 cursor-pointer"
            >
              {showPassword ? (
                <IconEyeOff className="size-4" />
              ) : (
                <IconEye className="size-4" />
              )}
            </button>
          ) : null}
        </div>
      )}
    </Field>
  );
}
