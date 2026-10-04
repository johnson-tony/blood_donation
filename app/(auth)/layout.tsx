import { redirect } from "next/navigation";

import { BrandLogo } from "@/components/layout/brand";
import { getSessionUser } from "@/lib/auth/guards";
import { APP_DESCRIPTION } from "@/lib/constants";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionUser = await getSessionUser();

  if (sessionUser) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 sm:py-8">
        <BrandLogo href="/" />
      </header>

      <main className="flex flex-1 items-start justify-center px-6 pb-14 pt-2 sm:items-center sm:pt-0">
        <div className="w-full max-w-[26rem]">{children}</div>
      </main>

      <footer className="px-6 pb-8 text-center text-xs leading-relaxed text-ink-subtle">
        {APP_DESCRIPTION}
      </footer>
    </div>
  );
}
