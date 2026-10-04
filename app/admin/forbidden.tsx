import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

/**
 * Rendered when a signed-in non-admin requests a route under `/admin`.
 * Access is decided on the server in `requireAdmin`; this is only the message.
 */
export default function AdminForbidden() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-5">
        <p className="text-sm font-semibold text-mahogany-700">403</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          You do not have access to the admin area
        </h1>
        <p className="text-sm text-ink-muted">
          Administrator accounts are created by a developer. If you believe this
          is a mistake, ask an administrator to review your account.
        </p>
        <Link href="/dashboard" className={buttonClasses()}>
          Go to my dashboard
        </Link>
      </div>
    </div>
  );
}
