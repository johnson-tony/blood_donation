import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "subtle" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon" | "icon-sm";
export type ButtonShape = "rounded" | "pill" | "circle";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-mahogany-600 to-mahogany-700 text-white shadow-glow hover:from-mahogany-700 hover:to-mahogany-800 active:scale-[0.98]",
  secondary:
    "bg-surface text-ink border border-line-strong/80 shadow-card hover:bg-surface-muted hover:border-line-strong active:scale-[0.98]",
  ghost: "text-ink-secondary hover:bg-surface-muted hover:text-ink active:scale-[0.98]",
  subtle: "bg-mahogany-50 text-mahogany-700 hover:bg-mahogany-100 active:scale-[0.98]",
  danger: "bg-red-600 text-white shadow-card hover:bg-red-700 active:scale-[0.98]",
};

const SIZES: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
  icon: "size-11 p-0 shrink-0",
  "icon-sm": "size-9 p-0 shrink-0",
};

const SHAPES: Record<ButtonShape, string> = {
  rounded: "rounded-2xl",
  pill: "rounded-full",
  circle: "rounded-full aspect-square",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  shape = "pill",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
} = {}): string {
  const isCircle = size === "icon" || size === "icon-sm" || shape === "circle";
  const shapeClass = isCircle ? SHAPES.circle : SHAPES[shape];

  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em]",
    "transition-all duration-200 select-none cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    shapeClass,
    className,
  );
}

export type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
};

export function Button({
  variant = "primary",
  size = "md",
  shape = "pill",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, shape, className })}
      {...props}
    />
  );
}
