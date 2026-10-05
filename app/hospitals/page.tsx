import type { Metadata } from "next";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand";
import { IconBuilding, IconSearch } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listPublishedHospitals } from "@/lib/services/hospital.service";
import type { HospitalFilters } from "@/types/hospital";

export const metadata: Metadata = {
  title: "Hospitals",
  description: "Find hospitals and blood-bank facilities near you.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function valueOf(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HospitalsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const filters: HospitalFilters = {
    search: valueOf(params.search),
    state: valueOf(params.state),
    district: valueOf(params.district),
    locality: valueOf(params.locality),
    bloodBank: valueOf(params.bloodBank) as HospitalFilters["bloodBank"],
  };
  const hospitals = await listPublishedHospitals(filters);

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-surface/95">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden text-sm font-semibold text-ink-muted hover:text-ink sm:inline-flex">Sign in</Link>
            <Link href="/donate-blood" className="inline-flex h-10 items-center rounded-xl bg-mahogany-600 px-4 text-sm font-semibold text-white hover:bg-mahogany-700">Donate blood</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-600">Hospital directory</p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-ink sm:text-5xl">Find a hospital near you.</h1>
          <p className="mt-3 text-sm leading-6 text-ink-muted sm:text-base">
            Find published hospitals, their contact details and whether a blood bank is available.
          </p>
        </div>

        <form method="get" className="mt-8 rounded-[24px] border border-line bg-surface p-4 shadow-card sm:p-5">
          <div className="grid gap-3 md:grid-cols-5">
            <Input id="search" name="search" label="Search" placeholder="Hospital or area" defaultValue={filters.search} />
            <Input id="state" name="state" label="State" placeholder="State" defaultValue={filters.state} />
            <Input id="district" name="district" label="District" placeholder="District" defaultValue={filters.district} />
            <Input id="locality" name="locality" label="Locality" placeholder="Locality" defaultValue={filters.locality} />
            <Select id="bloodBank" name="bloodBank" label="Blood bank" defaultValue={filters.bloodBank ?? "all"} options={[
              { value: "all", label: "All hospitals" },
              { value: "yes", label: "Has blood bank" },
              { value: "no", label: "No blood bank" },
            ]} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-mahogany-600 px-5 text-sm font-semibold text-white hover:bg-mahogany-700">
              <IconSearch className="size-4" /> Search hospitals
            </button>
            <Link href="/hospitals" className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-semibold text-ink-muted hover:bg-surface-muted">Clear</Link>
          </div>
        </form>

        <p className="mt-8 text-sm text-ink-muted">{hospitals.length} hospital{hospitals.length === 1 ? "" : "s"} found</p>

        {hospitals.length === 0 ? (
          <div className="mt-5">
            <EmptyState icon={<IconBuilding />} title="No hospitals found" description="Try a broader area, district or blood-bank filter." />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="h-full">
                <CardBody className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold tracking-tight text-ink">{hospital.name}</h2>
                      <p className="mt-1 text-sm text-ink-muted">{hospital.hospitalType} · {hospital.locality}, {hospital.district}</p>
                    </div>
                    {hospital.hasBloodBank ? <Badge tone="success">Blood bank</Badge> : <Badge tone="muted">Hospital</Badge>}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-ink-muted">{hospital.description}</p>
                  <p className="mt-4 text-sm font-medium text-ink">{hospital.address}</p>
                  <div className="mt-5 grid gap-2 border-t border-line pt-4 text-sm">
                    <a href={`tel:${hospital.contactPhone}`} className="font-semibold text-mahogany-700 hover:underline">Call hospital · {hospital.contactPhone}</a>
                    <a href={`tel:${hospital.emergencyPhone}`} className="font-semibold text-mahogany-700 hover:underline">Emergency · {hospital.emergencyPhone}</a>
                    {hospital.website ? <a href={hospital.website} target="_blank" rel="noreferrer" className="font-semibold text-ink-muted hover:text-ink">Hospital website →</a> : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
