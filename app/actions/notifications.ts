"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/services/notification.service";

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();

  if (id) {
    await markNotificationRead(id, user.id);
    revalidatePath("/notifications");
    revalidatePath("/admin/notifications");
  }

  if (href && href.startsWith("/")) redirect(href);
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser();
  await markAllNotificationsRead(user.id);
  revalidatePath("/notifications");
  revalidatePath("/admin/notifications");
}
