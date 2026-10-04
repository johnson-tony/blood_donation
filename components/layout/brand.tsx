import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

/** The product mark: a cross cut from a rounded brand tile. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-[0.625rem] bg-mahogany-600",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="size-[1.125rem] fill-white">
        <path d="M8.25 3.75h3.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-3v3a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 .75-.75h3v-3a.75.75 0 0 1 .75-.75Z" />
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
