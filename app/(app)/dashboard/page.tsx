import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { IconCheck, IconDroplet, IconSearch } from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { getCurrentUserRecord } from "@/lib/auth/guards";
import { toProfileDTO } from "@/lib/services/user.service";
import { firstNameOf, greetingFor } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const record = await getCurrentUserRecord();
  const profile = toProfileDTO(record);

  if (record.role !== "ADMIN" && !profile.profileCompleted) redirect("/onboarding");

  const available = profile.availableToDonate === true;

  return (
    <div className="space-y-7 sm:space-y-9">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-600">{greetingFor()}</p>
          <h1 className="mt-2 text-[2rem] font-bold tracking-[-0.04em] text-ink sm:text-4xl">{firstNameOf(profile.name)}</h1>
          <p className="mt-2 text-sm leading-5 text-ink-muted">Your donor profile is ready.</p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mahogany-600 text-white shadow-raised">
          <IconDroplet className="size-5" />
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[28px] bg-mahogany-700 p-6 text-white shadow-overlay sm:p-8">
        <div className="absolute -right-16 -top-20 size-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-12 size-40 rounded-full bg-black/10" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]">Donor status</span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <span className={`size-2 rounded-full ${available ? "bg-emerald-300" : "bg-white/40"}`} />
              {available ? "Available" : "Not available"}
            </span>
          </div>
          <div className="mt-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-sm text-white/70">Your blood group</p>
              <p className="mt-1 text-5xl font-bold tracking-[-0.05em]">{profile.bloodGroup ?? "—"}</p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm text-white/70">Your area</p>
              <p className="mt-1 max-w-44 text-sm font-semibold">{profile.locality}, {profile.district}</p>
            </div>
          </div>
          <div className="mt-7 flex items-center gap-2 border-t border-white/15 pt-4 text-sm text-white/80">
            <span className="size-1.5 rounded-full bg-white/70" />
            {available ? "You're visible to compatible donor requests." : "Your profile is saved, but you're currently hidden from donor matching."}
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-actions">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-subtle">Next step</p>
            <h2 id="quick-actions" className="mt-1 text-lg font-bold tracking-tight text-ink">Help when it matters</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-line bg-surface p-5 shadow-card">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-700"><IconSearch className="size-5" /></div>
            <h3 className="mt-4 font-semibold text-ink">Find blood</h3>
            <p className="mt-1 text-sm leading-5 text-ink-muted">Search for compatible blood near your area.</p>
            <span className="mt-4 inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink-subtle">Coming next</span>
          </div>
          <div className="rounded-[22px] border border-line bg-surface p-5 shadow-card">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-700"><IconDroplet className="size-5" /></div>
            <h3 className="mt-4 font-semibold text-ink">Donate blood</h3>
            <p className="mt-1 text-sm leading-5 text-ink-muted">Respond to requests that match your blood group.</p>
            <span className="mt-4 inline-flex rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold text-ink-subtle">Coming next</span>
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success-surface text-success"><IconCheck className="size-4" /></span>
          <div className="min-w-0">
            <h2 className="font-semibold text-ink">Your profile is complete</h2>
            <p className="mt-1 text-sm leading-5 text-ink-muted">Keep your phone number, location and availability current so future matches stay useful.</p>
            <Link href="/profile" className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-4 w-auto" })}>Review profile</Link>
          </div>
        </div>
      </section>

      {record.role === "ADMIN" ? (
        <Link href="/admin" className={buttonClasses({ variant: "ghost", size: "sm", className: "w-auto" })}>Open admin</Link>
      ) : null}
    </div>
  );
}
