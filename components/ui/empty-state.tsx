import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-ink-subtle [&_svg]:size-5"
        >
          {icon}
        </span>
      ) : null}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
