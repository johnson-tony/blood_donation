"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { updateProfileAction } from "@/app/actions/profile";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { BLOOD_GROUPS } from "@/types/user";
import type { ProfileDTO } from "@/types/user";

const steps = [
  { eyebrow: "01", title: "Your blood type", subtitle: "This is the most important detail for matching you." },
  { eyebrow: "02", title: "Where can we reach you?", subtitle: "We use your area to prioritise nearby matches." },
  { eyebrow: "03", title: "Stay reachable", subtitle: "Choose when you're open to helping someone." },
] as const;

export function DonorOnboarding({ profile }: { profile: ProfileDTO }) {
  const [state, formAction] = useActionState(updateProfileAction, IDLE_FORM_STATE);
  const [step, setStep] = useState(0);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup ?? "");
  const [availability, setAvailability] = useState<"" | "available" | "unavailable">(
    profile.availableToDonate === null ? "" : profile.availableToDonate ? "available" : "unavailable",
  );

  const next = () => {
    if (step === 0 && !bloodGroup) return;
    if (step === 1) return setStep(2);
    setStep((value) => Math.min(value + 1, 2));
  };

  return (
    <div className="min-h-dvh bg-canvas">
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-28 pt-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-ink" aria-label="BloodLink home">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-mahogany-600 text-white shadow-raised">
              <span className="text-base font-bold">+</span>
            </span>
            BloodLink
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            {step + 1} / 3
          </span>
        </header>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-mahogany-100" aria-label={`Step ${step + 1} of 3`}>
          <div className="h-full rounded-full bg-mahogany-600 transition-all duration-300" style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>

        <main className="flex-1 pt-12 sm:pt-16">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mahogany-600">{steps[step].eyebrow} · Donor setup</p>
            <h1 className="mt-3 max-w-md text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">{steps[step].title}</h1>
            <p className="mt-3 max-w-md text-[15px] leading-6 text-ink-muted">{steps[step].subtitle}</p>
          </div>

          {state.status === "error" ? (
            <Alert tone="error" title="We couldn't save that">{state.message}</Alert>
          ) : null}

          {step === 0 ? (
            <section aria-label="Choose blood group">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BLOOD_GROUPS.map((group) => {
                  const selected = bloodGroup === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setBloodGroup(group)}
                      aria-pressed={selected}
                      className={`group relative flex min-h-24 flex-col items-center justify-center rounded-[22px] border p-4 text-center transition-all active:scale-[0.98] ${
                        selected
                          ? "border-mahogany-600 bg-mahogany-600 text-white shadow-raised"
                          : "border-line bg-surface text-ink shadow-card hover:border-mahogany-300 hover:bg-mahogany-50"
                      }`}
                    >
                      <span className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${selected ? "text-mahogany-100" : "text-ink-subtle"}`}>Blood</span>
                      <span className="text-2xl font-bold tracking-tight">{group}</span>
                      {selected ? <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-white/15 text-xs">✓</span> : null}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-mahogany-100 bg-mahogany-50 p-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-mahogany-700 shadow-card">i</span>
                <p className="text-sm leading-5 text-ink-secondary">Your blood group is only used to match you with compatible blood requests.</p>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="space-y-5" aria-label="Your location">
              <Input id="state" name="state" label="State" autoComplete="address-level1" defaultValue={profile.state ?? ""} required error={state.fieldErrors?.state?.[0]} />
              <Input id="district" name="district" label="District" autoComplete="address-level2" defaultValue={profile.district ?? ""} required error={state.fieldErrors?.district?.[0]} />
              <Input id="locality" name="locality" label="Area / locality" autoComplete="address-level3" defaultValue={profile.locality ?? ""} required hint="A neighbourhood, town or village is enough." error={state.fieldErrors?.locality?.[0]} />
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-5" aria-label="Contact and availability">
              <div className="rounded-[24px] border border-line bg-surface p-5 shadow-card">
                <p className="text-sm font-semibold text-ink">How should we reach you?</p>
                <p className="mt-1 text-sm text-ink-muted">Your number stays private until a connection is made.</p>
                <div className="mt-4">
                  <Input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" label="Mobile number" placeholder="+91 98765 43210" defaultValue={profile.phone ?? ""} required error={state.fieldErrors?.phone?.[0]} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink">Are you available to donate?</p>
                <p className="mt-1 text-sm text-ink-muted">You can change this whenever you want.</p>
                <div className="mt-4 grid gap-3">
                  {[
                    { value: "available" as const, title: "Yes, I'm available", text: "Let nearby people find me when they need my blood." },
                    { value: "unavailable" as const, title: "Not right now", text: "Keep my profile, but don't show me as available." },
                  ].map((option) => {
                    const selected = availability === option.value;
                    return (
                      <button key={option.value} type="button" onClick={() => setAvailability(option.value)} aria-pressed={selected}
                        className={`flex min-h-20 items-center gap-4 rounded-[22px] border px-5 py-4 text-left transition-all ${
                          selected ? "border-mahogany-600 bg-mahogany-50 shadow-card" : "border-line bg-surface hover:border-line-strong"
                        }`}>
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-mahogany-600 bg-mahogany-600 text-white" : "border-line-strong"}`}>{selected ? "✓" : ""}</span>
                        <span className="min-w-0"><span className="block text-sm font-semibold text-ink">{option.title}</span><span className="mt-1 block text-sm leading-5 text-ink-muted">{option.text}</span></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : null}

          <form action={formAction} className="contents">
            <input type="hidden" name="name" value={profile.name} />
            <input type="hidden" name="bloodGroup" value={bloodGroup} />
            <input type="hidden" name="state" value={profile.state ?? ""} />
            <input type="hidden" name="district" value={profile.district ?? ""} />
            <input type="hidden" name="locality" value={profile.locality ?? ""} />
            <input type="hidden" name="phone" value={profile.phone ?? ""} />
            <input type="hidden" name="availability" value={availability} />
            <input id="onboarding-state" type="hidden" name="onboarding" value="true" />
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/95 px-5 py-4 backdrop-blur-xl sm:static sm:mt-10 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
              <div className="mx-auto flex max-w-xl gap-3">
                {step > 0 ? (
                  <Button type="button" variant="secondary" size="lg" className="w-1/3" onClick={() => setStep((value) => value - 1)}>Back</Button>
                ) : null}
                {step < 2 ? (
                  <Button type="button" size="lg" className="flex-1" onClick={next} disabled={step === 0 && !bloodGroup}>Continue</Button>
                ) : (
                  <SubmitButton pendingLabel="Saving profile…" size="lg" className="flex-1">Finish setup</SubmitButton>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
