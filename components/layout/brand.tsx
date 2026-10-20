import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

/** The product mark: a heart & blood pulse emblem inspired by modern healthcare aesthetics. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-mahogany-500 to-mahogany-700 text-white shadow-glow",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        <path d="M7 11h2.5l1.5-3 2 6 1.5-3H17" />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "text-[0.9375rem] font-semibold tracking-tight text-ink",
        className,
      )}
    >
      {APP_NAME}
    </span>
  );
}

export function BrandLogo({
  href = "/",
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  const content = (
    <>
      <BrandMark />
      <BrandWordmark />
    </>
  );

  if (!href) {
    return <span className={cn("inline-flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-85",
        className,
      )}
    >
      {content}
    </Link>
  );
}
