import { cn } from "@/lib/utils/cn";

export function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold text-ink-secondary tracking-tight",
        "peer-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
