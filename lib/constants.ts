import { BLOOD_GROUPS, USER_ROLES } from "@/types/user";

export { BLOOD_GROUPS, USER_ROLES };

export const APP_NAME = "Jeevan Rakt";

export const APP_DESCRIPTION =
  "A blood donation platform that connects people who need blood with willing donors in their area.";

/** Where a member should land straight after a successful sign-in or sign-up. */
export function landingRouteForRole(role: string): string {
  return role === "ADMIN" ? "/admin" : "/dashboard";
}
