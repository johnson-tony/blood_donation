"use client";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";

export function SubmitButton({
  children,
  pendingLabel,
  ...props
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} {...props}>
      {pending ? (
        <>
          <Spinner />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className="size-4 animate-spin fill-none stroke-current stroke-2"
    >
      <circle cx="10" cy="10" r="7.5" opacity="0.25" />
      <path d="M17.5 10a7.5 7.5 0 0 0-7.5-7.5" strokeLinecap="round" />
    </svg>
  );
}
