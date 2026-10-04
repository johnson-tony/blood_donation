import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-5">
        <p className="text-sm font-semibold text-mahogany-700">404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          We could not find that page
        </h1>
        <p className="text-sm text-ink-muted">
          The link may be out of date, or the page may have moved.
        </p>
        <Link href="/" className={buttonClasses()}>
          Go to the start
        </Link>
      </div>
    </div>
  );
}