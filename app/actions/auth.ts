"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";
import { getSessionUser } from "@/lib/auth/guards";
import { landingRouteForRole } from "@/lib/constants";
import {
  createUser,
  DuplicateEmailError,
  getUserById,
} from "@/lib/services/user.service";
import type { SessionUserDTO } from "@/types/user";
import type { FormActionState } from "@/lib/utils/form-action-state";
import { formDataToObject } from "@/lib/utils/form-data";
import { safeCallbackUrl } from "@/lib/utils/redirect";
import { toFieldErrors } from "@/lib/utils/validation";
import { signInSchema, signUpSchema } from "@/lib/validations/user";

/** One message for every failure mode, so nothing reveals whether an account exists. */
const GENERIC_CREDENTIALS_ERROR =
  "We could not sign you in with those details. Check your email and password.";

/**
 * Establishes the session without letting Auth.js perform the navigation, so
 * that failures can be reported inline next to the form fields.
 *
 * @returns the signed-in member's role, or `null` if sign-in failed.
 */
async function startSession(
  email: string,
  password: string,
): Promise<NonNullable<SessionUserDTO["role"]> | null> {
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return null;
    }

    // Anything else (an unreachable database, a misconfiguration) is logged on
    // the server and reported generically.
    console.error("Unexpected failure during sign-in:", error);
    return null;
  }

  // The cookie is set on the response, so this read can be stale. The database
  // is the authority on the role: an administrator who was demoted moments ago
  // must not be sent to the admin area.
  const sessionUser = await getSessionUser();
  const role = sessionUser?.role ?? null;
  const user = sessionUser ? await getUserById(sessionUser.id) : null;

  return user?.role ?? role;
}

export async function signInAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const values = formDataToObject(formData);
  const parsed = signInSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const role = await startSession(email, password);

  if (!role) {
    return { status: "error", message: GENERIC_CREDENTIALS_ERROR };
  }

  // Honour a same-origin destination the proxy asked for, but never let it
  // override the role-based landing page with somewhere the member cannot go.
  const requested = safeCallbackUrl(
    formData.get("callbackUrl"),
    landingRouteForRole(role),
  );

  if (requested.startsWith("/admin") && role !== "ADMIN") {
    redirect(landingRouteForRole(role));
  }

  redirect(requested);
}

export async function signUpAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const values = formDataToObject(formData);
  const parsed = signUpSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  try {
    await createUser({ name, email, password });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      return {
        status: "error",
        message: error.message,
        fieldErrors: { email: [error.message] },
      };
    }

    console.error("Failed to create an account:", error);
    return {
      status: "error",
      message: "We could not create your account right now. Please try again.",
    };
  }

  const signedIn = await startSession(email, password);

  // `redirect` throws, so this only runs when a session was actually opened.
  if (!signedIn) {
    // The account now exists but the session could not be opened, so send the
    // new member to the sign-in page rather than to a page they cannot open.
    redirect("/sign-in");
  }

  // Public registration always produces a standard member account.
  redirect("/onboarding");
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}
