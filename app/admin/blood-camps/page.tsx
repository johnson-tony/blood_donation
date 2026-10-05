import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { IconCalendar } from "@/components/layout/icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireAdminUser } from "@/lib/auth/guards";
import { listAllBloodCamps } from "@/lib/services/blood-camp.service";
import { createBloodCampAction, deleteBloodCampAction } from "@/app/actions/blood-camps";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Blood Camps" };

export default async function AdminBloodCampsPage() {
  await requireAdminUser();
  const camps = await listAllBloodCamps();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Blood camps"
        description="Create and publish community blood donation camps. Published camps appear on the public Blood Camps page."
      />

      <Card>
        <CardHeader>
          <CardTitle>Create a blood camp</CardTitle>
          <p className="text-sm text-ink-muted">Save as draft while details are being confirmed, or publish when ready.</p>
        </CardHeader>
        <CardBody>
          <form action={createBloodCampAction} className="grid gap-5 md:grid-cols-2">
            <Input id="name" name="name" label="Camp name" placeholder="Community blood donation drive" required />
            <Input id="organizer" name="organizer" label="Organizer" placeholder="Hospital, NGO or organisation" required />
            <Input id="date" name="date" label="Date" type="date" required />
            <div className="grid grid-cols-2 gap-3">
              <Input id="startTime" name="startTime" label="Start time" type="time" required />
              <Input id="endTime" name="endTime" label="End time" type="time" required />
            </div>
            <Input id="venue" name="venue" label="Venue" placeholder="Venue / building name" required />
            <Input id="locality" name="locality" label="Locality" placeholder="Area / town" required />
            <Input id="district" name="district" label="District" placeholder="District" required />
            <Input id="state" name="state" label="State" placeholder="State" required />
            <Input id="contactName" name="contactName" label="Contact person" placeholder="Organiser contact" required />
            <Input id="contactPhone" name="contactPhone" label="Contact phone" type="tel" placeholder="+91 98765 43210" required />
            <Select
              id="status"
              name="status"
              label="Visibility"
              defaultValue="DRAFT"
              options={[
                { value: "DRAFT", label: "Draft — hidden publicly" },
                { value: "PUBLISHED", label: "Published — visible publicly" },
              ]}
            />
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-ink">Description</label>
              <textarea id="description" name="description" required minLength={10} maxLength={1200} rows={4} placeholder="Tell donors what to expect at this camp." className="mt-1.5 block w-full resize-y rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-mahogany-600 focus:shadow-[0_0_0_4px_rgb(173_40_49_/_0.08)]" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-mahogany-600 px-5 text-sm font-semibold text-white hover:bg-mahogany-700 sm:w-auto">
                Create camp
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      {camps.length === 0 ? (
        <EmptyState icon={<IconCalendar />} title="No blood camps yet" description="Create the first camp above." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All camps</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {camps.map((camp) => (
              <div key={camp.id} className="flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{camp.name}</h3>
                    <Badge tone={camp.status === "PUBLISHED" ? "success" : "muted"}>
                      {camp.status === "PUBLISHED" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{formatDate(camp.date)} · {camp.startTime}–{camp.endTime} · {camp.locality}, {camp.district}</p>
                  <p className="mt-1 text-xs text-ink-subtle">{camp.organizer}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/blood-camps/${camp.id}/edit`} className="inline-flex h-9 items-center rounded-xl border border-line-strong px-3 text-sm font-semibold text-ink hover:bg-surface-muted">Edit</Link>
                  <form action={deleteBloodCampAction}>
                    <input type="hidden" name="id" value={camp.id} />
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
