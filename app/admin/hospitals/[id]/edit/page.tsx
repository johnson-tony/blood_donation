import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireAdminUser } from "@/lib/auth/guards";
import { getHospitalById } from "@/lib/services/hospital.service";
import { updateHospitalAction } from "@/app/actions/hospitals";

export const metadata: Metadata = { title: "Edit Hospital" };

export default async function EditHospitalPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminUser();
  const { id } = await params;
  const hospital = await getHospitalById(id);
  if (!hospital) notFound();

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin / Hospitals" title="Edit hospital" description="Update the directory record before publishing changes." />
      <form action={updateHospitalAction} className="grid gap-5 rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-7 md:grid-cols-2">
        <input type="hidden" name="id" value={hospital.id} />
        <Input id="name" name="name" label="Hospital name" defaultValue={hospital.name} required />
        <Input id="hospitalType" name="hospitalType" label="Type" defaultValue={hospital.hospitalType} required />
        <Input id="address" name="address" label="Full address" defaultValue={hospital.address} required />
        <Input id="locality" name="locality" label="Locality" defaultValue={hospital.locality} required />
        <Input id="district" name="district" label="District" defaultValue={hospital.district} required />
        <Input id="state" name="state" label="State" defaultValue={hospital.state} required />
        <Input id="contactName" name="contactName" label="Contact person" defaultValue={hospital.contactName} required />
        <Input id="contactPhone" name="contactPhone" label="Contact phone" type="tel" defaultValue={hospital.contactPhone} required />
        <Input id="emergencyPhone" name="emergencyPhone" label="Emergency phone" type="tel" defaultValue={hospital.emergencyPhone} required />
        <Input id="website" name="website" label="Website" type="url" defaultValue={hospital.website ?? ""} />
        <Select id="hasBloodBank" name="hasBloodBank" label="Blood bank" defaultValue={hospital.hasBloodBank ? "true" : "false"} options={[
          { value: "true", label: "Yes — blood bank available" },
          { value: "false", label: "No blood bank" },
        ]} />
        <Select id="status" name="status" label="Visibility" defaultValue={hospital.status} options={[
          { value: "DRAFT", label: "Draft — hidden publicly" },
          { value: "PUBLISHED", label: "Published — visible publicly" },
        ]} />
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-ink">Description</label>
          <textarea id="description" name="description" required minLength={10} maxLength={1200} rows={5} defaultValue={hospital.description} className="mt-1.5 block w-full resize-y rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-mahogany-600 focus:shadow-[0_0_0_4px_rgb(173_40_49_/_0.08)]" />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-mahogany-600 px-5 text-sm font-semibold text-white hover:bg-mahogany-700">Save changes</button>
          <Link href="/admin/hospitals" className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong px-5 text-sm font-semibold text-ink hover:bg-surface-muted">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
