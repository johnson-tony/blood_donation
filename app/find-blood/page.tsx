import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { buttonClasses } from "@/components/ui/button";
import { BLOOD_GROUPS } from "@/lib/constants";
import { findAvailableDonors } from "@/lib/services/donor-search.service";
import type { BloodGroup } from "@/types/user";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isBloodGroup(value: string | undefined): value is BloodGroup {
  return Boolean(value && BLOOD_GROUPS.includes(value as BloodGroup));
}

export default async function FindBloodPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const bloodGroup = first(params.bloodGroup);
  const state = first(params.state)?.trim() || "";
  const district = first(params.district)?.trim() || "";
  const locality = first(params.locality)?.trim() || "";
  const searched = isBloodGroup(bloodGroup);

  const donors = searched
    ? await findAvailableDonors({ bloodGroup, state, district, locality })
    : [];

  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-canvas/95">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink sm:inline-flex">Sign in</Link>
            <Link href="/sign-up" className={buttonClasses({ size: "sm", className: "w-auto rounded-xl px-4" })}>Become a donor</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">Find blood</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Find a blood donor near you.</h1>
          <p className="mt-5 text-base leading-7 text-ink-secondary">Search available donors by blood group and locality. Results are prioritised from the closest area outward.</p>
        </div>

        <form method="get" className="mt-10 rounded-[1.75rem] border border-line bg-surface p-5 shadow-raised sm:p-7">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-ink-secondary">Blood group</span>
              <select name="bloodGroup" defaultValue={bloodGroup ?? ""} required className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10">
                <option value="" disabled>Select blood group</option>
                {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
              </select>
            </label>
            {[
              ["state", "State", state, "e.g. Tamil Nadu"],
              ["district", "District", district, "e.g. Tiruchirappalli"],
              ["locality", "Village / locality", locality, "e.g. Lalgudi"],
            ].map(([name, label, value, placeholder]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">{label}</span>
                <input name={name} defaultValue={value} placeholder={placeholder} className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-ink-muted">Only donors who marked themselves available are shown. Phone numbers stay private until a request is made.</p>
            <button type="submit" className={buttonClasses({ size: "lg", className: "sm:w-auto sm:min-w-40" })}>Find donors</button>
          </div>
        </form>

        {!searched ? (
          <div className="mt-12 rounded-3xl border border-dashed border-line-strong bg-surface p-10 text-center">
            <p className="text-sm font-semibold">Choose a blood group to start.</p>
            <p className="mt-2 text-sm text-ink-muted">Add your locality, district or state for more relevant results.</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-line bg-surface p-10 text-center shadow-card">
            <p className="text-sm font-semibold">No available donors found for this search.</p>
            <p className="mt-2 text-sm text-ink-muted">Try a wider area, such as the district or state, or check another blood group.</p>
          </div>
        ) : (
          <section className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">Available donors</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{donors.length} match{donors.length === 1 ? "" : "es"} found</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {donors.map((donor) => (
                <article key={donor.id} className="rounded-3xl border border-line bg-surface p-6 shadow-card transition-shadow hover:shadow-raised">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{donor.name}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{donor.locality}, {donor.district}</p>
                    </div>
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-mahogany-50 text-sm font-bold text-mahogany-800">{donor.bloodGroup}</span>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-success"><span className="size-2 rounded-full bg-success" /> Available to donate</div>
                  <div className="mt-5 flex items-center justify-between border-t border-line pt-5">
                    <span className="text-xs text-ink-subtle">{donor.state}</span>
                    <Link href="/sign-in" className="text-sm font-semibold text-mahogany-700 hover:text-mahogany-800">Request blood →</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
