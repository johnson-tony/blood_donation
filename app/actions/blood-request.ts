"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import type { FormActionState } from "@/lib/utils/form-action-state";
import { formDataToObject } from "@/lib/utils/form-data";
import { toFieldErrors } from "@/lib/utils/validation";
import { bloodRequestSchema } from "@/lib/validations/blood-request";
import { createBloodRequest } from "@/lib/services/blood-request.service";

export async function createBloodRequestAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();
  const values = formDataToObject(formData);
  const parsed = bloodRequestSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted request details.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  let request;
  try {
    request = await createBloodRequest(user.id, parsed.data);
    revalidatePath("/requests");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Failed to create blood request:", error);
    return {
      status: "error",
      message: "We could not create the request right now. Please try again.",
    };
  }

  redirect(`/requests/${request.id}`);
}
