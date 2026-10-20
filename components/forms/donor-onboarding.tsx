"use client";

import { useActionState, useState } from "react";

import { signOutAction } from "@/app/actions/auth";
import { updateProfileAction } from "@/app/actions/profile";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { BLOOD_GROUPS } from "@/types/user";
import type { ProfileDTO } from "@/types/user";

export function DonorOnboarding({ profile }: { profile: ProfileDTO }) {
  const [state, formAction] = useActionState(updateProfileAction, IDLE_FORM_STATE);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup ?? "");
  const [availability, setAvailability] = useState<"available" | "unavailable">(
    profile.availableToDonate === false ? "unavailable" : "available",
  );

  return (
    <div className="min-h-dvh bg-canvas px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-xl">
        {/* Title */}
        <div className="mb-7 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Complete your profile
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Please answer these quick questions so we can connect you with compatible requests.
          </p>
        </div>

        {state.status === "error" ? (
          <div className="mb-6">
            <Alert tone="error" title="Please check your details">
              {state.message}
            </Alert>
          </div>
        ) : null}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="name" value={profile.name || "Donor"} />
          <input type="hidden" name="onboarding" value="true" />

          {/* Question 1: Blood Group */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-ink">
              1. What is your blood group?
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Select your blood type for compatible donor matching.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {BLOOD_GROUPS.map((group) => {
                const selected = bloodGroup === group;
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setBloodGroup(group)}
                    aria-pressed={selected}
                    className={`min-h-12 rounded-xl border px-2 py-2 text-center text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                      selected
                        ? "border-mahogany-600 bg-mahogany-600 text-white shadow-raised"
                        : "border-line bg-canvas text-ink hover:border-mahogany-300"
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="bloodGroup" value={bloodGroup} />
            {state.fieldErrors?.bloodGroup?.[0] ? (
              <p className="mt-2 text-xs font-semibold text-mahogany-700">
                {state.fieldErrors.bloodGroup[0]}
              </p>
            ) : null}
          </section>

          {/* Question 2: Mobile Number */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-ink">
              2. What is your mobile number?
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Your number is kept private and only shared when blood is urgently needed.
            </p>
            <div className="mt-4">
              <Input
                id="phone"
                name="phone"
                label="Mobile number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                defaultValue={profile.phone ?? ""}
                required
                error={state.fieldErrors?.phone?.[0]}
              />
            </div>
          </section>

          {/* Question 3: Location */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-ink">
              3. Where are you located?
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Used to match you with nearby patients and blood requests.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                id="state"
                name="state"
                label="State"
                autoComplete="address-level1"
                placeholder="e.g. Tamil Nadu"
                defaultValue={profile.state ?? ""}
                required
                error={state.fieldErrors?.state?.[0]}
              />
              <Input
                id="district"
                name="district"
                label="District"
                autoComplete="address-level2"
                placeholder="e.g. Tiruchirappalli"
                defaultValue={profile.district ?? ""}
                required
                error={state.fieldErrors?.district?.[0]}
              />
              <div className="sm:col-span-2">
                <Input
                  id="locality"
                  name="locality"
                  label="Area / Village / Locality"
                  autoComplete="address-level3"
                  placeholder="e.g. Lalgudi, Cantonment"
                  defaultValue={profile.locality ?? ""}
                  required
                  error={state.fieldErrors?.locality?.[0]}
                />
              </div>
            </div>
          </section>

          {/* Question 4: Availability */}
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-ink">
              4. Are you available to donate blood?
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              You can change this anytime later from your profile.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: "available" as const,
                  title: "Yes, I am available",
                  desc: "Show me in donor search for urgent blood needs",
                },
                {
                  value: "unavailable" as const,
                  title: "Not right now",
                  desc: "Keep my profile ready, but mark me inactive",
                },
              ].map((opt) => {
                const selected = availability === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAvailability(opt.value)}
                    aria-pressed={selected}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer active:scale-[0.99] ${
                      selected
                        ? "border-mahogany-600 bg-mahogany-50/70 shadow-xs ring-1 ring-mahogany-600"
                        : "border-line bg-canvas hover:border-line-strong"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                        selected
                          ? "border-mahogany-600 bg-mahogany-600 text-white"
                          : "border-line-strong bg-white"
                      }`}
                    >
                      {selected ? "✓" : ""}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">
                        {opt.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                        {opt.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="availability" value={availability} />
            {state.fieldErrors?.availability?.[0] ? (
              <p className="mt-2 text-xs font-semibold text-mahogany-700">
                {state.fieldErrors.availability[0]}
              </p>
            ) : null}
          </section>

          {/* Submit Button */}
          <div className="pt-2">
            <SubmitButton
              size="lg"
              className="h-12 w-full text-base font-semibold shadow-glow"
              pendingLabel="Saving details…"
            >
              Complete Profile & Continue
            </SubmitButton>
          </div>
        </form>

        {/* Subtle footer */}
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-line/60 pt-5 text-xs text-ink-muted">
          <span>
            Signed in as{" "}
            <strong className="font-medium text-ink">{profile.email}</strong>
          </span>
          <span>·</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="font-medium text-mahogany-700 hover:underline cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
