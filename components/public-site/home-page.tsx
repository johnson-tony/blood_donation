import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { buttonClasses } from "@/components/ui/button";
import { BLOOD_GROUPS } from "@/lib/constants";

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

export function PublicHome() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandLogo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            <a href="#find-blood" className="text-sm font-medium text-ink-secondary hover:text-ink">Find Blood</a>
            <a href="#donate" className="text-sm font-medium text-ink-secondary hover:text-ink">Donate Blood</a>
            <a href="#how-it-works" className="text-sm font-medium text-ink-secondary hover:text-ink">How It Works</a>
            <a href="#camps" className="text-sm font-medium text-ink-secondary hover:text-ink">Blood Camps</a>
            <Link href="/hospitals" className="text-sm font-medium text-ink-secondary hover:text-ink">Hospitals</Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link href="/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface-muted hover:text-ink sm:inline-flex">Sign in</Link>
            <Link href="/sign-up" className={buttonClasses({ size: "sm", className: "w-auto rounded-xl px-4" })}>Become a donor</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-mahogany-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-mahogany-200 bg-surface px-3.5 py-2 text-xs font-semibold text-mahogany-800 shadow-card">
              <span className="size-2 rounded-full bg-mahogany-600" /> Blood donation, made human.
            </div>
            <h1 className="text-[2.9rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.45rem]">
              Find blood.
              <span className="block text-mahogany-700">Find a donor.</span>
              <span className="block">Help save a life.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-ink-secondary sm:text-lg">
              Find willing blood donors near you when every minute matters. Search by blood group and locality, then connect directly.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#find-blood" className={buttonClasses({ size: "lg", className: "w-full sm:w-auto sm:min-w-40" })}>Find blood <ArrowIcon /></a>
              <a href="#donate" className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full sm:w-auto sm:min-w-40" })}>Become a donor</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-muted">
              <span>✓ Locality-first matching</span>
              <span>✓ Private contact details</span>
              <span>✓ No unnecessary steps</span>
            </div>
          </div>

          <div id="find-blood" className="relative">
            <div className="rounded-[1.75rem] border border-line bg-surface p-2 shadow-raised sm:p-3">
              <div className="rounded-[1.35rem] bg-surface-muted p-5 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">Find a donor</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Start with what you know.</h2>
                <p className="mt-2 text-sm leading-6 text-ink-muted">Search by blood group and your nearest location.</p>
                <div className="mt-7 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-ink-secondary">Blood group</span>
                    <select className="h-13 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" defaultValue="">
                      <option value="" disabled>Select blood group</option>
                      {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-ink-secondary">Location</span>
                    <input placeholder="Village, locality or district" className="h-13 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
                  </label>
                  <Link href="/sign-up" className={buttonClasses({ size: "lg", className: "mt-2 rounded-2xl" })}>Continue to find donors <ArrowIcon /></Link>
                </div>
                <p className="mt-5 text-center text-[0.72rem] leading-5 text-ink-subtle">Donor phone numbers are not publicly exposed. Contact details are shared through the request flow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Three clear steps. No noise.</h2>
            <p className="mt-4 text-base leading-7 text-ink-secondary">The product stays out of the way so people can focus on connecting the right people quickly.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3">
            {[
              ["01", "Search", "Choose the blood group and area where blood is needed."],
              ["02", "Request", "Send a focused request to a suitable available donor."],
              ["03", "Connect", "Contact the donor directly and coordinate the donation."],
            ].map(([number, title, description]) => (
              <div key={number} className="bg-surface p-7 sm:p-9">
                <span className="text-xs font-semibold tracking-[0.14em] text-mahogany-600">{number}</span>
                <h3 className="mt-10 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="donate" className="border-b border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">For donors</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Your availability can become someone’s chance.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-secondary">Create a profile, choose when you are available, and let people in your area reach you when your blood group is needed.</p>
          </div>
          <Link href="/sign-up" className={buttonClasses({ size: "lg", className: "w-auto min-w-44" })}>Become a donor <ArrowIcon /></Link>
        </div>
      </section>

      <section id="camps" className="bg-mahogany-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-300">Built for real communities</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Local first. Human always.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/65">From a nearby locality to a wider district, the experience is designed around real-world proximity instead of noisy feeds or complicated matching.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-white/70">
            {["Locality", "District", "State", "Availability"].map((item) => <span key={item} className="rounded-full border border-white/15 px-3 py-2">{item}</span>)}
          </div>
        </div>
      </section>

      <footer className="bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <BrandLogo />
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-ink-muted">
            <Link href="/sign-in" className="hover:text-ink">Sign in</Link>
            <Link href="/sign-up" className="hover:text-ink">Create account</Link>
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
          </div>
          <p className="text-xs text-ink-subtle">A focused platform for blood donation.</p>
        </div>
      </footer>
    </main>
  );
}
