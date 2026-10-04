/** Result shape shared by every form Server Action in the application. */
export type FormActionState = {
  status: "idle" | "error" | "success";
  /** Form-level message, safe to render to the user. */
  message?: string;
  /** Per-field messages keyed by input `name`. */
  fieldErrors?: Record<string, string[]>;
};

export const IDLE_FORM_STATE: FormActionState = { status: "idle" };

export function fieldError(
  state: FormActionState | undefined,
  field: string,
): string | undefined {
  return state?.fieldErrors?.[field]?.[0];
}

/**
 * Maps a Zod error into the flat `{ field: string[] }` shape the UI expects.
 * Anything that is not a field error (for example a schema-level refinement)
 * is returned as a form-level message instead.
 */
export function toFormActionState(
  message: string,
  fieldErrors?: Record<string, string[]>,
): FormActionState {
  if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
    return { status: "error", message };
  }

  return { status: "error", message, fieldErrors };
}
