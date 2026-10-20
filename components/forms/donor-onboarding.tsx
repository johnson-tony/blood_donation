"use client";

import { useActionState, useState } from "react";

import { signOutAction } from "@/app/actions/auth";
import { updateProfileAction } from "@/app/actions/profile";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { StateDistrictSelect } from "@/components/ui/state-district-select";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { BLOOD_GROUPS } from "@/types/user";
import type { ProfileDTO } from "@/types/user";

export function DonorOnboarding({ profile }: { profile: ProfileDTO }) {
  const [state, formAction] = useActionState(updateProfileAction, IDLE_FORM_STATE);

  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState("");

  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [selectedState, setSelectedState] = useState(profile.state ?? "");
  const [selectedDistrict, setSelectedDistrict] = useState(profile.district ?? "");
  const [locality, setLocality] = useState(profile.locality ?? "");
  const [availability, setAvailability] = useState<"available" | "unavailable">(
    profile.availableToDonate === false ? "unavailable" : "available",
  );

  const handleContinue = () => {
    setStepError("");

    if (step === 0) {
      if (!bloodGroup) {
        setStepError("Please select your blood group to continue.");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      if (phone.trim().length < 7) {
        setStepError("Please enter a valid mobile number.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedState) {
        setStepError("Please select your state from the dropdown.");
        return;
      }
      if (!selectedDistrict) {
        setStepError("Please select your district from the dropdown.");
        return;
      }
      if (locality.trim().length < 2) {
        setStepError("Please enter your village, area, or locality name.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStepError("");
    setStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex min-h-dvh flex-col justify-center bg-canvas px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-lg">
        {/* Step Progress Dots */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-ink-secondary">
            <span>Question {step + 1} of 4</span>
            <span className="text-mahogany-700">
              {step === 0
                ? "Blood Group"
                : step === 1
                ? "Mobile Number"
                : step === 2
                ? "Location"
                : "Availability"}
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-mahogany-600" : "bg-line-strong/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Global form errors */}
        {state.status === "error" ? (
          <div className="mb-5">
            <Alert tone="error" title="Please check your details">
              {state.message}
            </Alert>
          </div>
        ) : null}

        {/* Local step validation error */}
        {stepError ? (
          <div className="mb-5">
            <Alert tone="error">{stepError}</Alert>
          </div>
        ) : null}

        <form action={formAction}>
          {/* Hidden values for full submission */}
          <input type="hidden" name="name" value={profile.name || "Donor"} />
          <input type="hidden" name="bloodGroup" value={bloodGroup} />
          <input type="hidden" name="phone" value={phone} />
          <input type="hidden" name="state" value={selectedState} />
          <input type="hidden" name="district" value={selectedDistrict} />
          <input type="hidden" name="locality" value={locality} />
          <input type="hidden" name="availability" value={availability} />
          <input type="hidden" name="onboarding" value="true" />

          {/* QUESTION 1: Blood Group */}
          {step === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-card">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                What is your blood group?
              </h1>
              <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">
                Select your blood type for compatible donor matching.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {BLOOD_GROUPS.map((group) => {
                  const selected = bloodGroup === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => {
                        setBloodGroup(group);
                        setStepError("");
                      }}
                      aria-pressed={selected}
                      className={`min-h-12 rounded-xl border px-2 py-2.5 text-center text-sm sm:text-base font-bold transition-all cursor-pointer active:scale-95 ${
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

              {state.fieldErrors?.bloodGroup?.[0] ? (
                <p className="mt-3 text-xs font-semibold text-mahogany-700">
                  {state.fieldErrors.bloodGroup[0]}
                </p>
              ) : null}

              <div className="mt-8 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="h-12 w-full rounded-xl bg-mahogany-600 text-sm sm:text-base font-semibold text-white shadow-glow transition hover:bg-mahogany-700 cursor-pointer active:scale-98"
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : null}

          {/* QUESTION 2: Mobile Number */}
          {step === 1 ? (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-card">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                What is your mobile number?
              </h1>
              <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">
                Your number is kept private and only shared when blood is urgently needed.
              </p>

              <div className="mt-6">
                <Input
                  id="phone_input"
                  label="Mobile number"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setStepError("");
                  }}
                  required
                  error={state.fieldErrors?.phone?.[0]}
                />
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 flex-1 rounded-xl border border-line-strong bg-surface text-sm font-semibold text-ink hover:bg-surface-muted transition cursor-pointer active:scale-98"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="h-12 flex-1 rounded-xl bg-mahogany-600 text-sm sm:text-base font-semibold text-white shadow-glow transition hover:bg-mahogany-700 cursor-pointer active:scale-98"
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : null}

          {/* QUESTION 3: Location */}
          {step === 2 ? (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-card">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Where are you located?
              </h1>
              <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">
                Choose your state and district from the dropdowns so nearby patients can find you.
              </p>

              <div className="mt-6 space-y-4">
                <StateDistrictSelect
                  defaultState={selectedState}
                  defaultDistrict={selectedDistrict}
                  onStateChange={(st) => {
                    setSelectedState(st);
                    setStepError("");
                  }}
                  onDistrictChange={(dst) => {
                    setSelectedDistrict(dst);
                    setStepError("");
                  }}
                  stateError={state.fieldErrors?.state?.[0]}
                  districtError={state.fieldErrors?.district?.[0]}
                  required
                />

                <Input
                  id="locality_input"
                  label="Area / Village / Locality"
                  autoComplete="address-level3"
                  placeholder="e.g. Lalgudi, Cantonment, Anna Nagar"
                  value={locality}
                  onChange={(e) => {
                    setLocality(e.target.value);
                    setStepError("");
                  }}
                  required
                  error={state.fieldErrors?.locality?.[0]}
                />
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 flex-1 rounded-xl border border-line-strong bg-surface text-sm font-semibold text-ink hover:bg-surface-muted transition cursor-pointer active:scale-98"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  className="h-12 flex-1 rounded-xl bg-mahogany-600 text-sm sm:text-base font-semibold text-white shadow-glow transition hover:bg-mahogany-700 cursor-pointer active:scale-98"
                >
                  Continue →
                </button>
              </div>
            </div>
          ) : null}

          {/* QUESTION 4: Availability */}
          {step === 3 ? (
            <div className="rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-card">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Are you available to donate blood?
              </h1>
              <p className="mt-1.5 text-xs text-ink-muted sm:text-sm">
                You can change this anytime later from your profile.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  {
                    value: "available" as const,
                    title: "Yes, I am available",
                    desc: "Show me in donor searches for urgent blood needs",
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

              {state.fieldErrors?.availability?.[0] ? (
                <p className="mt-2 text-xs font-semibold text-mahogany-700">
                  {state.fieldErrors.availability[0]}
                </p>
              ) : null}

              <div className="mt-8 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="h-12 flex-1 rounded-xl border border-line-strong bg-surface text-sm font-semibold text-ink hover:bg-surface-muted transition cursor-pointer active:scale-98"
                >
                  Back
                </button>
                <div className="flex-1">
                  <SubmitButton
                    size="lg"
                    className="h-12 w-full text-sm sm:text-base font-semibold shadow-glow"
                    pendingLabel="Saving details…"
                  >
                    Complete Profile
                  </SubmitButton>
                </div>
              </div>
            </div>
          ) : null}
        </form>

        {/* Quiet footer */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-line/60 pt-4 text-xs text-ink-muted">
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
