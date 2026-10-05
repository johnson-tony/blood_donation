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
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="hidden overflow-hidden bg-mahogany-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <BrandLogo href="/" />
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-mahogany-200">One profile. Real help.</p>
          <h2 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.05em]">When blood is needed, distance matters.</h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-white/65">Build a trusted donor profile once. Future requests can use your blood group and area to find the right people faster.</p>
        </div>
        <p className="text-xs text-white/45">{APP_DESCRIPTION}</p>
      </aside>
      <div className="flex min-h-dvh flex-col">
        <header className="px-6 py-6 sm:py-8 lg:hidden"><BrandLogo href="/" /></header>
        <main className="flex flex-1 items-start justify-center px-6 pb-14 pt-2 sm:items-center sm:pt-0">
          <div className="w-full max-w-[26rem]">{children}</div>
        </main>
        <footer className="px-6 pb-8 text-center text-xs leading-relaxed text-ink-subtle lg:hidden">{APP_DESCRIPTION}</footer>
      </div>
    </div>
  );
}
