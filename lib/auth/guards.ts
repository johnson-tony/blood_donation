import "server-only";

import { cache } from "react";
import { forbidden, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getUserById, toSessionUserDTO } from "@/lib/services/user.service";
import type { UserRecord } from "@/models/user";
import type { SessionUserDTO } from "@/types/user";

/**
 * Data Access Layer for identity and authorization.
 *
 * Every protected surface in the application goes through one of the
 * `require*` helpers below, so a route can never be left unprotected by
 * forgetting to add a check to an individual page.
 */

/**
 * Optimistic read of the session. Safe to use for deciding what to render, but
 * never for deciding what data a member is allowed to see.
 */
export const getSessionUser = cache(
  async (): Promise<SessionUserDTO | null> => {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      role: session.user.role,
      profileImage: session.user.profileImage ?? null,
      profileCompleted: session.user.profileCompleted ?? false,
    };
  },
);

/** Any signed-in member. Redirects anonymous visitors to the sign-in page. */
export const requireUser = cache(async (): Promise<SessionUserDTO> => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  return sessionUser;
});

/**
 * The authoritative member record for the signed-in member, re-read from
 * MongoDB. Needed whenever the answer may have changed since the session token
 * was issued — most importantly `role` and `profileCompleted`.
 */
export const getCurrentUserRecord = cache(async (): Promise<UserRecord> => {
  const sessionUser = await requireUser();

  const record = await getUserById(sessionUser.id);

  if (!record) {
    // The session references an account that no longer exists.
    redirect("/sign-in");
  }

  return record;
});

/**
 * Administrator-only gate.
 *
 * The role is deliberately re-read from the database rather than trusted from
 * the JWT, so revoking an admin takes effect on the very next request instead
 * of when the token happens to expire. Hiding navigation is a convenience; this
 * check is the actual control.
 */
export const requireAdmin = cache(async (): Promise<UserRecord> => {
  const record = await getCurrentUserRecord();

  if (record.role !== "ADMIN") {
    forbidden();
  }

  return record;
});

/** Convenience wrapper for admin pages that need the session DTO shape. */
export const requireAdminUser = cache(async (): Promise<SessionUserDTO> => {
  const record = await requireAdmin();
  return toSessionUserDTO(record);
});
