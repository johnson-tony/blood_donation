"use client";

import { useActionState } from "react";

import { requestDonorContactAction } from "@/app/actions/blood-contact";
import { Alert } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { BLOOD_GROUPS } from "@/lib/constants";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";
import type { DonorSearchResult } from "@/lib/services/donor-search.service";

export function DonorContactForm({
  donor,
  defaults,
}: {
  donor: DonorSearchResult;
  defaults?: Partial<{
    hospital: string;
    unitsRequired: number;
    state: string;
    district: string;
    locality: string;
    urgency: "urgent" | "today" | "scheduled";
  }>;
}) {
  const [state, action] = useActionState(requestDonorContactAction, IDLE_FORM_STATE);

  return (
    <form action={action} className="space-y-6">
      {state.status === "error" ? <Alert tone="error" title="Could not contact donor">{state.message}</Alert> : null}

      <input type="hidden" name="donorId" value={donor.id} />
      <input type="hidden" name="bloodGroup" value={donor.bloodGroup} />

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Donor</p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{donor.name}</h1>
            <p className="mt-1 text-sm text-ink-secondary">{donor.bloodGroup} · {donor.locality}, {donor.district}</p>
          </div>
          <span className="rounded-full bg-mahogany-50 px-3 py-1.5 text-xs font-bold text-mahogany-700">Available</span>
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Blood need</p><h2 className="mt-1 text-lg font-bold">Where and when is help needed?</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-ink-secondary">Hospital</span><input name="hospital" required defaultValue={defaults?.hospital} placeholder="Hospital or treatment centre" className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" /></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-ink-secondary">Units required</span><input name="unitsRequired" type="number" min="1" max="20" required defaultValue={defaults?.unitsRequired ?? 1} className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" /></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-ink-secondary">State</span><input name="state" required defaultValue={defaults?.state} className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" /></label>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-ink-secondary">District</span><input name="district" required defaultValue={defaults?.district} className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-xs font-semibold text-ink-secondary">Village / locality</span><input name="locality" required defaultValue={defaults?.locality} className="h-12 w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm outline-none focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-600/10" /></label>
        </div>

        <fieldset className="mt-6">
          <legend className="mb-3 text-xs font-semibold text-ink-secondary">When is it needed?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["urgent", "Urgent", "Needed now"],
              ["today", "Today", "Needed today"],
              ["scheduled", "Scheduled", "Plan ahead"],
            ].map(([value, label, description]) => (
              <label key={value} className="cursor-pointer rounded-2xl border border-line-strong p-4 has-[:checked]:border-mahogany-600 has-[:checked]:bg-mahogany-50">
                <input type="radio" name="urgency" value={value} defaultChecked={defaults?.urgency ? defaults.urgency === value : value === "urgent"} className="sr-only" />
                <span className="block text-sm font-semibold">{label}</span><span className="mt-1 block text-xs text-ink-muted">{description}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <div className="rounded-2xl border border-mahogany-200 bg-mahogany-50 p-4 text-sm leading-6 text-ink-secondary">
        Your request will reveal the donor's phone number only after the contact request is created. It is not shown in donor search.
      </div>

      <SubmitButton size="lg" pendingLabel="Connecting…">Request donor contact</SubmitButton>
    </form>
  );
}
