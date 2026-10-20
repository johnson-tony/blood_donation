import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import {
  IconActivity,
  IconArrowRight,
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconDroplet,
  IconHeart,
  IconMapPin,
  IconSearch,
  IconStethoscope,
} from "@/components/layout/icons";
import { buttonClasses } from "@/components/ui/button";
import { BLOOD_GROUPS } from "@/lib/constants";

export function PublicHome() {
  return (
    <main className="min-h-screen bg-canvas text-ink selection:bg-mahogany-100 selection:text-mahogany-900">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-line/70 bg-surface/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandLogo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            <a href="#find-blood" className="text-sm font-semibold text-ink-secondary transition-colors hover:text-mahogany-600">Find Blood</a>
            <a href="#how-it-works" className="text-sm font-semibold text-ink-secondary transition-colors hover:text-mahogany-600">How It Works</a>
            <a href="#what-to-expect" className="text-sm font-semibold text-ink-secondary transition-colors hover:text-mahogany-600">What to Expect</a>
            <Link href="/blood-camps" className="text-sm font-semibold text-ink-secondary transition-colors hover:text-mahogany-600">Blood Camps</Link>
            <Link href="/hospitals" className="text-sm font-semibold text-ink-secondary transition-colors hover:text-mahogany-600">Hospitals</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-ink-secondary transition hover:bg-surface-muted hover:text-ink sm:inline-flex"
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

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-line/70">
        {/* Glow backdrop effects */}
        <div className="pointer-events-none absolute -right-36 -top-36 size-[32rem] rounded-full bg-mahogany-500/10 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 top-1/2 size-[26rem] -translate-y-1/2 rounded-full bg-mahogany-600/5 blur-[100px]" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:pb-24">
          <div className="max-w-2xl">
            {/* Pill Announcement */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mahogany-200/80 bg-surface px-4 py-1.5 text-xs font-semibold text-mahogany-700 shadow-card">
              <span className="flex size-2 rounded-full bg-mahogany-600 animate-pulse" />
              Every Drop Holds Hope
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
              Your Blood Deserves
              <span className="block bg-gradient-to-r from-mahogany-600 via-mahogany-700 to-mahogany-800 bg-clip-text text-transparent">
                to Save a Life.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-ink-secondary sm:text-lg">
              Advanced, locality-first blood donor matching. Connect with voluntary donors, find emergency blood units, and schedule donations in minutes.
            </p>

            {/* CTA Group with Pill + Circular Button */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#find-blood"
                className={buttonClasses({
                  variant: "primary",
                  size: "lg",
                  shape: "pill",
                  className: "shadow-glow min-w-44 px-7 text-sm sm:text-base",
                })}
              >
                Find Blood Now
                <IconArrowRight className="size-4" />
              </a>

              <Link
                href="/sign-up"
                className={buttonClasses({
                  variant: "secondary",
                  size: "lg",
                  shape: "pill",
                  className: "px-6 text-sm sm:text-base",
                })}
              >
                Become a Donor
              </Link>

              {/* Circular Quick Action Button */}
              <Link
                href="/need-blood"
                title="Immediate Blood Request"
                className="inline-flex size-13 items-center justify-center rounded-full border border-line bg-surface text-mahogany-600 shadow-card transition-all duration-200 hover:scale-105 hover:border-mahogany-200 hover:bg-mahogany-50 active:scale-95"
              >
                <IconHeart className="size-6 fill-mahogany-600 text-mahogany-600" />
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-xs font-semibold text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                Locality-first matching
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                Private contact details
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                100% Free & Voluntary
              </span>
            </div>
          </div>

          {/* Right Showcase: CardioLife Inspired Visual Cards */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Background glowing frame */}
            <div className="rounded-[32px] border border-line/80 bg-gradient-to-b from-surface via-surface to-surface-muted/60 p-4 shadow-raised sm:p-5">
              {/* App-like top status indicator */}
              <div className="mb-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">Live Donor Network</span>
                </div>
                <span className="text-xs font-semibold text-mahogany-700">Active Now</span>
              </div>

              {/* CARD 1: Featured Crimson Card (like CardioLife middle screen top card) */}
              <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-mahogany-600 via-mahogany-700 to-mahogany-800 p-5 text-white shadow-glow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/20 text-white">
                      <IconDroplet className="size-4 fill-white" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-white/90">Urgent Match</span>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[0.7rem] font-semibold tracking-wide text-white">
                    NEEDED TODAY
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {/* Avatar stack */}
                  <div className="flex -space-x-2">
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-mahogany-700 bg-white text-[0.65rem] font-bold text-mahogany-700">O+</div>
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-mahogany-700 bg-white text-[0.65rem] font-bold text-mahogany-700">A+</div>
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-mahogany-700 bg-white text-[0.65rem] font-bold text-mahogany-700">B+</div>
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-mahogany-700 bg-mahogany-900 text-[0.65rem] font-bold text-white">+5</div>
                  </div>
                  <span className="text-xs font-medium text-white/85">8 Donors available nearby</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
                  <div>
                    <h2 className="text-base font-bold">City Central Hospital</h2>
                    <p className="text-xs text-white/75">Emergency Blood Bank • 2.4 km away</p>
                  </div>
                  <Link
                    href="/find-blood"
                    className="flex size-9 items-center justify-center rounded-full bg-white text-mahogany-700 shadow-sm transition hover:scale-105 active:scale-95"
                    aria-label="View urgent match"
                  >
                    <IconChevronRight className="size-4.5" />
                  </Link>
                </div>
              </div>

              {/* CARD 2: White Elevated Service Card (Scheduled Camp) */}
              <div className="mt-3.5 flex items-center justify-between rounded-[22px] border border-line bg-surface p-4 shadow-card transition hover:border-mahogany-200 hover:shadow-raised">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600">
                    <IconCalendar className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-ink">Community Blood Drive</h2>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">Open</span>
                    </div>
                    <p className="text-xs text-ink-muted">Red Cross Civic Center • 09:00 - 02:00 PM</p>
                  </div>
                </div>
                <Link
                  href="/blood-camps"
                  className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-ink-secondary transition hover:bg-mahogany-50 hover:text-mahogany-700"
                  aria-label="View blood camp details"
                >
                  <IconChevronRight className="size-4" />
                </Link>
              </div>

              {/* CARD 3: White Elevated Service Card (Doctor / Verified Donor Consultation) */}
              <div className="mt-3 flex items-center justify-between rounded-[22px] border border-line bg-surface p-4 shadow-card transition hover:border-mahogany-200 hover:shadow-raised">
                <div className="flex items-center gap-3.5">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600">
                    <IconStethoscope className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-ink">Donor Health Screening</h2>
                      <span className="rounded-full bg-mahogany-50 px-2 py-0.5 text-[0.65rem] font-semibold text-mahogany-700">Free</span>
                    </div>
                    <p className="text-xs text-ink-muted">Hemoglobin, BP & Compatibility • 15 min</p>
                  </div>
                </div>
                <Link
                  href="/hospitals"
                  className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-ink-secondary transition hover:bg-mahogany-50 hover:text-mahogany-700"
                  aria-label="View health screening details"
                >
                  <IconChevronRight className="size-4" />
                </Link>
              </div>

              {/* Bottom pill banner inside showcase */}
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-muted/80 px-4 py-2.5 text-xs">
                <span className="font-medium text-ink-secondary">Caring for lives, every step of the way.</span>
                <Link href="/find-blood" className="font-bold text-mahogany-600 hover:text-mahogany-700">
                  Search Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter / Search Section (Inspired by Middle Screen) */}
      <section id="find-blood" className="border-b border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-600">Direct Locality Matching</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Find Available Blood Donors</h2>
            <p className="mt-3 text-base text-ink-muted">Filter by blood group and locality to connect directly with willing donors in your area.</p>

            {/* Category Filter Pills (Like CardioLife Filter Chips) */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="cursor-pointer rounded-full bg-mahogany-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm">All Groups</span>
              <span className="cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink-secondary hover:border-mahogany-300 hover:text-mahogany-700">O Positive (Universal)</span>
              <span className="cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink-secondary hover:border-mahogany-300 hover:text-mahogany-700">Rare (O-, AB-)</span>
              <span className="cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink-secondary hover:border-mahogany-300 hover:text-mahogany-700">Blood Camps</span>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <form action="/find-blood" method="get" className="rounded-[24px] border border-line bg-surface p-4 shadow-raised sm:p-5">
              <div className="grid gap-3.5 sm:grid-cols-[1fr_1.5fr_auto]">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-ink-secondary">Blood Group</span>
                  <select
                    name="bloodGroup"
                    required
                    defaultValue=""
                    className="h-10.5 w-full rounded-xl border border-line-strong/80 bg-surface px-3.5 text-sm font-semibold text-ink outline-none transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10 shadow-xs"
                  >
                    <option value="" disabled>Select group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-ink-secondary">Locality or District</span>
                  <div className="relative">
                    <input
                      name="locality"
                      placeholder="e.g. Indiranagar, Bangalore"
                      autoComplete="address-level3"
                      className="h-10.5 w-full rounded-xl border border-line-strong/80 bg-surface pl-9 pr-3.5 text-sm font-medium text-ink outline-none placeholder:text-ink-subtle transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10 shadow-xs"
                    />
                    <IconMapPin className="absolute left-3 top-3 size-4 text-ink-subtle" />
                  </div>
                </label>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className={buttonClasses({
                      variant: "primary",
                      size: "md",
                      shape: "pill",
                      className: "h-10.5 w-full px-6 shadow-glow sm:w-auto text-sm",
                    })}
                  >
                    <IconSearch className="size-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
              <p className="mt-4 text-center text-[0.75rem] text-ink-subtle">
                Donor phone numbers remain private until a direct request is confirmed.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* "What to Expect" Section (Inspired by Right Screen of CardioLife) */}
      <section id="what-to-expect" className="border-b border-line bg-canvas py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-600">The Donation Process</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">What to Expect</h2>
            <p className="mt-3 text-base text-ink-secondary">
              Donating blood is simple, safe, and takes less than an hour from start to finish. Here is what happens step by step.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="rounded-[26px] border border-line bg-surface p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-mahogany-200 hover:shadow-raised">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600 shadow-sm">
                <IconStethoscope className="size-6" />
              </div>
              <span className="mt-4 inline-block text-[0.7rem] font-bold uppercase tracking-wider text-mahogany-600">Step 01</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Health Checkup</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                A quick check of temperature, blood pressure, pulse, and hemoglobin to ensure you are fit to donate.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[26px] border border-line bg-surface p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-mahogany-200 hover:shadow-raised">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600 shadow-sm">
                <IconActivity className="size-6" />
              </div>
              <span className="mt-4 inline-block text-[0.7rem] font-bold uppercase tracking-wider text-mahogany-600">Step 02</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Blood Donation</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                The actual blood draw takes only 8–10 minutes using sterile, single-use medical equipment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[26px] border border-line bg-surface p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-mahogany-200 hover:shadow-raised">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600 shadow-sm">
                <IconClock className="size-6" />
              </div>
              <span className="mt-4 inline-block text-[0.7rem] font-bold uppercase tracking-wider text-mahogany-600">Step 03</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Rest & Refreshments</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Relax for 10–15 minutes while enjoying healthy snacks and juice to replenish fluids and energy.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[26px] border border-line bg-surface p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:border-mahogany-200 hover:shadow-raised">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-mahogany-50 text-mahogany-600 shadow-sm">
                <IconHeart className="size-6 fill-mahogany-600 text-mahogany-600" />
              </div>
              <span className="mt-4 inline-block text-[0.7rem] font-bold uppercase tracking-wider text-mahogany-600">Step 04</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Save 3 Lives</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                Your unit is separated into red cells, platelets, and plasma, giving hope to up to 3 patients in emergency care.
              </p>
            </div>
          </div>

          {/* CardioLife Style Bottom Banner Callout */}
          <div className="mt-12 overflow-hidden rounded-[26px] bg-gradient-to-r from-mahogany-600 via-mahogany-700 to-mahogany-800 p-6 text-white shadow-glow sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <IconHeart className="size-6 fill-white text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Caring for your community, every drop of the way.</h3>
                  <p className="text-sm text-white/80">Every 2 seconds, someone in the country needs blood. Join the voluntary network today.</p>
                </div>
              </div>
              <Link
                href="/sign-up"
                className={buttonClasses({
                  variant: "secondary",
                  size: "md",
                  shape: "pill",
                  className: "shrink-0 bg-white text-mahogany-700 hover:bg-white/90 shadow-sm font-bold",
                })}
              >
                Register as Donor →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-surface py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <BrandLogo />
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs font-semibold text-ink-muted">
            <Link href="/find-blood" className="hover:text-mahogany-600">Find Blood</Link>
            <Link href="/blood-camps" className="hover:text-mahogany-600">Blood Camps</Link>
            <Link href="/hospitals" className="hover:text-mahogany-600">Hospitals</Link>
            <Link href="/sign-in" className="hover:text-mahogany-600">Sign in</Link>
            <Link href="/sign-up" className="hover:text-mahogany-600">Register as Donor</Link>
          </div>
          <p className="text-xs text-ink-subtle">A focused, compassionate blood donation platform.</p>
        </div>
      </footer>
    </main>
  );
}
