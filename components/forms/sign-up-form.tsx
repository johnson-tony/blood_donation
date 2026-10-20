"use client";

import Link from "next/link";
import { useActionState } from "react";

import { googleSignInAction, signUpAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, IDLE_FORM_STATE);
  const passwordErrors = state.fieldErrors?.password ?? [];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4">
        <h1 className="mt-3 text-xl font-bold tracking-[-0.03em] text-ink">Create your account.</h1>
      </div>
      {state.status === "error" ? <Alert tone="error" title="Couldn’t create your account">{state.message}</Alert> : null}
      <form action={formAction} className="mt-7 space-y-4">
        <Input id="name" name="name" type="text" label="Full name" autoComplete="name" placeholder="Your name" required error={state.fieldErrors?.name?.[0]} />
        <Input id="email" name="email" type="email" label="Email address" autoComplete="email" inputMode="email" placeholder="you@example.com" required error={state.fieldErrors?.email?.[0]} />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Choose a password"
          required
          error={passwordErrors[0]}
        />
        {passwordErrors.length > 1 ? <p className="text-sm text-mahogany-700">{passwordErrors.slice(1).join(" ")}</p> : null}
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          required
          error={state.fieldErrors?.confirmPassword?.[0]}
        />
        <SubmitButton pendingLabel="Creating account…" size="md" className="mt-3 h-10.5 rounded-xl">Create account</SubmitButton>
      </form>
      <div className="mt-3.5">
        <form action={googleSignInAction}>
          <input type="hidden" name="callbackUrl" value="/onboarding" />
          <button type="submit" className="flex h-10.5 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white px-4 text-sm font-semibold text-ink shadow-xs transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mahogany-600 cursor-pointer">
            <span aria-hidden="true" className="text-base font-bold text-[#4285F4]">G</span>
            Sign up with Google
          </button>
        </form>
      </div>
      <p className="mt-7 text-center text-sm text-ink-muted">Already registered?{" "}<Link href="/sign-in" className="font-semibold text-mahogany-700 underline-offset-4 hover:underline">Sign in</Link></p>
      <p className="mt-8 text-center text-xs leading-5 text-ink-subtle">Your account is created first. Your donor profile is completed in the next step.</p>
    </div>
  );
}
