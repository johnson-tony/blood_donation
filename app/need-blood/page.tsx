import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { buttonClasses } from "@/components/ui/button";
import { BLOOD_GROUPS } from "@/lib/constants";

export default function NeedBloodPage() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-line bg-canvas/95">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden rounded-xl px-3.5 py-2 text-sm font-semibold text-ink-secondary hover:bg-surface-muted sm:inline-flex">Sign in</Link>
            <Link href="/sign-up" className={buttonClasses({ size: "sm", className: "w-auto rounded-xl px-4" })}>Become a donor</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mahogany-700">Need blood?</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Tell us what is needed.</h1>
          <p className="mt-5 text-base leading-7 text-ink-secondary">Give us the essential details and we’ll take you straight to suitable donors. No unnecessary steps.</p>
        </div>

        <form action="/find-blood" method="get" className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <section className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-raised sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">Blood group</span>
                <select name="bloodGroup" required defaultValue="" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10">
                  <option value="" disabled>Select blood group</option>
                  {BLOOD_GROUPS.map((group) => <option key={group} value={group}>{group}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">Units required</span>
                <input name="units" type="number" min="1" max="20" defaultValue="1" required className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">Hospital</span>
                <input name="hospital" placeholder="Hospital or treatment centre" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">State</span>
                <input name="state" placeholder="e.g. Tamil Nadu" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">District</span>
                <input name="district" placeholder="e.g. Tiruchirappalli" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-ink-secondary">Village / locality</span>
                <input name="locality" placeholder="Where is the blood needed?" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm font-medium outline-none placeholder:text-ink-subtle focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" />
              </label>

              <fieldset className="sm:col-span-2">
                <legend className="mb-3 text-xs font-semibold text-ink-secondary">When is it needed?</legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["urgent", "Urgent", "Needed now"],
                    ["today", "Today", "Needed today"],
                    ["scheduled", "Scheduled", "Plan ahead"],
                  ].map(([value, label, description]) => (
                    <label key={value} className="cursor-pointer rounded-2xl border border-line-strong bg-surface p-4 transition hover:border-mahogany-500 has-[:checked]:border-mahogany-600 has-[:checked]:bg-mahogany-50">
                      <input type="radio" name="urgency" value={value} defaultChecked={value === "urgent"} className="sr-only" />
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="mt-1 block text-xs text-ink-muted">{description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-ink-muted">Your details are used to narrow the donor search. Donor contact details remain private.</p>
              <button type="submit" className={buttonClasses({ size: "lg", className: "sm:w-auto sm:min-w-44" })}>Find suitable donors →</button>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-mahogany-200 bg-mahogany-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mahogany-700">What happens next</p>
            <ol className="mt-5 space-y-5">
              {[
                ["01", "Search", "We look for available donors with the required blood group."],
                ["02", "Prioritise", "Nearby locality, district and state are considered first."],
                ["03", "Connect", "You can request a suitable donor and contact them through the proper flow."],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-3">
                  <span className="text-xs font-bold text-mahogany-600">{number}</span>
                  <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-ink-secondary">{description}</p></div>
                </li>
              ))}
            </ol>
          </aside>
        </form>
      </div>
    </main>
  );
}
