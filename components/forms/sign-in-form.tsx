"use client";

import Link from "next/link";
import { useActionState } from "react";

import { googleSignInAction, signInAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";

export function SignInForm({
  callbackUrl,
  urlError,
  urlDetails,
}: {
  callbackUrl: string;
  urlError?: string;
  urlDetails?: string;
}) {
  const [state, formAction] = useActionState(signInAction, IDLE_FORM_STATE);

  const getUrlErrorMessage = (err?: string, details?: string) => {
    if (!err && !details) return null;
    if (details) return `Database / Sign-In Error: ${details}`;
    if (err === "AccessDenied") {
      return "Google Sign-In access was denied. Please ensure your MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0 in Network Access) and environment variables are configured in Vercel.";
    }
    if (err === "OAuthCallbackError") {
      return "Could not authenticate with Google. Please verify your Google OAuth credentials.";
    }
    if (err === "Configuration") {
      return "Server configuration issue. Please check your AUTH_SECRET and Google credentials in Vercel.";
    }
    return `Authentication error: ${err}`;
  };

  const urlErrorMessage = getUrlErrorMessage(urlError, urlDetails);

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
      </div>

      {urlErrorMessage ? (
        <Alert tone="error">{urlErrorMessage}</Alert>
      ) : null}

      {state.status === "error" ? (
        <Alert tone="error">{state.message}</Alert>
      ) : null}

      <Card>
        <CardBody className="border-t-0">
          <form action={formAction} className="space-y-4">
            {callbackUrl !== "/dashboard" ? (
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
            ) : null}

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              required
              error={state.fieldErrors?.email?.[0]}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              error={state.fieldErrors?.password?.[0]}
            />

            <div className="flex items-center justify-end pt-1">
              <span
                aria-disabled="true"
                title="Password reset is not available yet"
                className="cursor-not-allowed text-sm text-ink-subtle"
              >
                Forgot password?
              </span>
            </div>

            <SubmitButton pendingLabel="Signing in…">Sign In</SubmitButton>
          </form>
        </CardBody>
      </Card>

      <form action={googleSignInAction}>
        {callbackUrl !== "/dashboard" ? (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        ) : null}
        <button type="submit" className="flex h-10.5 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink shadow-xs transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mahogany-600 cursor-pointer">
          <span aria-hidden="true" className="text-base font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted">
        New here?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-mahogany-700 underline underline-offset-4 hover:text-mahogany-800"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
