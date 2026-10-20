import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import {
  IconArrowRight,
  IconChevronRight,
  IconDroplet,
  IconSearch,
  IconShield,
} from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { StateDistrictSelect } from "@/components/ui/state-district-select";
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
      <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={buttonClasses({
                variant: "primary",
                size: "sm",
                shape: "pill",
                className: "px-5 shadow-glow",
              })}
            >
              Become a donor
              <IconArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-mahogany-200 bg-surface px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-mahogany-700 shadow-card">
            <IconDroplet className="size-3.5 fill-mahogany-600 text-mahogany-600" />
            Locality Matching
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Find Blood Donors Near You
          </h1>
          <p className="mt-4 text-base leading-7 text-ink-secondary">
            Connect directly with verified, voluntary blood donors. Results prioritize the closest matches to save critical time.
          </p>
        </div>

        {/* Filter Card */}
        <form
          method="get"
          className="mt-8 rounded-[24px] border border-line bg-surface p-5 shadow-raised sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-ink-secondary">Blood Group</span>
              <select
                name="bloodGroup"
                defaultValue={bloodGroup ?? ""}
                required
                className="h-10.5 w-full rounded-xl border border-line-strong/80 bg-surface px-3.5 text-sm font-semibold text-ink outline-none transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10 shadow-xs"
              >
                <option value="" disabled>Select blood group</option>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </label>

            <StateDistrictSelect
              defaultState={state}
              defaultDistrict={district}
              required={false}
              className="contents"
            />

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-ink-secondary">Village / Locality</span>
              <input
                name="locality"
                defaultValue={locality}
                placeholder="e.g. Lalgudi"
                className="h-10.5 w-full rounded-xl border border-line-strong/80 bg-surface px-3.5 text-sm font-medium outline-none placeholder:text-ink-subtle transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10 shadow-xs"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3.5 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-muted">
              🔒 Phone numbers stay private until you send a direct request.
            </p>
            <button
              type="submit"
              className={buttonClasses({
                variant: "primary",
                size: "md",
                shape: "pill",
                className: "h-10.5 px-6 shadow-glow sm:w-auto text-sm",
              })}
            >
              <IconSearch className="size-4" />
              <span>Search Available Donors</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {!searched ? (
          <div className="mt-12 rounded-[28px] border border-dashed border-line-strong bg-surface/50 p-12 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600">
              <IconDroplet className="size-7 fill-mahogany-600" />
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Choose a Blood Group to Search</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Select your required blood type and optionally add locality or district for precise matches.
            </p>
          </div>
        ) : donors.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-line bg-surface p-12 text-center shadow-card">
            <h3 className="text-base font-bold text-ink">No Donors Currently Available</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Try expanding your search by clearing the village/locality field to view district-wide donors.
            </p>
          </div>
        ) : (
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-mahogany-600">Search Results</span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink">
                  {donors.length} Verified Donor{donors.length === 1 ? "" : "s"} Found
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {donors.map((donor) => (
                <article
                  key={donor.id}
                  className="group rounded-[26px] border border-line bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-mahogany-200 hover:shadow-raised"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-base font-extrabold text-mahogany-700">
                        {donor.name ? donor.name.slice(0, 2).toUpperCase() : "DO"}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-ink group-hover:text-mahogany-700 transition-colors">
                          {donor.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {donor.locality}, {donor.district}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-mahogany-600 to-mahogany-700 text-sm font-black text-white shadow-glow">
                      {donor.bloodGroup}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-xl bg-surface-muted/60 px-3.5 py-2 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      Available to Donate
                    </span>
                    <span className="text-ink-subtle">{donor.state}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-xs text-ink-muted flex items-center gap-1">
                      <IconShield className="size-3.5 text-mahogany-600" /> Verified Member
                    </span>
                    <Link
                      href={`/request-donor?donorId=${donor.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-mahogany-600 transition hover:text-mahogany-700"
                    >
                      <span>Request Blood</span>
                      <IconChevronRight className="size-3.5" />
                    </Link>
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
