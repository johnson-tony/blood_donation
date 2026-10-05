"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { connectToDatabase } from "@/lib/db/connect";
import BloodRequestModel from "@/models/blood-request";
import { findAndCreateMatches, respondToDonorMatch } from "@/lib/services/donor-matching.service";

export async function refreshDonorMatchesAction(formData: FormData) {
  const user = await requireUser();
  const requestId = String(formData.get("requestId") ?? "").trim();

  if (!requestId) return;

  await connectToDatabase();
  const request = await BloodRequestModel.findOne({ _id: requestId, requesterId: user.id }).lean().exec();
  if (!request) return;

  await findAndCreateMatches(request);
  revalidatePath(`/requests/${requestId}`);
  redirect(`/requests/${requestId}`);
}

export async function respondToDonorMatchAction(formData: FormData) {
  const user = await requireUser();
  const matchId = String(formData.get("matchId") ?? "").trim();
  const response = String(formData.get("response") ?? "");

  if (!matchId || (response !== "accepted" && response !== "declined")) return;

  await respondToDonorMatch(user.id, matchId, response);
  revalidatePath("/donor-opportunities");
  revalidatePath("/dashboard");
}
