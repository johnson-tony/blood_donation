import { cn } from "@/lib/utils/cn";

export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
} as const;

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const initials = initialsFrom(name);

  if (src) {
    return (
      // A plain img keeps this usable without the image optimiser, which would
      // reject arbitrary user-supplied hosts.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={80}
        height={80}
        loading="lazy"
        className={cn(
          "shrink-0 rounded-full border border-line object-cover",
          SIZES[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "border border-mahogany-200 bg-mahogany-50 font-semibold text-mahogany-800",
        SIZES[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}
