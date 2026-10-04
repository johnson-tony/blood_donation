import { cn } from "@/lib/utils/cn";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="-mx-px overflow-x-auto">
      <table
        className={cn("w-full min-w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function THead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("bg-surface-muted", className)} {...props} />;
}

export function TBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("divide-y divide-line", className)} {...props} />;
}

export function TR({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("align-middle", className)} {...props} />;
}

export function TH({
  className,
  scope = "col",
  ...props
}: React.ComponentProps<"th">) {
  return (
    <th
      scope={scope}
      className={cn(
        "whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-ink-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function TD({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td className={cn("px-4 py-3 text-ink", className)} {...props} />
  );
}
