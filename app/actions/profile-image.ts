"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/guards";
import {
  MAX_PROFILE_IMAGE_LABEL,
  PROFILE_IMAGE_FOLDER,
} from "@/lib/constants";
import {
  MAX_PROFILE_IMAGE_BYTES,
  isAllowedImageType,
  isMediaStorageConfigured,
  removeStoredImage,
  storeProfileImage,
} from "@/lib/media/cloudinary";
import {
  getUserProfileImagePublicId,
  updateUserProfileImage,
} from "@/lib/services/user.service";
import type { FormActionState } from "@/lib/utils/form-action-state";

function revalidateProfileViews(): void {
  revalidatePath("/dashboard");
  revalidatePath("/profile");
}

/**
 * Stores a member's photo in Cloudinary and points their profile at it.
 *
 * The member id comes from the verified session, never from the form body, and
 * the file is validated on the server: a browser-supplied MIME type proves
 * nothing, so Cloudinary re-encodes the asset before it is ever served.
 */
export async function uploadProfileImageAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const sessionUser = await requireUser();

  if (!isMediaStorageConfigured()) {
    return {
      status: "error",
      message: "Photo uploads are not available right now. Please try again later.",
    };
  }

  const file = formData.get("profileImage");

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      fieldErrors: { profileImage: ["Choose a photo to upload."] },
    };
  }

  if (!isAllowedImageType(file.type)) {
    return {
      status: "error",
      fieldErrors: {
        profileImage: ["Use a JPG, PNG or WebP image."],
      },
    };
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return {
      status: "error",
      fieldErrors: {
        profileImage: [`Photos must be smaller than ${MAX_PROFILE_IMAGE_LABEL}.`],
      },
    };
  }

  try {
    const stored = await storeProfileImage(
      Buffer.from(await file.arrayBuffer()),
      {
        userId: sessionUser.id,
        contentType: file.type,
        bytes: file.size,
      },
    );

    // Read the previous id before overwriting it, so the old file can go.
    const previousPublicId = await getUserProfileImagePublicId(sessionUser.id);

    await updateUserProfileImage(sessionUser.id, stored);

    // The asset id is the member id, so an upload replaces the file in place.
    // Only a file from a different folder could still be orphaned.
    if (
      previousPublicId &&
      previousPublicId !== stored.publicId &&
      previousPublicId.startsWith(`${PROFILE_IMAGE_FOLDER}/`)
    ) {
      await removeStoredImage(previousPublicId);
    }

    revalidateProfileViews();

    return { status: "success", message: "Your photo has been updated." };
  } catch (error) {
    console.error("Failed to upload profile image:", error);
    return {
      status: "error",
      message: "We could not upload that photo. Please try another one.",
    };
  }
}

/** Removes the member's stored photo and falls back to their initials. */
export async function removeProfileImageAction(): Promise<FormActionState> {
  const sessionUser = await requireUser();

  if (!isMediaStorageConfigured()) {
    return {
      status: "error",
      message: "Photo uploads are not available right now. Please try again later.",
    };
  }

  try {
    const previousPublicId = await getUserProfileImagePublicId(sessionUser.id);

    await updateUserProfileImage(sessionUser.id, null);

    if (previousPublicId) {
      await removeStoredImage(previousPublicId);
    }

    revalidateProfileViews();

    return { status: "success", message: "Your photo has been removed." };
  } catch (error) {
    console.error("Failed to remove profile image:", error);
    return {
      status: "error",
      message: "We could not remove that photo. Please try again.",
    };
  }
}