import Link from "next/link";
import { redirect } from "next/navigation";

import { buttonClasses } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/guards";
import { landingRouteForRole } from "@/lib/constants";

export default async function RootPage() {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect(landingRouteForRole(sessionUser.role));
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="max-w-md space-y-4 text-center">
        <p className="text-sm font-medium text-mahogany-700">Coming soon</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          The public site is not built yet
        </h1>
        <p className="text-ink-muted">
          Sign in to reach your dashboard, or create an account to register as a
          blood donor.
        </p>
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <Link href="/sign-up" className={buttonClasses()}>
            Create an account
          </Link>
          <Link
            href="/sign-in"
            className={buttonClasses({ variant: "secondary" })}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
