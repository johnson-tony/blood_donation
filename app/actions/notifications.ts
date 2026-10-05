"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/services/notification.service";

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  await markNotificationRead(id, user.id);
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction() {
  const user = await requireUser();
  await markAllNotificationsRead(user.id);
  revalidatePath("/notifications");
}
