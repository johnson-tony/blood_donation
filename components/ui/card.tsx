import { cn } from "@/lib/utils/cn";

export type CardVariant = "default" | "crimson" | "subtle" | "flat";

export function Card({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: CardVariant }) {
  const variantStyles: Record<CardVariant, string> = {
    default: "text-ink",
    crimson: "bg-gradient-to-br from-mahogany-600 via-mahogany-700 to-mahogany-800 text-white shadow-glow border-0",
    subtle: "border border-mahogany-100 bg-mahogany-50/50 shadow-card text-ink",
    flat: "border border-line bg-surface-muted/60 text-ink",
  };

  return (
    <div
      className={cn(
        "rounded-[26px] transition-all duration-200",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5 p-6 sm:p-7", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg font-bold tracking-tight text-inherit", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-sm opacity-80", className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("p-6 sm:p-7 pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2.5 border-t border-line/60 bg-surface-muted/40 px-6 py-4 rounded-b-[26px] sm:flex-row sm:justify-end sm:px-7",
        className,
      )}
      {...props}
    />
  );
}
