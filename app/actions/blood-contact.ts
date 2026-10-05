"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import { createBloodContactRequest } from "@/lib/services/blood-contact-request.service";
import { bloodContactRequestSchema } from "@/lib/validations/blood-contact-request";
import type { FormActionState } from "@/lib/utils/form-action-state";
import { formDataToObject } from "@/lib/utils/form-data";
import { toFieldErrors } from "@/lib/utils/validation";

export async function requestDonorContactAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();
  const parsed = bloodContactRequestSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    const result = await createBloodContactRequest({
      requesterId: user.id,
      ...parsed.data,
    });

    redirect(`/my-requests/${result.id}`);
  } catch (error) {
    console.error("Failed to create donor contact request:", error);
    return {
      status: "error",
      message: "This donor is no longer available. Please choose another donor.",
    };
  }
}
