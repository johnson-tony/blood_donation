"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signUpAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { PASSWORD_REQUIREMENTS } from "@/lib/validations/user";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, IDLE_FORM_STATE);

  const passwordErrors = state.fieldErrors?.password ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Create your account
        </h1>
        <p className="text-sm text-ink-muted">
          Register once to request blood or donate when someone nearby needs it.
        </p>
      </div>

      {state.status === "error" ? (
        <Alert tone="error">{state.message}</Alert>
      ) : null}

      <Card>
        <CardBody className="border-t-0">
          <form action={formAction} className="space-y-4">
            <Input
              id="name"
              name="name"
              type="text"
              label="Full Name"
              autoComplete="name"
              placeholder="Your full name"
              required
              error={state.fieldErrors?.name?.[0]}
            />

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
              autoComplete="new-password"
              required
              hint={`Must have ${PASSWORD_REQUIREMENTS.join(", ").toLowerCase()}.`}
              error={passwordErrors[0]}
            />

            {passwordErrors.length > 1 ? (
              <ul className="list-disc space-y-1 pl-5 text-sm text-mahogany-700">
                {passwordErrors.slice(1).map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              autoComplete="new-password"
              required
              error={state.fieldErrors?.confirmPassword?.[0]}
            />

            <SubmitButton pendingLabel="Creating account…">
              Create Account
            </SubmitButton>
          </form>
        </CardBody>
      </Card>

      <p className="text-center text-sm text-ink-muted">
        Already registered?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-mahogany-700 underline underline-offset-4 hover:text-mahogany-800"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
