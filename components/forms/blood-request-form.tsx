"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { createBloodRequestAction } from "@/app/actions/blood-request";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { BLOOD_GROUPS } from "@/lib/constants";
import { IDLE_FORM_STATE } from "@/lib/utils/form-action-state";

const URGENCY = [
  { value: "critical", title: "Critical", copy: "Needed immediately or within hours.", badge: "Emergency" },
  { value: "urgent", title: "Urgent", copy: "Needed today or very soon.", badge: "Today" },
  { value: "standard", title: "Planned", copy: "Needed later with time to coordinate.", badge: "Planned" },
] as const;

export function BloodRequestForm({ defaults }: { defaults: { phone: string; state: string; district: string; locality: string } }) {
  const [state, formAction] = useActionState(createBloodRequestAction, IDLE_FORM_STATE);
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("");
  const [units, setUnits] = useState(1);

  return (
    <form action={formAction} className="space-y-5 pb-28 sm:pb-0">
      {state.status === "error" ? <Alert tone="error" title="Request not created">{state.message}</Alert> : null}

      <section className="overflow-hidden rounded-[28px] bg-mahogany-700 p-6 text-white shadow-overlay sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mahogany-100">Blood request</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Find the right donor, faster.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">Tell us exactly what is needed. Your request will be stored securely and will be ready for compatible donor matching.</p>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Need</p>
          <h2 className="mt-1 text-lg font-bold text-ink">Blood requirement</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BLOOD_GROUPS.map((group) => {
            const selected = bloodGroup === group;
            return <button key={group} type="button" onClick={() => setBloodGroup(group)} aria-pressed={selected} className={`min-h-20 rounded-[20px] border text-lg font-bold transition-all active:scale-[0.98] ${selected ? "border-mahogany-600 bg-mahogany-600 text-white shadow-raised" : "border-line bg-canvas text-ink hover:border-mahogany-300"}`}>{group}</button>;
          })}
        </div>
        <input type="hidden" name="bloodGroup" value={bloodGroup} />
        {state.fieldErrors?.bloodGroup?.[0] ? <p className="mt-2 text-sm text-mahogany-700">{state.fieldErrors.bloodGroup[0]}</p> : null}

        <div className="mt-6">
          <label className="text-sm font-semibold text-ink" htmlFor="units">Units required</label>
          <div className="mt-2 flex items-center gap-3">
            <button type="button" aria-label="Decrease units" onClick={() => setUnits(Math.max(1, units - 1))} className="flex size-12 items-center justify-center rounded-2xl border border-line-strong text-xl font-semibold text-ink active:scale-95">−</button>
            <div className="flex h-12 min-w-20 items-center justify-center rounded-2xl bg-mahogany-50 px-5 text-lg font-bold text-mahogany-700">{units} {units === 1 ? "unit" : "units"}</div>
            <button type="button" aria-label="Increase units" onClick={() => setUnits(Math.min(10, units + 1))} className="flex size-12 items-center justify-center rounded-2xl border border-line-strong text-xl font-semibold text-ink active:scale-95">+</button>
          </div>
          <input type="hidden" id="units" name="units" value={units} />
          {state.fieldErrors?.units?.[0] ? <p className="mt-2 text-sm text-mahogany-700">{state.fieldErrors.units[0]}</p> : null}
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Priority</p><h2 className="mt-1 text-lg font-bold text-ink">How urgent is this?</h2></div>
        <div className="space-y-3">
          {URGENCY.map((option) => {
            const selected = urgency === option.value;
            return <button key={option.value} type="button" onClick={() => setUrgency(option.value)} aria-pressed={selected} className={`flex w-full items-center justify-between gap-4 rounded-[20px] border p-4 text-left transition-all active:scale-[0.99] ${selected ? "border-mahogany-600 bg-mahogany-50" : "border-line bg-canvas"}`}>
              <span><span className="block text-sm font-semibold text-ink">{option.title}</span><span className="mt-1 block text-sm text-ink-muted">{option.copy}</span></span>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${selected ? "bg-mahogany-600 text-white" : "bg-surface-muted text-ink-subtle"}`}>{option.badge}</span>
            </button>;
          })}
        </div>
        <input type="hidden" name="urgency" value={urgency} />
        {state.fieldErrors?.urgency?.[0] ? <p className="mt-2 text-sm text-mahogany-700">{state.fieldErrors.urgency[0]}</p> : null}
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">When & where</p><h2 className="mt-1 text-lg font-bold text-ink">Where should help arrive?</h2></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="neededBy" name="neededBy" type="datetime-local" label="Blood needed by" required error={state.fieldErrors?.neededBy?.[0]} />
          <Input id="hospitalName" name="hospitalName" type="text" label="Hospital / medical centre" placeholder="e.g. St. John's Hospital" required error={state.fieldErrors?.hospitalName?.[0]} />
          <Input id="state" name="state" type="text" label="State" defaultValue={defaults.state} required error={state.fieldErrors?.state?.[0]} />
          <Input id="district" name="district" type="text" label="District" defaultValue={defaults.district} required error={state.fieldErrors?.district?.[0]} />
          <Input id="locality" name="locality" type="text" label="Area / locality" defaultValue={defaults.locality} required containerClassName="sm:col-span-2" error={state.fieldErrors?.locality?.[0]} />
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-mahogany-600">Contact</p><h2 className="mt-1 text-lg font-bold text-ink">Who should donors contact?</h2><p className="mt-1 text-sm text-ink-muted">Use a number that can actually answer when a donor responds.</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input id="patientRelation" name="patientRelation" type="text" label="Relationship to patient" placeholder="e.g. Brother, parent, friend" required error={state.fieldErrors?.patientRelation?.[0]} />
          <Input id="contactPhone" name="contactPhone" type="tel" label="Contact number" defaultValue={defaults.phone} required error={state.fieldErrors?.contactPhone?.[0]} />
        </div>
        <div className="mt-5">
          <label htmlFor="note" className="text-sm font-medium text-ink">Additional note <span className="font-normal text-ink-subtle">(optional)</span></label>
          <textarea id="note" name="note" rows={4} maxLength={500} placeholder="Anything donors should know before responding?" className="mt-1.5 block w-full resize-none rounded-2xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink outline-none transition focus:border-mahogany-600 focus:ring-4 focus:ring-mahogany-100" />
          {state.fieldErrors?.note?.[0] ? <p className="mt-1 text-sm text-mahogany-700">{state.fieldErrors.note[0]}</p> : null}
        </div>
      </section>

      <div className="sticky bottom-3 z-20 flex gap-2 rounded-[22px] border border-line bg-canvas/95 p-2 shadow-overlay backdrop-blur-xl">
        <Link href="/dashboard" className="flex min-h-12 flex-1 items-center justify-center rounded-xl px-4 text-sm font-semibold text-ink-muted">Cancel</Link>
        <SubmitButton pendingLabel="Creating request…" size="lg" className="flex-1">Create blood request</SubmitButton>
      </div>
    </form>
  );
}
