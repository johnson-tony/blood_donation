import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { IconCalendar, IconSearch } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listPublishedBloodCamps } from "@/lib/services/blood-camp.service";
import { formatDate } from "@/lib/utils/format";
import type { BloodCampFilters } from "@/types/blood-camp";

export const metadata: Metadata = {
  title: "Blood Camps",
  description: "Find upcoming blood donation camps by location and date.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function BloodCampsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters: BloodCampFilters = {
    search: valueOf(params.search),
    state: valueOf(params.state),
    district: valueOf(params.district),
    locality: valueOf(params.locality),
    date: (valueOf(params.date) || "upcoming") as BloodCampFilters["date"],
  };
  const camps = await listPublishedBloodCamps(filters);

  return (
    <main className="min-h-screen bg-surface-muted">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="Jeevan Rakt home"><BrandLogo /></Link>
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="rounded-xl px-3 py-2 text-sm font-medium text-ink-secondary hover:bg-surface-muted">Sign in</Link>
            <Link href="/donate-blood" className="rounded-xl bg-mahogany-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-mahogany-700">Donate blood</Link>
          </div>
        </div>
      </header>

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl space-y-4">
            <Badge tone="brand">Community blood camps</Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
              Donate blood at a camp near you.
            </h1>
            <p className="text-base leading-7 text-ink-muted sm:text-lg">
              Find verified camp details, check the location and timing, then contact the organiser before you go.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Card>
          <CardBody className="border-0 p-4 sm:p-6">
            <form method="get" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 lg:items-end">
              <Input id="search" name="search" label="Search" placeholder="Camp, organiser or area" defaultValue={filters.search} containerClassName="lg:col-span-2" />
              <Input id="state" name="state" label="State" placeholder="e.g. Karnataka" defaultValue={filters.state} />
              <Input id="district" name="district" label="District" placeholder="e.g. Bengaluru" defaultValue={filters.district} />
              <Input id="locality" name="locality" label="Locality" placeholder="Area / town" defaultValue={filters.locality} />
              <Select
                id="date"
                name="date"
                label="When"
                defaultValue={filters.date}
                options={[
                  { value: "upcoming", label: "Upcoming" },
                  { value: "past", label: "Past camps" },
                  { value: "all", label: "All camps" },
                ]}
              />
              <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-mahogany-600 px-5 text-sm font-semibold text-white shadow-card hover:bg-mahogany-700 lg:col-span-5 lg:justify-self-start">
                <IconSearch className="size-4" /> Apply filters
              </button>
            </form>
          </CardBody>
        </Card>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-muted">{camps.length} camp{camps.length === 1 ? "" : "s"} found</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
              {filters.date === "past" ? "Past camps" : filters.date === "all" ? "All camps" : "Upcoming camps"}
            </h2>
          </div>
          {(filters.search || filters.state || filters.district || filters.locality || filters.date !== "upcoming") ? (
            <Link href="/blood-camps" className="text-sm font-semibold text-mahogany-700 hover:text-mahogany-800">Clear filters</Link>
          ) : null}
        </div>

        {camps.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              icon={<IconCalendar />}
              title="No blood camps match those filters"
              description="Try a wider location or switch the date filter to All camps."
            />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {camps.map((camp) => (
              <Card key={camp.id} className="overflow-hidden">
                <CardBody className="border-0 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mahogany-700">
                        {formatDate(camp.date)}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">{camp.name}</h3>
                      <p className="mt-1 text-sm text-ink-muted">{camp.organizer}</p>
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mahogany-50 text-mahogany-700"><IconCalendar /></span>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-ink-secondary">
                    <p><span className="font-medium text-ink">Time:</span> {camp.startTime} – {camp.endTime}</p>
                    <p><span className="font-medium text-ink">Venue:</span> {camp.venue}</p>
                    <p><span className="font-medium text-ink">Area:</span> {camp.locality}, {camp.district}, {camp.state}</p>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-ink-muted">{camp.description}</p>

                  <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs text-ink-subtle">Contact: {camp.contactName}</span>
                    <a href={`tel:${camp.contactPhone.replace(/[^+\d]/g, "")}`} className="font-semibold text-mahogany-700 hover:text-mahogany-800">
                      Call organiser
                    </a>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
