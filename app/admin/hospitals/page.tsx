import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { IconBuilding } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireAdminUser } from "@/lib/auth/guards";
import { listAllHospitals } from "@/lib/services/hospital.service";
import { createHospitalAction, deleteHospitalAction } from "@/app/actions/hospitals";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Hospitals" };

export default async function AdminHospitalsPage() {
  await requireAdminUser();
  const hospitals = await listAllHospitals();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Hospitals" description="Create and publish trusted hospital records. Published hospitals appear in the public directory." />

      <Card>
        <CardHeader>
          <CardTitle>Add a hospital</CardTitle>
          <p className="text-sm text-ink-muted">Keep the directory focused on verified, useful contact information.</p>
        </CardHeader>
        <CardBody>
          <form action={createHospitalAction} className="grid gap-5 md:grid-cols-2">
            <Input id="name" name="name" label="Hospital name" placeholder="Hospital or medical centre" required />
            <Input id="hospitalType" name="hospitalType" label="Type" placeholder="General / multispeciality" required />
            <Input id="address" name="address" label="Full address" placeholder="Street, building or landmark" required />
            <Input id="locality" name="locality" label="Locality" placeholder="Area / town" required />
            <Input id="district" name="district" label="District" placeholder="District" required />
            <Input id="state" name="state" label="State" placeholder="State" required />
            <Input id="contactName" name="contactName" label="Contact person" placeholder="Hospital contact" required />
            <Input id="contactPhone" name="contactPhone" label="Contact phone" type="tel" placeholder="+91 98765 43210" required />
            <Input id="emergencyPhone" name="emergencyPhone" label="Emergency phone" type="tel" placeholder="Emergency number" required />
            <Input id="website" name="website" label="Website" type="url" placeholder="https://example.com" />
            <Select id="hasBloodBank" name="hasBloodBank" label="Blood bank" defaultValue="false" options={[
              { value: "true", label: "Yes — blood bank available" },
              { value: "false", label: "No blood bank" },
            ]} />
            <Select id="status" name="status" label="Visibility" defaultValue="DRAFT" options={[
              { value: "DRAFT", label: "Draft — hidden publicly" },
              { value: "PUBLISHED", label: "Published — visible publicly" },
            ]} />
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-ink">Description</label>
              <textarea id="description" name="description" required minLength={10} maxLength={1200} rows={4} placeholder="Short, useful description of the hospital and its services." className="mt-1.5 block w-full resize-y rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-mahogany-600 focus:shadow-[0_0_0_4px_rgb(173_40_49_/_0.08)]" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-mahogany-600 px-5 text-sm font-semibold text-white hover:bg-mahogany-700 sm:w-auto">Add hospital</button>
            </div>
          </form>
        </CardBody>
      </Card>

      {hospitals.length === 0 ? (
        <EmptyState icon={<IconBuilding />} title="No hospitals yet" description="Add the first hospital above." />
      ) : (
        <Card>
          <CardHeader><CardTitle>All hospitals</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            {hospitals.map((hospital) => (
              <div key={hospital.id} className="flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{hospital.name}</h3>
                    <Badge tone={hospital.status === "PUBLISHED" ? "success" : "muted"}>{hospital.status === "PUBLISHED" ? "Published" : "Draft"}</Badge>
                    {hospital.hasBloodBank ? <Badge tone="brand">Blood bank</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{hospital.hospitalType} · {hospital.locality}, {hospital.district}</p>
                  <p className="mt-1 text-xs text-ink-subtle">Added {formatDate(hospital.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/hospitals/${hospital.id}/edit`} className="inline-flex h-9 items-center rounded-xl border border-line-strong px-3 text-sm font-semibold text-ink hover:bg-surface-muted">Edit</Link>
                  <form action={deleteHospitalAction}>
                    <input type="hidden" name="id" value={hospital.id} />
                    <button type="submit" className="inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold text-mahogany-700 hover:bg-mahogany-50">Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
