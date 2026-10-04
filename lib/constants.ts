import { BLOOD_GROUPS, USER_ROLES } from "@/types/user";

export { BLOOD_GROUPS, USER_ROLES };

export const APP_NAME = "Jeevan Rakt";

export const APP_DESCRIPTION =
  "A blood donation platform that connects people who need blood with willing donors in their area.";

/** Where a member should land straight after a successful sign-in or sign-up. */
export function landingRouteForRole(role: string): string {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}

/* -------------------------------------------------------------------------- */
/*  Media                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Folder every profile photo lands in. Cloudinary creates it implicitly on the
 * first upload; the Admin API route for creating folders is not available on
 * every plan.
 */
export const PROFILE_IMAGE_FOLDER = "blood-donation/profile-images";

/**
 * 2 MB.
 *
 * Deliberately well under Vercel's ~4.5 MB request body limit, because a Server
 * Action upload is sent as one multipart request and the configured
 * `bodySizeLimit` in `next.config.ts` has to stay below that ceiling too.
 */
export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;

export const MAX_PROFILE_IMAGE_LABEL = `${MAX_PROFILE_IMAGE_BYTES / (1024 * 1024)} MB`;

/** Value for the file input's `accept` attribute. */
export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
