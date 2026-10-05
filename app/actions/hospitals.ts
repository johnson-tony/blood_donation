"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/guards";
import { hospitalSchema } from "@/lib/validations/hospital";
import { createHospital, deleteHospital, updateHospital } from "@/lib/services/hospital.service";

function readFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    hospitalType: String(formData.get("hospitalType") ?? ""),
    description: String(formData.get("description") ?? ""),
    address: String(formData.get("address") ?? ""),
    locality: String(formData.get("locality") ?? ""),
    district: String(formData.get("district") ?? ""),
    state: String(formData.get("state") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    emergencyPhone: String(formData.get("emergencyPhone") ?? ""),
    website: String(formData.get("website") ?? ""),
    hasBloodBank: String(formData.get("hasBloodBank") ?? "false"),
    status: String(formData.get("status") ?? "DRAFT"),
  };
}

export async function createHospitalAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = hospitalSchema.safeParse(readFormData(formData));
  if (!parsed.success) redirect("/admin/hospitals?error=invalid");

  await createHospital(admin._id.toString(), parsed.data);
  revalidatePath("/hospitals");
  revalidatePath("/admin/hospitals");
  redirect("/admin/hospitals?created=1");
}

export async function updateHospitalAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = hospitalSchema.safeParse(readFormData(formData));
  if (!id || !parsed.success) redirect("/admin/hospitals?error=invalid");

  const updated = await updateHospital(id, parsed.data);
  if (!updated) redirect("/admin/hospitals?error=not-found");

  revalidatePath("/hospitals");
  revalidatePath("/admin/hospitals");
  redirect("/admin/hospitals?updated=1");
}

export async function deleteHospitalAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/hospitals?error=invalid");

  await deleteHospital(id);
  revalidatePath("/hospitals");
  revalidatePath("/admin/hospitals");
  redirect("/admin/hospitals?deleted=1");
}
