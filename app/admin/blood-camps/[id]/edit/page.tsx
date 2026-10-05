import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireAdminUser } from "@/lib/auth/guards";
import { getBloodCampById } from "@/lib/services/blood-camp.service";
import { updateBloodCampAction } from "@/app/actions/blood-camps";

export const metadata: Metadata = { title: "Edit blood camp" };

export default async function EditBloodCampPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminUser();
  const { id } = await params;
  const camp = await getBloodCampById(id);
  if (!camp) notFound();

  const date = camp.date.slice(0, 10);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin · Blood camps"
        title="Edit camp"
        description="Update the camp details or change its public visibility."
      />

      <Card>
        <CardBody className="border-0">
          <form action={updateBloodCampAction} className="grid gap-5 md:grid-cols-2">
            <input type="hidden" name="id" value={camp.id} />
            <Input id="name" name="name" label="Camp name" defaultValue={camp.name} required />
            <Input id="organizer" name="organizer" label="Organizer" defaultValue={camp.organizer} required />
            <Input id="date" name="date" label="Date" type="date" defaultValue={date} required />
            <div className="grid grid-cols-2 gap-3">
              <Input id="startTime" name="startTime" label="Start time" type="time" defaultValue={camp.startTime} required />
              <Input id="endTime" name="endTime" label="End time" type="time" defaultValue={camp.endTime} required />
            </div>
            <Input id="venue" name="venue" label="Venue" defaultValue={camp.venue} required />
            <Input id="locality" name="locality" label="Locality" defaultValue={camp.locality} required />
            <Input id="district" name="district" label="District" defaultValue={camp.district} required />
            <Input id="state" name="state" label="State" defaultValue={camp.state} required />
            <Input id="contactName" name="contactName" label="Contact person" defaultValue={camp.contactName} required />
            <Input id="contactPhone" name="contactPhone" label="Contact phone" type="tel" defaultValue={camp.contactPhone} required />
            <Select
              id="status"
              name="status"
              label="Visibility"
              defaultValue={camp.status}
              options={[
                { value: "DRAFT", label: "Draft — hidden publicly" },
                { value: "PUBLISHED", label: "Published — visible publicly" },
              ]}
            />
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-ink">Description</label>
              <textarea id="description" name="description" required minLength={10} maxLength={1200} rows={5} defaultValue={camp.description} className="mt-1.5 block w-full resize-y rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-mahogany-600 focus:shadow-[0_0_0_4px_rgb(173_40_49_/_0.08)]" />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end md:col-span-2">
              <Link href="/admin/blood-camps" className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-surface-muted">Cancel</Link>
              <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-mahogany-600 px-5 text-sm font-semibold text-white hover:bg-mahogany-700">Save changes</button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
