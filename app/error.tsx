"use client";

import { useEffect } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the details in the server logs; the message shown here stays generic.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-5">
        <Alert tone="error" title="Something went wrong">
          We could not load this page. Nothing you did caused this — please try
          again.
        </Alert>

        {error.digest ? (
          <p className="text-xs text-ink-subtle">
            Reference: <code className="font-mono">{error.digest}</code>
          </p>
        ) : null}

        <Button type="button" onClick={reset} className="w-full sm:w-auto">
          Try again
        </Button>
      </div>
    </div>
  );
}