import { cn } from "@/lib/utils/cn";

export function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-ink",
        "peer-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
