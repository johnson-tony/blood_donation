import type { Metadata } from "next";
import Link from "next/link";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageHeader } from "@/components/layout/page-header";
import { buttonClasses } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/auth/guards";
import { getUserById, toProfileDTO } from "@/lib/services/user.service";

export const metadata: Metadata = { title: "Donate Blood" };

export default async function DonateBloodPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-canvas text-ink">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-700">Donate blood</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">One donation can help someone nearby.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-secondary sm:text-lg">
              Create your donor profile once. Choose your blood group, area and availability, then stay visible when you are ready to help.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className={buttonClasses({ size: "lg", className: "sm:w-auto" })}>Become a donor</Link>
              <Link href="/sign-in" className={buttonClasses({ variant: "secondary", size: "lg", className: "sm:w-auto" })}>I already have an account</Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              ["01", "Create your profile", "Add your blood group and where you can help."],
              ["02", "Set availability", "Turn donor availability on only when you are ready."],
              ["03", "Help nearby", "Suitable people can find you without your phone number being publicly displayed."],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
                <span className="text-xs font-bold text-mahogany-600">{number}</span>
                <h2 className="mt-8 text-base font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </main>
    );
  }

  const sessionUser = await requireUser();
  const user = await getUserById(sessionUser.id);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Become a donor"
        title="Set up your donor profile."
        description="Your blood group, area and availability help people find a suitable donor. Your phone number is never shown in public donor search."
      />
      <ProfileForm profile={toProfileDTO(user)} />
    </div>
  );
}
