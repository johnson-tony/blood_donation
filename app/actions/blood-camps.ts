"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth/guards";
import { bloodCampSchema } from "@/lib/validations/blood-camp";
import {
  createBloodCamp,
  deleteBloodCamp,
  updateBloodCamp,
} from "@/lib/services/blood-camp.service";

function readFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    organizer: String(formData.get("organizer") ?? ""),
    description: String(formData.get("description") ?? ""),
    date: String(formData.get("date") ?? ""),
    startTime: String(formData.get("startTime") ?? ""),
    endTime: String(formData.get("endTime") ?? ""),
    venue: String(formData.get("venue") ?? ""),
    locality: String(formData.get("locality") ?? ""),
    district: String(formData.get("district") ?? ""),
    state: String(formData.get("state") ?? ""),
    contactName: String(formData.get("contactName") ?? ""),
    contactPhone: String(formData.get("contactPhone") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
  };
}

export async function createBloodCampAction(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = bloodCampSchema.safeParse(readFormData(formData));
  if (!parsed.success) redirect("/admin/blood-camps?error=invalid");

  await createBloodCamp(admin._id.toString(), parsed.data);
  revalidatePath("/blood-camps");
  revalidatePath("/admin/blood-camps");
  redirect("/admin/blood-camps?created=1");
}

export async function updateBloodCampAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = bloodCampSchema.safeParse(readFormData(formData));
  if (!id || !parsed.success) redirect("/admin/blood-camps?error=invalid");

  const updated = await updateBloodCamp(id, parsed.data);
  if (!updated) redirect("/admin/blood-camps?error=not-found");

  revalidatePath("/blood-camps");
  revalidatePath("/admin/blood-camps");
  redirect("/admin/blood-camps?updated=1");
}

export async function deleteBloodCampAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/blood-camps?error=invalid");

  await deleteBloodCamp(id);
  revalidatePath("/blood-camps");
  revalidatePath("/admin/blood-camps");
  redirect("/admin/blood-camps?deleted=1");
}
