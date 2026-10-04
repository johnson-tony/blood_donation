"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";

import {
  removeProfileImageAction,
  uploadProfileImageAction,
} from "@/app/actions/profile-image";
import { Alert } from "@/components/ui/alert";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MAX_PROFILE_IMAGE_BYTES,
  MAX_PROFILE_IMAGE_LABEL,
  PROFILE_IMAGE_ACCEPT,
} from "@/lib/constants";
import { IDLE_FORM_STATE, fieldError } from "@/lib/utils/form-action-state";

/**
 * Profile photo control.
 *
 * The file is uploaded to Cloudinary through a Server Action rather than a
 * signed browser upload: the account's API secret never leaves the server, and
 * there is no upload preset that a visitor could abuse. The cost is that the
 * file passes through the app, which is acceptable at this size.
 *
 * The photo is stored the moment the upload succeeds, independently of the
 * profile form, so a member never loses a photo to an unsaved edit elsewhere on
 * the page.
 */
export function ProfileImageField({
  name,
  initialImage,
  disabled = false,
}: {
  name: string;
  initialImage: string | null;
  disabled?: boolean;
}) {
  const [state, formAction, isPending] = useActionState(
    uploadProfileImageAction,
    IDLE_FORM_STATE,
  );
  const [isRemoving, startRemoving] = useTransition();
  const [image, setImage] = useState<string | null>(initialImage);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = isPending || isRemoving;
  const error = localError ?? fieldError(state, "profileImage");

  // A successful upload replaces the file, so reset the input to make sure the
  // same file can be picked again if the member wants to undo their change.
  useEffect(() => {
    if (state.status !== "success") return;
    if (inputRef.current) inputRef.current.value = "";
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const input = inputRef.current;
    const file = input?.files?.[0];

    if (!file) {
      event.preventDefault();
      setLocalError("Choose a photo to upload.");
      return;
    }

    // Cheap client-side guard. The server repeats every one of these checks, so
    // this only saves a pointless upload.
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      event.preventDefault();
      setLocalError(`Photos must be smaller than ${MAX_PROFILE_IMAGE_LABEL}.`);
      return;
    }

    setLocalError(null);

    // Show the chosen file straight away; the action replaces it with the
    // stored URL once Cloudinary has it.
    const preview = URL.createObjectURL(file);
    setImage((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return preview;
    });
  }

  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) URL.revokeObjectURL(image);
    };
  }, [image]);

  function handleRemove() {
    setLocalError(null);
    startRemoving(async () => {
      const result = await removeProfileImageAction();
      if (result.status === "error") {
        setLocalError(result.message ?? "We could not remove that photo.");
        return;
      }
      setImage(null);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={name} src={image} size="lg" className="size-16" />

        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm text-ink-muted">
            Upload a photo so donors and requesters recognise you. Leave it empty
            to use your initials.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <form action={formAction} onSubmit={handleSubmit} className="contents">
              <label
                htmlFor={name}
                className="inline-flex cursor-pointer items-center rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-mahogany-50 focus-within:ring-2 focus-within:ring-mahogany-500 focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Uploading…" : image ? "Replace photo" : "Upload photo"}
                <input
                  ref={inputRef}
                  id={name}
                  name="profileImage"
                  type="file"
                  accept={PROFILE_IMAGE_ACCEPT}
                  disabled={disabled || isBusy}
                  className="sr-only"
                />
              </label>
            </form>

            {image && !image.startsWith("blob:") ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || isBusy}
                onClick={handleRemove}
              >
                {isRemoving ? "Removing…" : "Remove"}
              </Button>
            ) : null}
          </div>

          <p className="text-xs text-ink-subtle">
            JPG, PNG or WebP, up to {MAX_PROFILE_IMAGE_LABEL}.
          </p>
        </div>
      </div>

      {error ? (
        <Alert tone="error" title="Photo not uploaded">
          {error}
        </Alert>
      ) : null}

      {state.status === "success" && !error ? (
        <Alert tone="success" title="Saved">
          {state.message}
        </Alert>
      ) : null}
    </div>
  );
}