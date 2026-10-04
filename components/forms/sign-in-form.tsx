"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(signInAction, IDLE_FORM_STATE);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Sign in
        </h1>
        <p className="text-sm text-ink-muted">
          Use the email address and password you registered with.
        </p>
      </div>

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
