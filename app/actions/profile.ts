"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/guards";
import type { FormActionState } from "@/lib/utils/form-action-state";
import { formDataToObject } from "@/lib/utils/form-data";
import { toFieldErrors } from "@/lib/utils/validation";
import { profileSchema } from "@/lib/validations/user";
import { updateUserProfile } from "@/lib/services/user.service";

/**
 * Saves the signed-in member's own profile.
 *
 * The member id always comes from the verified session, never from the form
 * body, so a member can only ever edit their own record.
 */
export async function updateProfileAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const sessionUser = await requireUser();

  const values = formDataToObject(formData);
  const parsed = profileSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  try {
    await updateUserProfile(sessionUser.id, parsed.data);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return {
      status: "error",
      message: "We could not save your profile right now. Please try again.",
    };
  }

  // The dashboard and the app shell both read profile state.
  revalidatePath("/dashboard");
  revalidatePath("/profile");

  return {
    status: "success",
    message: "Your profile has been saved.",
  };
}
