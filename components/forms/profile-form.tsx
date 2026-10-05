"use client";

import { useActionState, useState } from "react";

import { updateProfileAction } from "@/app/actions/profile";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { ProfileImageField } from "@/components/forms/profile-image-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import { BLOOD_GROUPS } from "@/lib/constants";
import type { ProfileDTO } from "@/types/user";

const AVAILABILITY_OPTIONS = [
  { value: "available" as const, title: "Available to donate", description: "Let compatible requests know you can help." },
  { value: "unavailable" as const, title: "Not available", description: "Keep your profile private from active matching." },
];

export function ProfileForm({ profile }: { profile: ProfileDTO }) {
  const [state, formAction] = useActionState(updateProfileAction, IDLE_FORM_STATE);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup ?? "");
  const [availability, setAvailability] = useState<"" | "available" | "unavailable">(
    profile.availableToDonate === null ? "" : profile.availableToDonate ? "available" : "unavailable",
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" ? <Alert tone="error" title="Profile not saved">{state.message}</Alert> : null}
      {state.status === "success" ? <Alert tone="success" title="Profile updated">{state.message}</Alert> : null}

      <section className="overflow-hidden rounded-[28px] bg-mahogany-700 p-6 text-white shadow-overlay sm:p-8">
        <div className="flex items-center gap-4">
          <ProfileImageField name={profile.name} initialImage={profile.profileImage} />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-mahogany-100">Donor profile</p>
            <h1 className="mt-1 truncate text-2xl font-bold tracking-tight">{profile.name}</h1>
            <p className="mt-1 text-sm text-white/65">{profile.email}</p>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-white/60">Blood group</p><p className="mt-1 text-2xl font-bold">{bloodGroup || "—"}</p></div>
          <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-white/60">Status</p><p className="mt-1 text-sm font-semibold">{availability === "available" ? "Available" : availability === "unavailable" ? "Not available" : "Not set"}</p></div>
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Identity</p><h2 className="mt-1 text-lg font-bold text-ink">Personal details</h2></div>
        <div className="space-y-5">
          <Input id="name" name="name" type="text" label="Full name" autoComplete="name" defaultValue={profile.name} required error={state.fieldErrors?.name?.[0]} />
          <Input id="phone" name="phone" type="tel" label="Mobile number" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" defaultValue={profile.phone ?? ""} required hint="Used only when a donor connection needs to reach you." error={state.fieldErrors?.phone?.[0]} />
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Compatibility</p><h2 className="mt-1 text-lg font-bold text-ink">Blood group</h2></div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BLOOD_GROUPS.map((group) => {
            const selected = bloodGroup === group;
            return <button key={group} type="button" onClick={() => setBloodGroup(group)} aria-pressed={selected} className={`min-h-20 rounded-[20px] border font-bold transition-all active:scale-[0.98] ${selected ? "border-mahogany-600 bg-mahogany-600 text-white shadow-raised" : "border-line bg-canvas text-ink hover:border-mahogany-300"}`}>{group}</button>;
          })}
        </div>
        <input type="hidden" name="bloodGroup" value={bloodGroup} />
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Visibility</p><h2 className="mt-1 text-lg font-bold text-ink">Donor availability</h2><p className="mt-1 text-sm text-ink-muted">You can change this whenever your situation changes.</p></div>
        <div className="space-y-3">
          {AVAILABILITY_OPTIONS.map((option) => {
            const selected = availability === option.value;
            return <button key={option.value} type="button" onClick={() => setAvailability(option.value)} aria-pressed={selected} className={`flex w-full items-center gap-4 rounded-[20px] border p-4 text-left transition-all active:scale-[0.99] ${selected ? "border-mahogany-600 bg-mahogany-50" : "border-line bg-canvas"}`}><span className={`flex size-10 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-mahogany-600 bg-mahogany-600 text-white" : "border-line-strong"}`}>{selected ? "✓" : ""}</span><span><span className="block text-sm font-semibold text-ink">{option.title}</span><span className="mt-1 block text-sm text-ink-muted">{option.description}</span></span></button>;
          })}
        </div>
        <input type="hidden" name="availability" value={availability} />
        {state.fieldErrors?.availability?.[0] ? <p className="mt-2 text-sm text-mahogany-700">{state.fieldErrors.availability[0]}</p> : null}
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Area</p><h2 className="mt-1 text-lg font-bold text-ink">Where can you help?</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="state" name="state" type="text" label="State" autoComplete="address-level1" defaultValue={profile.state ?? ""} required error={state.fieldErrors?.state?.[0]} />
          <Input id="district" name="district" type="text" label="District" autoComplete="address-level2" defaultValue={profile.district ?? ""} required error={state.fieldErrors?.district?.[0]} />
          <Input id="locality" name="locality" type="text" label="Area / locality" autoComplete="address-level3" containerClassName="sm:col-span-2" defaultValue={profile.locality ?? ""} required hint="A neighbourhood, town or village is enough." error={state.fieldErrors?.locality?.[0]} />
        </div>
      </section>

      <div className="sticky bottom-3 z-10 flex rounded-[22px] border border-line bg-canvas/95 p-2 shadow-overlay backdrop-blur-xl sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none">
        <SubmitButton pendingLabel="Saving changes…" size="lg">Save changes</SubmitButton>
      </div>
    </form>
  );
}
