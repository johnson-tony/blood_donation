import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import {
  completedProfileFieldCount,
  missingProfileFields,
  profileFieldLabel,
  totalProfileFieldCount,
} from "@/lib/utils/profile";
import type { ProfileDTO } from "@/types/user";

/**
 * Reflects the real state of the profile. Nothing here is estimated and no
 * progress is implied for work the member has not actually done.
 */
export function ProfileCompletionPanel({ profile }: { profile: ProfileDTO }) {
  const missing = missingProfileFields(profile);
  const completed = completedProfileFieldCount(profile);
  const total = totalProfileFieldCount();
  const complete = missing.length === 0;

  return (
    <section
      aria-labelledby="profile-completion-heading"
      className="overflow-hidden rounded-xl border border-line bg-surface shadow-card"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="space-y-1.5">
          <h2
            id="profile-completion-heading"
            className="text-base font-semibold tracking-tight text-ink"
          >
            {complete ? "Your profile is complete" : "Finish your profile"}
          </h2>
          <p className="max-w-md text-sm text-ink-muted">
            {complete
              ? "Donors can only be matched once these details exist, and a donor's phone number is never shown until a request is made."
              : "These are the details this platform needs in order to match you with a nearby request or a nearby donor."}
          </p>
        </div>

        <Link
          href="/profile"
          className={buttonClasses({ size: "sm", className: "sm:w-auto" })}
        >
          {complete ? "Edit profile" : "Complete profile"}
        </Link>
      </div>

      <div className="border-t border-line bg-surface-muted/60 px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-ink-secondary">
            {completed} of {total} details added
          </span>
          <span className="text-ink-muted">
            {complete ? "Nothing else to do" : `${missing.length} remaining`}
          </span>
        </div>

        <div
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Profile completion"
        >
          <div
            className="h-full rounded-full bg-mahogany-600 transition-[width] duration-300"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>

        {missing.length > 0 ? (
          <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
            {missing.map((field) => (
              <li
                key={field}
                className="flex items-center gap-1.5 text-sm text-ink-secondary"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-3.5 shrink-0 fill-none stroke-ink-subtle stroke-[1.6]"
                >
                  <circle cx="8" cy="8" r="6.25" />
                </svg>
                {profileFieldLabel(field)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
